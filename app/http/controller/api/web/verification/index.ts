
import expess from "express";
import * as controller from "./verification.controller"

export const verificationRouter = expess.Router();

verificationRouter.get("/email/:token", controller.verify_email)