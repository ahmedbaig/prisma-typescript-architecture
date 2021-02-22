import expess from "express";
const app = expess();

import { userRouter } from "../app/http/controller/api/user";
import { categoryRouter } from "../app/http/controller/api/category/admin"
app.use("/users", userRouter);
app.use("/category/admin", categoryRouter)
module.exports = app;