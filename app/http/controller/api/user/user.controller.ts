"use strict";
const _ = require('lodash');
import moment, { fn } from 'moment';
import * as UserService from '../../../services/user.service';
import { generateAuthToken } from "../../../services/auth.service";
import { setUserStateToken } from '../../../../cache/redis.service';
import { OAuth2Client } from 'google-auth-library';

let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, '', '');

declare module "moment" {
    interface Moment {
        fromNow_seconds(): number;
    }
}
(moment as any).fn.fromNow_seconds = function (a): number {
    var duration = moment(this).diff(moment(), 'seconds');
    return duration;
};
export let register = async function (req, res) {
    try {
        var duration = moment.duration(moment(new Date()).diff(moment(req.body.dob)));
        if (false) {//duration.asYears() <= 13
            res.status(409).send({ success: false, msg: "Details do not meet the required age limit" })
            return;
        }
        UserService.create(req.body).then(data => {
            res.status(200).send(data);
        }).catch((error) => {
            if (error.errors && error.errors.email && error.errors.email.message == 'The specified email address is already in use.') {
                res.status(400).send({ msg: 'The specified email address is already in use.', success: false })
            } else if (error.errors && error.errors.email && error.errors.email.message == "Path `email` is required.") {
                res.status(400).send({ msg: 'Email is required', success: false })
            } else if (error.message == 'Invalid password') {
                res.status(400).send({ msg: 'Invalid password', success: false })
            } else {
                res.status(500).send({ success: false, msg: error.message });
            }
        })
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

//************************ SOCIAL LOGIN ***************************//

export let socialLogin = async (req, res) => {
    //social login document
    //https://spyna.medium.com/how-really-protect-your-rest-api-after-social-login-with-node-js-3617c336ebed

    console.log(process.env.GOOGLE_CLIENT_ID, 'process.env.GOOGLE_CLIENT_ID')
    client.verifyIdToken({ idToken: req.body.token, audience: process.env.GOOGLE_CLIENT_ID })
        .then((login) => {
            console.log("🚀 ~ file: user.controller.ts ~ line 52 ~ .then ~ login", login)

        }).then((user) => {
            console.log("🚀 ~ file: user.controller.ts ~ line 67 ~ .then ~ user", user)

        }).catch(err => {
            //throw an error if something gos wrong
            console.log("error while authenticating google user: " + JSON.stringify(err));
        })
    res.send("success")
}

//************************ LOGIN CONTROLLER ***********************//

export let login = async function (req, res) {
    try {
        let { email, password, type } = req.body;

        UserService.findOne({
            email,
            isDeleted: false,
        }).then((user: any = {}) => {
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
                    generateAuthToken({ _id: user._id, type: user.type }, (token) => {
                        setUserStateToken(token, moment(moment().add(48, 'hours')).fromNow_seconds())
                            .then(
                                () => {
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
                                    user['access_token'] = token
                                    var success = { success: true, msg: "Logged in successfully", user };
                                    res.status(200).send(success);
                                    return;
                                }
                            )
                            .catch((error) => {
                                res.status(500).send({ success: false, msg: error.message });
                                return;
                            });
                    })
                }).catch(errors => {
                    res.status(errors.status).send({ success: false, msg: errors.msg });
                    return;
                })
        }).catch(error => {
            res.status(500).send({ success: false, msg: error.message });
        });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

