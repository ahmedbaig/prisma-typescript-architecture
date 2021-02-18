import expess from "express";
import { errorRouter } from "../app/http/controller/api/web/error";
import { verificationRouter } from "../app/http/controller/api/web/verification"
let app = expess();

app.use("/error", errorRouter);
app.use("/verification", verificationRouter);
module.exports = app;