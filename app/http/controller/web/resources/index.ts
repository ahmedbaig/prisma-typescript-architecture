import express from 'express';
export const resourceRouter = express.Router();

import { Resources } from './resources.controller';
let resources_controller = new Resources();

resourceRouter.get('/images/:filename', resources_controller.public_image_get);

resourceRouter.get('/cloudinary/images/:userId/:filename', resources_controller.cloudinary_image_get);

resourceRouter.get('/css/:filename', resources_controller.public_css_get);
