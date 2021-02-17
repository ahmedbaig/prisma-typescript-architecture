import expess from "express";
let app = expess();
import { userRouter } from "../app/http/controller/api/user";
app.use("/users", userRouter);

module.exports = app;