"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.login = exports.socialLogin = exports.register = void 0;
const _ = require('lodash');
const moment_1 = __importDefault(require("moment"));
const UserService = __importStar(require("../../../services/user.service"));
const auth_service_1 = require("../../../services/auth.service");
// import { sendUserVerifyEmail } from "../../../mail";
const redis_service_1 = require("../../../../cache/redis.service");
const google_auth_library_1 = require("google-auth-library");
let client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, '', '');
moment_1.default.fn.fromNow_seconds = function (a) {
    var duration = moment_1.default(this).diff(moment_1.default(), 'seconds');
    return duration;
};
let register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var duration = moment_1.default.duration(moment_1.default(new Date()).diff(moment_1.default(req.body.dob)));
            if (false) { //duration.asYears() <= 13
                res.status(409).send({ success: false, msg: "Details do not meet the required age limit" });
                return;
            }
            UserService.create(req.body).then(data => {
                res.status(200).send(data);
            }).catch((error) => {
                if (error.errors && error.errors.email && error.errors.email.message == 'The specified email address is already in use.') {
                    res.status(400).send({ msg: 'The specified email address is already in use.', success: false });
                }
                else if (error.errors && error.errors.email && error.errors.email.message == "Path `email` is required.") {
                    res.status(400).send({ msg: 'Email is required', success: false });
                }
                else if (error.message == 'Invalid password') {
                    res.status(400).send({ msg: 'Invalid password', success: false });
                }
                else {
                    res.status(500).send({ success: false, msg: error.message });
                }
            });
        }
        catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    });
};
exports.register = register;
//************************ SOCIAL LOGIN ***************************//
let socialLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //social login document
    //https://spyna.medium.com/how-really-protect-your-rest-api-after-social-login-with-node-js-3617c336ebed
    console.log(process.env.GOOGLE_CLIENT_ID, 'process.env.GOOGLE_CLIENT_ID');
    client.verifyIdToken({ idToken: req.body.token, audience: process.env.GOOGLE_CLIENT_ID })
        .then((login) => {
        console.log("🚀 ~ file: user.controller.ts ~ line 52 ~ .then ~ login", login);
    }).then((user) => {
        console.log("🚀 ~ file: user.controller.ts ~ line 67 ~ .then ~ user", user);
    }).catch(err => {
        //throw an error if something gos wrong
        console.log("error while authenticating google user: " + JSON.stringify(err));
    });
    res.send("success");
});
exports.socialLogin = socialLogin;
//************************ LOGIN CONTROLLER ***********************//
let login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { email, password, type } = req.body;
            UserService.findOne({
                email,
                isDeleted: false,
            }).then((user = {}) => {
                if (!user) {
                    var errors = {
                        success: false,
                        msg: "No user with this account exists!",
                    };
                    res.status(200).send(errors);
                    return;
                }
                if (user.type != type) {
                    var errors = {
                        success: false,
                        msg: "User type provided does not match",
                    };
                    res.status(400).send(errors);
                    return;
                }
                UserService.passwordCheck({ user, password })
                    .then(() => {
                    auth_service_1.generateAuthToken({ _id: user._id, type: user.type }, (token) => {
                        redis_service_1.setUserStateToken(token, moment_1.default(moment_1.default().add(48, 'hours')).fromNow_seconds())
                            .then(() => {
                            user = _.pick(user, [
                                "_id",
                                "type",
                                "profile_img",
                                "email",
                                "phoneNo",
                                "firstName",
                                "lastName",
                                "dob",
                                "address_1",
                                "address_2",
                                "country",
                                "city",
                                "state",
                                "postal_code",
                            ]);
                            user['access_token'] = token;
                            var success = { success: true, msg: "Logged in successfully", user };
                            res.status(200).send(success);
                            return;
                        })
                            .catch((error) => {
                            res.status(500).send({ success: false, msg: error.message });
                            return;
                        });
                    });
                }).catch(errors => {
                    res.status(errors.status).send({ success: false, msg: errors.msg });
                    return;
                });
            }).catch(error => {
                res.status(500).send({ success: false, msg: error.message });
            });
        }
        catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    });
};
exports.login = login;
//# sourceMappingURL=user.controller.js.map