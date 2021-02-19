'use strict';

// const { User } = require('../models/user.model');
import User, { IUser } from '../models/user.model';
import { token } from "../services/auth.service";
import { MailSender } from "../mail";
import moment from 'moment';
const select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0, isEmailVerified: 0, isActive: 0, isDeleted: 0, createdDate: 0, updatedDatae: 0 }
const admin_select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0 }

export let create = function (userData): Promise<IUser> {
    return new Promise(function (resolve, reject) {
        User.create(userData, (err, user:IUser) => {
            if (err) {
                reject(err);
            } else {
                token(user, {
                    errorCallback: (error) => {
                        reject(error)
                    },
                    callback: ({ token: { token: token } }) => {
                        // SEND USER VERIFICATION EMAIL
                        let mail_sender_obj = new MailSender(user,token)
                        mail_sender_obj.sendUserVerifyEmail().then(data => {
                            resolve(data);
                        }).catch(error => {
                            reject(error)
                        });
                    }
                });
            }
        })

    })
}


export let findOne = function (query) {
    return new Promise(function (resolve, reject) {
        User.findOne(query, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })

    })
}

export let findOneAndUpdate = function (query, data, options): any {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate(query, data, options, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

export let passwordCheck = function ({ password, user }) {
    return new Promise(function (resolve, reject) {
        if (moment(user.failedPasswordsAttempt.blockedTill).isSameOrAfter(moment()) == true) {
            var errors = {
                success: false,
                status: 429,
                msg:
                    "Sorry! You can't login because you have exceeded your password attempts. Please try again later",
            };
            reject(errors)
            return;
        } else {
            if (!user.authenticate(password)) {
                if (user.failedPasswordsAttempt.count >= 5) {
                    this.findOneAndUpdate(
                        { _id: user._id },
                        {
                            "failedPasswordsAttempt.blockedTill": moment().add(30, "minutes"),
                        }
                    ).then(() => {
                        var errors = {
                            success: false,
                            status: 429,
                            msg: "You are blocked because you have exceeded your number of attempts. Please try again after 30 mins",
                        };
                        reject(errors);
                        return;
                    });
                } else {
                    this.findOneAndUpdate(
                        { _id: user._id },
                        {
                            $set: {
                                "failedPasswordsAttempt.count": user.failedPasswordsAttempt.count + 1,
                            },
                        }
                    ).then(() => {
                        reject({
                            success: false,
                            status: 401,
                            msg: 'This password is not correct.'
                        });
                        return;
                    });
                }
            } else {
                if (user.isEmailVerified == false) {
                    var errors = { success: false, status: 401, msg: "Please verify your email first" };
                    reject(errors);
                    return;
                } else if (user.isActive == false) {
                    var errors = {
                        success: false,
                        status: 401,
                        msg: "Your account has been suspended by admin",
                    };
                    reject(errors);
                    return;
                } else {
                    update(
                        { _id: user._id },
                        {
                            $set: {
                                "failedPasswordsAttempt.blockedTill": null,
                                "failedPasswordsAttempt.count": 0,
                                updatedDate: moment(),
                            },
                        }
                    ).then((raw) => {
                        resolve(user)
                        return;
                    });
                }
            }

        }
    })
}


export let update = function (query, data, options = null) {
    return new Promise(function (resolve, reject) {
        User.update(query, data, options, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

export let findById = function (userId) {
    return new Promise(function (resolve, reject) {
        User.findById(userId, select)
            .then((user) => {
                if (user) {
                    resolve(user);
                } else if (!user) {
                    reject({ msg: 'User not found.' });
                }
            }).catch((err) => {
                if (err) {
                    reject(err);
                }
            })

    })
}