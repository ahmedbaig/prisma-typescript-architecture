import express from 'express';
export const errorRouter = express.Router();

import { Error } from './error.controller';
let error_controller = new Error()

errorRouter.get('/401', error_controller.unauthorized );

errorRouter.get('/403', error_controller.forbidden );

errorRouter.get('/404', error_controller.not_found_page);

errorRouter.get('/500', error_controller.internal_server_error);
