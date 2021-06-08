import express from "express";
import { authRouter } from "../app/http/controller/api.v1/auth";
import { userRouter } from "../app/http/controller/api.v1/user";
import { userAdminRouter } from "../app/http/controller/api.v1/user/admin"; 
const app = express();

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/users/admin", userAdminRouter);

module.exports = app;