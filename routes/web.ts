import expess from "express";
import { errorRouter } from "../app/http/controller/api/web/error";
import { resourceRouter } from "../app/http/controller/api/web/resources";
import { verificationRouter } from "../app/http/controller/api/web/verification"

module.exports = function (app) {
    app.use("/error", errorRouter);

    app.use("/resources", resourceRouter);

    app.use("/verification", verificationRouter);
}