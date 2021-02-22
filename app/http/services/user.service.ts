'use strict';

// const { User } = require('../models/user.model');
import User, { IUser } from '../models/user.model';
import { MailSender } from "../mail";
import moment from 'moment';
import { AuthService } from './auth.service';
const select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0, isEmailVerified: 0, isActive: 0, isDeleted: 0, createdDate: 0, updatedDatae: 0 }
const admin_select = { salt: 0, hashedPassword: 0, failedPasswordsAttempt: 0 }

export class UserService {
    create(userData: IUser): Promise<IUser> {
        return new Promise((resolve, reject) => {
            User.create(userData, (err, user: IUser) => {
                if (err) {
                    reject(err);
                } else {
                    let auth_service_obj = new AuthService()
                    auth_service_obj.token(user, {
                        errorCallback: (error) => {
                            reject(error)
                        },
                        callback: ({ token: { token: token } }) => {
                            // SEND USER VERIFICATION EMAIL
                            let mail_sender_obj = new MailSender(user, token)
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
    findOne(query): Promise<IUser> {
        return new Promise((resolve, reject) => {
            User.findOne(query, (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            })

        })
    }

    findOneAndUpdate(query, data, options = null): Promise<any> {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate(query, data, options, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })

        })
    }

    passwordCheck({ password, user }): Promise<any> {
        return new Promise((resolve, reject) => {
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
                            },
                            {}
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
                        this.update(
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
    update(query, data, options = null): Promise<any> {
        return new Promise((resolve, reject) => {
            User.update(query, data, options, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })

        })
    }
    findById(userId): Promise<IUser> {
        return new Promise((resolve, reject) => {
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
}