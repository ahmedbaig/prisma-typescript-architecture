"use strict";
import moment, { unitOfTime } from "moment";
import * as defaults from "../../../config/default.json";

import jwt from "jsonwebtoken";
import fs from "fs";
var privateKEY = fs.readFileSync('config/cert/accessToken.pem', 'utf8');

import { UserService } from "./user.service";
import { TokenService } from "./token.service";

export class AuthService {
    private generateOTP(): String {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    private async createToken(user, token) {
        return new Promise((resolve, reject) => {
            const option = { val: defaults.ACCESS_TOKEN.EXPIRE_NUM, unit: defaults.ACCESS_TOKEN.EXPIRE_VALUE }
            let body = {
                userId: user._id,
                token,
                expiresIn: moment().add(option.val, <unitOfTime.DurationConstructor>option.unit).toDate()
            };
            try {
                let token_service_obj = new TokenService()
                token_service_obj.create(body).then(token => {
                    resolve({
                        success: true,
                        token,
                        msg: "Token generated successfully",
                    });
                }).catch(err => { throw err; })
            } catch (ex) {
                reject({ success: false, status: 500, msg: ex })
            }
        })
    }

    generateAuthToken({ _id, type }, callback): String {
        var i = process.env.ISSUER_NAME;
        var s = process.env.SIGNED_BY_EMAIL;
        var a = process.env.AUDIENCE_SITE;
        var signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            algorithm: "RS256",
        };
        var payload = {
            _id,
            type
        };
        var token = jwt.sign(payload, privateKEY, signOptions);
        return callback(token);
    }

    async token(data, { errorCallback, callback }) {
        var token = Buffer.from(this.generateOTP()).toString("base64");
        let user_service_obj = new UserService()
        user_service_obj.findOne({ email: data.email }).then(async (user: any = {}) => {
            if (!user) {
                return errorCallback({
                    success: false,
                    status: 400,
                    msg: "No account with this email exists.",
                });
            } else if (user) {
                let token_service_obj = new TokenService()
                token_service_obj.findOne({ userId: user._id }).then((alreadyExist: any = {}) => {
                    if (!alreadyExist) {
                        //   Token does not exist
                        this.createToken(user, token)
                            .then((data) => callback(data))
                            .catch((error => errorCallback({ success: false, status: 500, msg: error })))
                    } else {
                        // Token exists
                        if (moment(alreadyExist.expiresIn).isSameOrAfter(moment()) == true) {
                            //   Already exists and has not expired yet
                            if (alreadyExist) {
                                return errorCallback({
                                    success: false,
                                    status: 409,
                                    msg: "A token already exists for this User. Please use it before it expires",
                                });
                            }
                        } else {
                            // Already exists and has expired; remove old one and get new.
                            token_service_obj.findOneAndRemove({ userId: user._id }).then(async () => {
                                this.createToken(user, token)
                                    .then((data) => callback(data))
                                    .catch(error => errorCallback({ success: false, status: 500, msg: error }))
                            });
                        }
                    }
                }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
            }
        }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
    };

    async verifyNewAccountToken(token, { errorCallback, callback }) {
        let token_service_obj = new TokenService()
        token_service_obj.findOne({ token }).then((alreadyExist: any = {}) => {
            if (alreadyExist == null) {
                //   Token does not exist 
                return errorCallback({
                    success: false,
                    status: 400,
                    msg: "Token does not exist.",
                })
            } else {
                // Token exists
                if (moment(alreadyExist.expiresIn).isSameOrAfter(moment()) == true) {
                    //   Already exists and has not expired yet
                    token_service_obj.findOneAndRemove({ token: alreadyExist.token })
                        .then(() => callback({ success: true, token: null, userId: alreadyExist.userId }))
                        .catch(error => errorCallback({ success: false, status: 500, msg: error }));
                } else {
                    // Already exists and has expired get new token
                    var new_token = Buffer.from(this.generateOTP()).toString("base64");
                    let user = { _id: alreadyExist.userId };
                    token_service_obj.findOneAndRemove({ token: alreadyExist.token })
                        .then(
                            async () => {
                                this.createToken(user, new_token)
                                    .then((data) => callback({ success: true, token: data, userId: alreadyExist.userId }))
                                    .catch(error => errorCallback({ success: false, status: 500, msg: error }));
                            }
                        ).catch(error => errorCallback({ success: false, status: 500, msg: error }));
                }
            }
        });
    };
}  