'use strict';

import express from 'express';
import * as controller from './resources.controller'

export const resourceRouter = express.Router();

resourceRouter.get('/images/:filename', controller.public_image_get);
