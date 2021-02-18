"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = require("../app/http/controller/api/web/error");
let app = express_1.default();
app.use("/", error_1.webRouter);
module.exports = app;
//# sourceMappingURL=web.js.map