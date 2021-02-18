"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_email = void 0;
const path_1 = __importDefault(require("path"));
const auth_service_1 = require("../../../../services/auth.service");
const user_service_1 = require("../../../../services/user.service");
const mail_1 = require("../../../../mail");
const globalAny = global;
globalAny.ROOTPATH = __dirname;
let verify_email = (req, res) => {
    auth_service_1.verifyNewAccountToken(req.params.token, {
        errorCallback: (error) => {
            var errorBags = [{
                    message: error.msg,
                },];
            res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
            return;
        },
        callback: (data) => {
            user_service_1.findById(data.userId).then((user = {}) => {
                if (data.token) { // User has an expired token 
                    if (user == null) {
                        var errorBags = [{
                                message: "User not found",
                            },];
                        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                        return;
                    }
                    mail_1.sendUserVerifyEmail({
                        token: data.token.token.token,
                        user
                    }).then(data => {
                        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/pages/verify-email-resend.ejs"), {
                            email: user.email,
                        });
                        return;
                    }).catch(error => {
                        res.status(error.status).send(error);
                        return;
                    });
                }
                else { // DONE 
                    user_service_1.update({ _id: user._id }, { isEmailVerified: true })
                        .then(() => {
                        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/pages/verify-email.ejs"), {
                            email: user.email,
                        });
                    }).catch(error => {
                        var errorBags = [{
                                message: error.msg,
                            },];
                        res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                        return;
                    });
                }
            }).catch((error) => {
                var errorBags = [{
                        message: error.msg,
                    },];
                res.render(path_1.default.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                return;
            });
        }
    });
};
exports.verify_email = verify_email;
//# sourceMappingURL=verification.controller.js.map