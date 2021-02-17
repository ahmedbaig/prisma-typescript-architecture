'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.findOneAndRemove = exports.findOne = void 0;
const token_user_model_1 = __importDefault(require("../models/token.user.model"));
let findOne = function (query) {
    return new Promise(function (resolve, reject) {
        token_user_model_1.default.findOne(query, function (err, token) {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.findOne = findOne;
let findOneAndRemove = function (query) {
    return new Promise(function (resolve, reject) {
        token_user_model_1.default.findOneAndRemove(query).then((raw) => {
            resolve(raw);
        }).catch((err) => {
            reject(err);
        });
    });
};
exports.findOneAndRemove = findOneAndRemove;
let create = function (userData) {
    return new Promise(function (resolve, reject) {
        token_user_model_1.default.create(userData, function (err, token) {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.create = create;
//# sourceMappingURL=token.service.js.map