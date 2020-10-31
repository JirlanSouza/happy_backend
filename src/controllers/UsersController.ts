import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mailTranspoter from '../config/mail';
import mailHtml from '../resources/forgotPasswordMail';

export default {

    async index(request:Request, response: Response) {
        const UsersRepository = getRepository(User);

        const users = await UsersRepository.find();

        return response.json(users)
    },

    async show(request:Request, response: Response) {
        const { id } = request.params;

        const UsersRepository = getRepository(User);

        const user = await UsersRepository.findOneOrFail(id);

        return response.json(user);
    },

    async create(request:Request, response: Response) {
        const { name, email, password, type = 1 } = request.body;

        const userRepository = getRepository(User);

        const exitUser = (await userRepository.count({ email })) >= 1
        
        if (exitUser) {
            return response.status(401).json({error: "User already exist"})
        }
        
        const data = {
            id: uuidv4(),
            name,
            email,
            password,
            type,
        }
        
        const schema = Yup.object().shape({
            id: Yup.string().required(),
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required().min(6, "Password must be at least 6 characters"),
            type: Yup.number().required(),
        });

        await schema.validate(data, { 
            abortEarly: true,
        });

        const salt = bcrypt.genSaltSync();
        const encriptedPassword = bcrypt.hashSync(password, salt);

        data.password = encriptedPassword

        const user = await userRepository.create(data);

        await userRepository.save(user);

        response.status(201).json(user);
    },

    async signIn(request:Request, response: Response) {
        const { email, password } = request.body;

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({email: email});

        if(!user) {
            return response.status(401).json({error: 'User not found'});
        }

        const { id, name } = user;

        const isValidPassword  = await bcrypt.compare(password, user.password);
        
        if(!isValidPassword) {
            return response.status(401).json({error: 'Invalid password'});
        }

        const token = await  jwt.sign({ id: id }, process.env.HASH_TOKEN as string, {
            expiresIn: 86400
        });
        const responseData = {
            token,
            user: {
                id,
                name,
                email
            }
        }

        response.status(201).json(responseData);
    },

    async forgot(request:Request, response: Response) {
        const { email } = request.body;

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ email: email });
        
        if(!user) {
            return response.status(406).json({error: 'Acount not found'});
        }

        const forgotToken = crypto.randomBytes(20).toString("hex");
        const expiresForgotToken = Date.now() + 3600
        const { name } = user;

        try {
            const mailSended = await mailTranspoter.sendMail({
                from: '"Happy" <admin@happyapp.com>',
                to: email,
                subject: "Resetar senha",
                html: mailHtml({ forgotToken, name}),
            
            });
    
            if (mailSended) {

                await userRepository.update({ email },{ forgotToken, expiresForgotToken })
    
                return response.status(200).json({ message: "Mail sended sucefull" })
            }
        } catch (error) {

            response.status(401).json({ message: "Failed to send mail", error })
        }

    },

    async resetPassword(request:Request, response: Response) {
        const { forgotToken, newPassword } = request.body;

        const userRepository = getRepository(User);

        const userWithForgotToken = await userRepository.findOne( {forgotToken });

        if (!userWithForgotToken) {
            return response.status(401).json({error: 'Token invalid'});
        }

        const isTokenExpired = userWithForgotToken.expiresForgotToken <= Date.now();

        if (!isTokenExpired) {
            return response.status(401).json({error: 'Token expired'});
        }

        const salt = bcrypt.genSaltSync();
        const encriptedPassword = bcrypt.hashSync(newPassword, salt);

        await userRepository.update(userWithForgotToken, {password: encriptedPassword, forgotToken: ""})

        response.status(200).json({ message: 'Password reset successfully'})
    }
}