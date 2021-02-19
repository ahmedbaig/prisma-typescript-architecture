
import expess from "express";
export const verificationRouter = expess.Router();

import { Verification } from "./verification.controller";
let verification_obj = new Verification()

verificationRouter.get("/email/:token", verification_obj.verify_email)