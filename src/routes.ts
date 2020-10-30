import { Router } from 'express';
import multer from 'multer';

import AuthMidlleware from './midlleware/authMidlleware';
import uploadConfig from './config/upload';
import UserController from './controllers/UsersController';
import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/users',AuthMidlleware, UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.create);
routes.post('/users/signIn', UserController.signIn);

routes.get('/orphanages', AuthMidlleware, OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;