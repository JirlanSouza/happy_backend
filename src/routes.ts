import { Router } from 'express';
import multer from 'multer';

import AuthMidlleware from './midlleware/authMidlleware';
import uploadConfig from './config/upload';
import UserController from './controllers/UsersController';
import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/users', AuthMidlleware, UserController.index);
routes.get('/users/:id', AuthMidlleware, UserController.show);
routes.post('/users', UserController.create);
routes.post('/users/signIn', UserController.signIn);
routes.post('/users/forgot', UserController.forgot);
routes.put('/users/resete_password', UserController.resetPassword);

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;