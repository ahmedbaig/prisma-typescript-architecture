"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyNewAccountToken = exports.generateAuthToken = exports.token = void 0;
const moment_1 = __importDefault(require("moment"));
const defaults = __importStar(require("../../../config/default.json"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
var privateKEY = fs_1.default.readFileSync('config/cert/accessToken.pem', 'utf8');
const TokenService = __importStar(require("./token.service"));
const UserService = __importStar(require("./user.service"));
function generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
function createToken(user, token, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const option = { val: defaults.ACCESS_TOKEN.EXPIRE_NUM, unit: defaults.ACCESS_TOKEN.EXPIRE_VALUE };
            let body = {
                userId: user._id,
                transaction,
                token,
                expiresIn: moment_1.default().add(option.val, option.unit)
            };
            try {
                TokenService.create(body).then(token => {
                    resolve({
                        success: true,
                        token,
                        msg: "Token generated successfully",
                    });
                }).catch(err => { throw err; });
            }
            catch (ex) {
                reject({ success: false, status: 500, msg: ex });
            }
        });
    });
}
let token = function (data, { errorCallback, callback }) {
    return __awaiter(this, void 0, void 0, function* () {
        var token = Buffer.from(generateOTP()).toString("base64");
        UserService.findOne({ email: data.email }).then(function (user = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    return errorCallback({
                        success: false,
                        status: 400,
                        msg: "No account with this email exists.",
                    });
                }
                else if (user) {
                    TokenService.findOne({ userId: user._id }).then((alreadyExist = {}) => {
                        if (!alreadyExist) {
                            //   Token does not exist
                            createToken(user, token, null)
                                .then((data) => callback(data))
                                .catch((error => errorCallback({ success: false, status: 500, msg: error })));
                        }
                        else {
                            // Token exists
                            if (moment_1.default(alreadyExist.expiresIn).isSameOrAfter(moment_1.default()) == true) {
                                //   Already exists and has not expired yet
                                if (alreadyExist) {
                                    return errorCallback({
                                        success: false,
                                        status: 409,
                                        msg: "A token already exists for this User. Please use it before it expires",
                                    });
                                }
                            }
                            else {
                                // Already exists and has expired; remove old one and get new.
                                TokenService.findOneAndRemove({ userId: user._id }).then(() => __awaiter(this, void 0, void 0, function* () {
                                    createToken(user, token, null)
                                        .then((data) => callback(data))
                                        .catch(error => errorCallback({ success: false, status: 500, msg: error }));
                                }));
                            }
                        }
                    }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
                }
            });
        }).catch(error => errorCallback({ success: false, status: 500, msg: error }));
    });
};
exports.token = token;
let generateAuthToken = ({ _id, type }, callback) => {
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
    var token = jsonwebtoken_1.default.sign(payload, privateKEY, signOptions);
    return callback(token);
};
exports.generateAuthToken = generateAuthToken;
let verifyNewAccountToken = function (token, { errorCallback, callback }) {
    return __awaiter(this, void 0, void 0, function* () {
        TokenService.findOne({ token }).then((alreadyExist = {}) => {
            if (alreadyExist == null) {
                //   Token does not exist 
                return errorCallback({
                    success: false,
                    status: 400,
                    msg: "Token does not exist.",
                });
            }
            else {
                // Token exists
                if (moment_1.default(alreadyExist.expiresIn).isSameOrAfter(moment_1.default()) == true) {
                    //   Already exists and has not expired yet
                    TokenService.findOneAndRemove({ token: alreadyExist.token })
                        .then(() => callback({ success: true, token: null, userId: alreadyExist.userId }))
                        .catch(error => errorCallback({ success: false, status: 500, msg: error }));
                }
                else {
                    // Already exists and has expired get new token
                    var new_token = Buffer.from(generateOTP()).toString("base64");
                    let user = { _id: alreadyExist.userId };
                    TokenService.findOneAndRemove({ token: alreadyExist.token })
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        createToken(user, new_token, null)
                            .then((data) => callback({ success: true, token: data, userId: alreadyExist.userId }))
                            .catch(error => errorCallback({ success: false, status: 500, msg: error }));
                    })).catch(error => errorCallback({ success: false, status: 500, msg: error }));
                }
            }
        });
    });
};
exports.verifyNewAccountToken = verifyNewAccountToken;
//# sourceMappingURL=auth.service.js.map