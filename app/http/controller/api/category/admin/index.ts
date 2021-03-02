import express from "express";
import { Category } from "./category.controller";
import { RoleMiddleware } from "../../../../middleware/role";
import { AuthenticationMiddleware } from '../../../../middleware/auth';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { upload } from '../../../../../constants/multer';
export const categoryRouter = express.Router();

let categoryController = new Category();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware();
let role_controller = new RoleMiddleware();

categoryRouter.post("/create", auth_controller.isAuthenticated(), role_controller.isSuperAdmin(), upload.single("image"), validation_controller.validateCategory(), categoryController.createService)



