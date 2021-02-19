import express from 'express';
export const userRouter = express.Router();

import * as role from '../../../middleware/role';
import * as auth from '../../../middleware/auth';
import { ValidationMiddleware } from '../../../middleware/validation';
import { User } from './user.controller'
let user_controller = new User();
let validation_controller = new ValidationMiddleware()

userRouter.post('/register', validation_controller.validateUserRegistration(), user_controller.register);

userRouter.post('/login', validation_controller.validateUserLogin(), user_controller.login);

userRouter.post("/social_signin", validation_controller.validateSocialLogin(), user_controller.socialLogin)

// userRouter.get('/get', auth.isAuthenticated(), controller.get)

// module.exports = router;