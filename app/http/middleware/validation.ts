"use strict";
var compose = require("composable-middleware");
import moment from 'moment';
import validation from "../controller/validate";

export let validateUserRegistration = () => {
    return (
        compose()
            .use(function (req, res, next) {
                const { error } = validation.validateRegisterData(req.body);
                if (error) {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                } else {
                    next();
                }
            })
    )
}

export let validateUserLogin = () => {
    return (
        compose()
            .use(function (req, res, next) {
                const { error } = validation.validateLoginData(req.body);
                if (error) {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                } else {
                    next();
                }
            })
    )
}

export let validateSocialLogin = () => {
    return (
        compose()
            .use(function (req, res, next) {
                const { error } = validation.socialLoginData(req.body)
                if (error) {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                } else {
                    next();
                }
            })
    )
}
