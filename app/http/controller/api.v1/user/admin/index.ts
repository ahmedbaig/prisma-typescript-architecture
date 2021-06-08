import express from 'express';
import { AuthenticationMiddleware } from '../../../../middleware/auth';
import { CacheMiddleware } from '../../../../middleware/cache';
export const userAdminRouter = express.Router();

import { RoleMiddleware } from '../../../../middleware/role';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { User } from './user.admin.controller'

let user_controller = new User();
let validation_controller = new ValidationMiddleware()
let cache_controller = new CacheMiddleware()
let auth_controller = new AuthenticationMiddleware()
let role_controller = new RoleMiddleware()

userAdminRouter.get('/', auth_controller.isAuthenticated(), role_controller.isAdmin(), user_controller.get)

userAdminRouter.post('/:id', auth_controller.isAuthenticated(), role_controller.isAdmin(), validation_controller.validateAdminUserUpdate(), user_controller.update);