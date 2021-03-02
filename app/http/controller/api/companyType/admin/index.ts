import express from "express";

import { CompanyTypeController } from "./companyType.controller";
import { RoleMiddleware } from "../../../../middleware/role";
import { AuthenticationMiddleware } from '../../../../middleware/auth';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { upload } from '../../../../../constants/multer';
export const subCategoryRouter = express.Router();

let companyTypeController = new CompanyTypeController();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware();
let role_controller = new RoleMiddleware();

export const companyTypeRouter = express.Router();

companyTypeRouter.post(
    "/create",
    auth_controller.isAuthenticated(),
    role_controller.isSuperAdmin(),
    upload.single("image"),
    validation_controller.validateCategory(),
    companyTypeController.create)