'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReception = exports.isAdmin = void 0;
var compose = require("composable-middleware");
let isAdmin = function () {
    return (compose()
        // Attach user to request
        .use(function (req, res, next) {
        if (req.user.type == 'admin') {
            next();
        }
        else {
            res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
            return;
        }
    }));
};
exports.isAdmin = isAdmin;
let isReception = function () {
    return (compose()
        // Attach user to request
        .use(function (req, res, next) {
        if (req.user.type == 'reception' || req.user.type == 'admin') {
            next();
        }
        else {
            res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
            return;
        }
    }));
};
exports.isReception = isReception;
//# sourceMappingURL=role.js.map