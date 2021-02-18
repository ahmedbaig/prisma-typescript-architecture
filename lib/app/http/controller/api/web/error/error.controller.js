"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal_server_error = exports.not_found_page = void 0;
const path_1 = __importDefault(require("path"));
const globalAny = global;
globalAny.ROOTPATH = __dirname;
let not_found_page = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/404.ejs"));
    });
};
exports.not_found_page = not_found_page;
let internal_server_error = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.err == null || req.query.err == "") {
            req.query.err = "Misuse of resource";
        }
        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/500.ejs"), { error: req.query.err });
    });
};
exports.internal_server_error = internal_server_error;
//# sourceMappingURL=error.controller.js.map