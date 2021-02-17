"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let app = express_1.default();
const user_1 = require("../app/http/controller/api/user");
app.use("/users", user_1.userRouter);
module.exports = app;
//# sourceMappingURL=api.js.map