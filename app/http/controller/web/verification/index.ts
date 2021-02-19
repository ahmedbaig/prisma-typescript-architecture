
import expess from "express";
import { Verification } from "./verification.controller";
export const verificationRouter = expess.Router();

let verification_obj = new Verification()

verificationRouter.get("/email/:token", verification_obj.verify_email)