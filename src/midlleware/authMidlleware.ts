import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';

export default async (request:Request, response: Response,  next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({error: 'No token provided'});
    }

    const [ scheme, token ] = authHeader.split(' ');
    
    if (/^Bearer$^/i.test(scheme)) {
        return response.status(401).json({error: 'Token mal formated'})
    }

    interface Decoded {
        id: string;
        iat: string;
        exp: string;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.HASH_TOKEN as string);
        const { id } = decoded as Decoded

        request.body.userId = id
        next()
    } catch {
        return response.status(401).json({error: 'Token invalid'});
    }
}