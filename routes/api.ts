import expess from "express";
const app = expess();

import { userRouter } from "../app/http/controller/api/user";
import { categoryRouter } from "../app/http/controller/api/category/admin";
import { subCategoryRouter } from "../app/http/controller/api/subCategory/admin";

app.use("/users", userRouter);
app.use("/category/admin", categoryRouter);
app.use("/sub_category/admin", subCategoryRouter);

module.exports = app;