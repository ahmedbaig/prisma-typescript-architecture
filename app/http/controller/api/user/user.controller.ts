import * as _ from "lodash";
import moment from "../../../../modules/moment";
import { UserService } from "../../../services/user.service";
import { RedisService } from "../../../../cache/redis.service";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "../../../services/auth.service";

export class User extends RedisService {
    client;
    constructor() {
        super();
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, "", "");
    }
    register(req, res) {
        try {
            // NOT NEEDED FOR NOW 
            // if (!moment(req.body.dob).olderThan13()) {
            //     res.status(409).send({ success: false, msg: "Details do not meet the required age limit" })
            //     return;
            // }
            let user_service_obj = new UserService()
            user_service_obj.create(req.body).then(data => {
                res.status(200).send(data);
            }).catch((error) => {
                if (error.errors && error.errors.email && error.errors.email.message == 'The specified email address is already in use.') {
                    res.status(400).send({ msg: 'The specified email address is already in use.', success: false })
                } else if (error.errors && error.errors.email && error.errors.email.message == "Path `email` is required.") {
                    res.status(400).send({ msg: 'Email is required', success: false })
                } else if (error.message == 'Invalid password') {
                    res.status(400).send({ msg: 'Invalid password', success: false })
                } else {
                    res.status(500).send({ success: false, msg: error.msg });
                }
            })
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }

    //************************ LOGIN CONTROLLER ***********************//
    login(req, res) {
        try {
            let { email, password, type } = req.body;
            console.log("🚀 ~ file: user.controller.ts ~ line 44 ~ User ~ login ~ req.body", req.body)
            let user_service_obj = new UserService();
            user_service_obj
                .findOne({
                    email,
                    isDeleted: false,
                })
                .then((user: any = {}) => {
                    console.log("🚀 ~ file: user.controller.ts ~ line 52 ~ User ~ .then ~ user", user)
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
                    user_service_obj
                        .passwordCheck({ user, password })
                        .then(() => {
                            let auth_service_obj = new AuthService();
                            auth_service_obj.generateAuthToken(
                                { _id: user._id, type: user.type },
                                (token) => {
                                    super
                                        .setUserStateToken(
                                            token,
                                            moment(moment().add(48, "hours")).fromNow_seconds()
                                        )
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
                                            user["access_token"] = token;
                                            var success = {
                                                success: true,
                                                msg: "Logged in successfully",
                                                user,
                                            };
                                            res.status(200).send(success);
                                            return;
                                        })
                                        .catch((error) => {
                                            res
                                                .status(500)
                                                .send({ success: false, msg: error.message });
                                            return;
                                        });
                                }
                            );
                        })
                        .catch((errors) => {
                            res
                                .status(errors.status)
                                .send({ success: false, msg: errors.msg });
                            return;
                        });
                })
                .catch((error) => {
                    res.status(500).send({ success: false, msg: error.message });
                });
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }

    //************************ SOCIAL LOGIN ***************************//
    // This needs to be moved to some place better and handled differently
    socialLogin(req, res) {
        //social login document
        //https://spyna.medium.com/how-really-protect-your-rest-api-after-social-login-with-node-js-3617c336ebed

        console.log(process.env.GOOGLE_CLIENT_ID, "process.env.GOOGLE_CLIENT_ID");
        this.client
            .verifyIdToken({
                idToken: req.body.token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then((login) => {
                console.log(
                    "🚀 ~ file: user.controller.ts ~ line 52 ~ .then ~ login",
                    login
                );
            })
            .then((user) => {
                console.log(
                    "🚀 ~ file: user.controller.ts ~ line 67 ~ .then ~ user",
                    user
                );
            })
            .catch((err) => {
                //throw an error if something gos wrong
                console.log(
                    "error while authenticating google user: " + JSON.stringify(err)
                );
            });
        res.send("success");
    }

    get(req, res) {
        try {
            let limit = _.toInteger(req.query.limit);
            let page = _.toInteger(req.query.page);
            let user_service_obj = new UserService();
            user_service_obj
                .find({}, limit, page)
                .then(({ users, count }) => {
                    res.send({
                        success: true, users,
                        page: page,
                        pages: Math.ceil(count / limit),
                    });
                })
                .catch((error) => {
                    res.status(error.status).send(error);
                });
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }
}
