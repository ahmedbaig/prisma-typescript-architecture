"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../app/http/controller/api/web/error");
const resources_1 = require("../app/http/controller/api/web/resources");
const verification_1 = require("../app/http/controller/api/web/verification");
module.exports = function (app) {
    app.use("/error", error_1.errorRouter);
    app.use("/resources", resources_1.resourceRouter);
    app.use("/verification", verification_1.verificationRouter);
};
//# sourceMappingURL=web.js.map