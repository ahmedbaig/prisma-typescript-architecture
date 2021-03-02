import express from "express";
import { SubCategory } from "./subcategory.controller";
import { RoleMiddleware } from "../../../../middleware/role";
import { AuthenticationMiddleware } from '../../../../middleware/auth';
import { ValidationMiddleware } from '../../../../middleware/validation';
import { upload } from '../../../../../constants/multer';
export const subCategoryRouter = express.Router();

let subCategoryController = new SubCategory();
let validation_controller = new ValidationMiddleware()
let auth_controller = new AuthenticationMiddleware();
let role_controller = new RoleMiddleware();

subCategoryRouter.post(
    "/create",
    auth_controller.isAuthenticated(),
    role_controller.isSuperAdmin(),
    upload.single("image"),
    validation_controller.validateCategory(),
    subCategoryController.createSubCategory)

