import expess from "express";
import { errorRouter } from "../app/http/controller/api/web/error";
import { verificationRouter } from "../app/http/controller/api/web/verification"

module.exports = function (app) {
    app.use("/error", errorRouter);
    app.use("/verification", verificationRouter);
}