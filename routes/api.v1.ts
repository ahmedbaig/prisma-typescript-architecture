import express from "express";
import { userRouter } from "../app/http/controller/api.v1/user";
const app = express();

app.use("/users", userRouter);


module.exports = app;