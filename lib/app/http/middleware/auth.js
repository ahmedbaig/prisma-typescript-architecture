"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
var compose = require("composable-middleware");
const fs = require("fs");
var publicKEY = fs.readFileSync("config/cert/accessToken.pub", "utf8");
const moment_1 = __importDefault(require("moment"));
moment_1.default.fn.fromNow_seconds = function (a) {
    var duration = moment_1.default(this).diff(moment_1.default(), 'seconds');
    return duration;
};
const UserService = require("../services/user.service");
var { getUserStateToken, setUserStateToken } = require('../../cache/redis.service');
function isAuthenticated() {
    return (compose()
        // Attach user to request
        .use(function (req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token)
            return res.status(401).send({
                success: false,
                msg: "Access Denied. No token provided.",
                code: 401,
            });
        // Remove Bearer from string
        token = token.replace(/^Bearer\s+/, "");
        try {
            var i = process.env.ISSUER_NAME;
            var s = process.env.SIGNED_BY_EMAIL;
            var a = process.env.AUDIENCE_SITE;
            var verifyOptions = {
                issuer: i,
                subject: s,
                audience: a,
                algorithm: ["RS256"],
            };
            let JWTSPLIT = token.split(".");
            var decodedJWTHeader = JSON.parse(Buffer.from(JWTSPLIT[0], "base64").toString());
            if (decodedJWTHeader.alg != "RS256") {
                res.send({
                    success: false,
                    msg: "Access Denied. Compromised Authorized Token.",
                    status: 401,
                });
                return;
            }
            var decoded = jwt.verify(token, publicKEY, verifyOptions);
            req.user = decoded;
            req.auth = token;
            next();
        }
        catch (ex) {
            console.log("exception: " + ex);
            res
                .status(400)
                .send({ success: false, msg: "Invalid token.", status: 400 });
        }
    })
        .use(isValid())
        .use(refreshAuthToken()));
}
function refreshAuthToken() {
    return (compose()
        .use(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // This middleware will verify if the jwt is not compromised after user logged out
            getUserStateToken(req.auth).then(data => {
                if (data == null) {
                    console.log("Compromised Token!");
                    res.send({
                        success: false,
                        msg: "Access Denied. Compromised Authorized Token.",
                        status: 401,
                    });
                    return;
                }
                else {
                    setUserStateToken(req.auth, moment_1.default(moment_1.default().add(48, 'hours')).fromNow_seconds())
                        .then((success) => {
                        if (success) {
                            console.log("Refresh Token Record Updated");
                            next();
                        }
                    })
                        .catch((error) => res.json(error));
                }
            });
        });
    }));
}
function isValid() {
    return (compose()
        // Attach user to request
        .use(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            UserService.findOne({ _id: req.user._id, isEmailVerified: true })
                .then(user => {
                try {
                    if (user == null) {
                        res.status(401).send({
                            success: false,
                            msg: "Unauthorized access due unverified email",
                            status: 401,
                        });
                        throw true;
                    }
                    else if (user.isDeleted == true) {
                        var errors = {
                            success: false,
                            status: 401,
                            msg: "Your account has been deleted. Contact admin",
                        };
                        res.status(401).send(errors);
                        throw true;
                    }
                    else if (user.isActive == false) {
                        var errors = {
                            success: false,
                            status: 401,
                            msg: "Your account has been suspended. Contact admin",
                        };
                        res.status(401).send(errors);
                        throw true;
                    }
                    else {
                        next();
                    }
                }
                catch (ex) {
                    expireAuthToken(req.auth, 10)
                        .then(raw => { });
                }
            });
        });
    }));
}
const expireAuthToken = function (auth, exp) {
    return new Promise((resolve, reject) => {
        setUserStateToken(auth, moment_1.default(moment_1.default().add(exp, 'seconds')).fromNow_seconds())
            .then((success) => {
            if (success) {
                console.log(`Refresh Token record updated and expiring in ${exp} seconds`);
                resolve(true);
            }
        })
            .catch((error) => reject(error));
    });
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.js.map