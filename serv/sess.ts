import * as express from 'express';
import { User } from '../models/user';

interface IReqSession {
    user?: User
}

// declare module "express-serve-static-core" {
//     interface Request {
//         session: IReqSession
//     }
// }

export default function createSesssionObject(): express.RequestHandler {
    return (req, resp, next) => {
        req.session = {};
        next();
    };
}