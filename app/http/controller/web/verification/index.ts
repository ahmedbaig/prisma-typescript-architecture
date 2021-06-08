
import express from "express";
export const verificationRouter = express.Router();

import { Verification } from "./verification.controller";
let verification_obj = new Verification()
