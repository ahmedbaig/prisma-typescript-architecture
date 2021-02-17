"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSocialLogin = exports.validateUserLogin = exports.validateUserRegistration = void 0;
var compose = require("composable-middleware");
const validate_1 = __importDefault(require("../controller/validate"));
let validateUserRegistration = () => {
    return (compose()
        .use(function (req, res, next) {
        const { error } = validate_1.default.validateRegisterData(req.body);
        if (error) {
            var errors = {
                success: false,
                msg: error.details[0].message,
                data: error.name,
            };
            res.status(400).send(errors);
            return;
        }
        else {
            next();
        }
    }));
};
exports.validateUserRegistration = validateUserRegistration;
let validateUserLogin = () => {
    return (compose()
        .use(function (req, res, next) {
        const { error } = validate_1.default.validateLoginData(req.body);
        if (error) {
            var errors = {
                success: false,
                msg: error.details[0].message,
                data: error.name,
            };
            res.status(400).send(errors);
            return;
        }
        else {
            next();
        }
    }));
};
exports.validateUserLogin = validateUserLogin;
let validateSocialLogin = () => {
    return (compose()
        .use(function (req, res, next) {
        const { error } = validate_1.default.socialLoginData(req.body);
        if (error) {
            var errors = {
                success: false,
                msg: error.details[0].message,
                data: error.name,
            };
            res.status(400).send(errors);
        }
        else {
            next();
        }
    }));
};
exports.validateSocialLogin = validateSocialLogin;
//# sourceMappingURL=validation.js.map