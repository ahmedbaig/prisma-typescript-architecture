'use strict';

import express from 'express';
import * as auth from '../../../middleware/auth';
// var role = require('../../../middleware/role');
import * as validate from '../../../middleware/validation';
import * as controller from './user.controller'
export const userRouter = express.Router();

userRouter.post('/register', validate.validateUserRegistration(), controller.register);

userRouter.post('/login', validate.validateUserLogin(), controller.login);

userRouter.post("/social_signin", validate.validateSocialLogin(), controller.socialLogin)
// router.get('/get', auth.isAuthenticated(), controller.get)
// module.exports = router;