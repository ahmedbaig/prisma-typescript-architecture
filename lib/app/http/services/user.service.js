'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordCheck = exports.findOneAndUpdate = exports.findOne = exports.create = void 0;
// const { User } = require('../models/user.model');
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_service_1 = require("../services/auth.service");
const mail_1 = require("../mail");
const moment_1 = __importDefault(require("moment"));
const select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0, isEmailVerified: 0, isActive: 0, isDeleted: 0, createdDate: 0, updatedDatae: 0 };
const admin_select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0 };
let create = function (userData) {
    return new Promise(function (resolve, reject) {
        user_model_1.default.create(userData, (err, user) => {
            if (err) {
                reject(err);
            }
            else {
                auth_service_1.token(user, {
                    errorCallback: (error) => {
                        reject(error);
                    },
                    callback: ({ token: { token: token } }) => {
                        // SEND USER VERIFICATION EMAIL
                        mail_1.sendUserVerifyEmail({
                            token,
                            user
                        }).then(data => {
                            resolve(user);
                        }).catch(error => {
                            reject(error);
                        });
                    }
                });
            }
        });
    });
};
exports.create = create;
let findOne = function (query) {
    return new Promise(function (resolve, reject) {
        user_model_1.default.findOne(query, function (err, user) {
            if (err) {
                reject(err);
            }
            else {
                resolve(user);
            }
        });
    });
};
exports.findOne = findOne;
let findOneAndUpdate = function (query, data, options) {
    return new Promise(function (resolve, reject) {
        user_model_1.default.findOneAndUpdate(query, data, options, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.findOneAndUpdate = findOneAndUpdate;
let passwordCheck = function ({ password, user }) {
    return new Promise(function (resolve, reject) {
        if (moment_1.default(user.failedPasswordsAttempt.blockedTill).isSameOrAfter(moment_1.default()) == true) {
            var errors = {
                success: false,
                status: 429,
                msg: "Sorry! You can't login because you have exceeded your password attempts. Please try again later",
            };
            reject(errors);
            return;
        }
        else {
            if (!user.authenticate(password)) {
                if (user.failedPasswordsAttempt.count >= 5) {
                    this.findOneAndUpdate({ _id: user._id }, {
                        "failedPasswordsAttempt.blockedTill": moment_1.default().add(30, "minutes"),
                    }).then(() => {
                        var errors = {
                            success: false,
                            status: 429,
                            msg: "You are blocked because you have exceeded your number of attempts. Please try again after 30 mins",
                        };
                        reject(errors);
                        return;
                    });
                }
                else {
                    this.findOneAndUpdate({ _id: user._id }, {
                        $set: {
                            "failedPasswordsAttempt.count": user.failedPasswordsAttempt.count + 1,
                        },
                    }).then(() => {
                        reject({
                            success: false,
                            status: 401,
                            msg: 'This password is not correct.'
                        });
                        return;
                    });
                }
            }
            else {
                if (user.isEmailVerified == false) {
                    var errors = { success: false, status: 401, msg: "Please verify your email first" };
                    reject(errors);
                    return;
                }
                else if (user.isActive == false) {
                    var errors = {
                        success: false,
                        status: 401,
                        msg: "Your account has been suspended by admin",
                    };
                    reject(errors);
                    return;
                }
                else {
                    update({ _id: user._id }, {
                        $set: {
                            "failedPasswordsAttempt.blockedTill": null,
                            "failedPasswordsAttempt.count": 0,
                            updatedDate: moment_1.default(),
                        },
                    }).then((raw) => {
                        resolve(user);
                        return;
                    });
                }
            }
        }
    });
};
exports.passwordCheck = passwordCheck;
const update = function (query, data, options = null) {
    return new Promise(function (resolve, reject) {
        user_model_1.default.update(query, data, options, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
//# sourceMappingURL=user.service.js.map