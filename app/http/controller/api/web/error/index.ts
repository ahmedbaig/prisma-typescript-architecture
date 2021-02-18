'use strict';

import express from 'express';
import * as controller from './error.controller'

export const errorRouter = express.Router();

errorRouter.get('404', controller.not_found_page);

errorRouter.get('500', controller.internal_server_error);
