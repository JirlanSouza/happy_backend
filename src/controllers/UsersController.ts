import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export default {

    async index(request:Request, response: Response) {
        const UsersRepository = getRepository(User);

        const Users = await UsersRepository.find();

        return response.json(Users)
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

        const salt = bcrypt.genSaltSync();
        const encriptedPassword = bcrypt.hashSync(password, salt);
        
        const data = {
            id: uuidv4(),
            name: name,
            email: email,
            password: encriptedPassword,
            type: type,
        }
        
        const schema = Yup.object().shape({
            id: Yup.string().required(),
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required(),
            type: Yup.number().required(),
        });

        await schema.validate(data, { 
            abortEarly: true,
        });

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
    }
}