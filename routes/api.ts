import expess from "express";
const app = expess();

import { userRouter } from "../app/http/controller/api/user";

app.use("/users", userRouter);

module.exports = app;