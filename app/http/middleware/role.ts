'use strict';
var compose = require("composable-middleware");
export let isAdmin = function () {
    return (
        compose()
            // Attach user to request
            .use(function (req, res, next) {
                if (req.user.type == 'admin') {
                    next();
                } else {
                    res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
                    return
                }
            })
    )
}

export let isReception = function () {
    return (
        compose()
            // Attach user to request
            .use(function (req, res, next) {
                if (req.user.type == 'reception' || req.user.type == 'admin') {
                    next();
                } else {
                    res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
                    return
                }
            })
    )
}