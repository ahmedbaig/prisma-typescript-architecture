"use strict";
import moment from "moment"; import { unitOfTime } from 'moment';
import * as defaults from "../../../config/default.json";

import jwt from "jsonwebtoken";
import fs from "fs";
var privateKEY = fs.readFileSync('config/cert/accessToken.pem', 'utf8');

import * as TokenService from './token.service';
import * as UserService from './user.service';

function generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

async function createToken(user, token, transaction) {
    return new Promise((resolve, reject) => {
        const option = { val: defaults.ACCESS_TOKEN.EXPIRE_NUM, unit: defaults.ACCESS_TOKEN.EXPIRE_VALUE }
        let body = {
            userId: user._id,
            transaction,
            token,
            expiresIn: moment().add(option.val, <unitOfTime.DurationConstructor>option.unit)
        };
        try {
            TokenService.create(body).then(token => {
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

export let token = async function (data, { errorCallback, callback }) {
    var token = Buffer.from(generateOTP()).toString("base64");
    UserService.findOne({ email: data.email }).then(async function (user: any = {}) {
        if (!user) {
            return errorCallback({
                success: false,
                status: 400,
                msg: "No account with this email exists.",
            });
        } else if (user) {
            TokenService.findOne({ userId: user._id }).then((alreadyExist: any = {}) => {
                if (!alreadyExist) {
                    //   Token does not exist
                    createToken(user, token, null)
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
                        TokenService.findOneAndRemove({ userId: user._id }).then(async () => {
                            createToken(user, token, null)
                                .then((data) => callback(data))
                                .catch(error => errorCallback({ success: false, status: 500, msg: error }))
                        });
                    }
                }
            }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
        }
    }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
};

export let generateAuthToken = ({ _id, type }, callback) => {
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