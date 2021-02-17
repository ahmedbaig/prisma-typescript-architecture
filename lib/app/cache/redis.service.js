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
exports.searchAndDeleteKeys = exports.deleteRedisKeys = exports.getRedisKeys = exports.getUserStateToken = exports.setUserStateToken = exports.connect_cache = void 0;
const lodash_1 = __importDefault(require("lodash"));
var redisClient = require("redis").createClient;
let client;
let connect_cache = function () {
    return new Promise((resolve, reject) => {
        client = redisClient({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASS,
        });
        client.on("error", function (err) {
            reject(err);
        });
        client.on("connect", function () {
            resolve("Redis Connected");
        });
    });
};
exports.connect_cache = connect_cache;
let setUserStateToken = function (auth, exp) {
    return new Promise((resolve, reject) => {
        try {
            client.setex(`${auth}/state/token/expiry`, exp, JSON.stringify(auth));
            resolve(true);
        }
        catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};
exports.setUserStateToken = setUserStateToken;
let getUserStateToken = function (auth) {
    return new Promise((resolve, reject) => {
        try {
            client.get(`${auth}/state/token/expiry`, (err, data) => {
                if (err)
                    throw err;
                if (data !== null) {
                    resolve(data);
                }
                else {
                    resolve(null);
                }
            });
        }
        catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};
exports.getUserStateToken = getUserStateToken;
let getRedisKeys = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                client.keys("*", function (err, keys) {
                    let count = lodash_1.default.filter(keys, function (o) {
                        return o.split("|")[0] == "count";
                    });
                    if (err)
                        reject({ success: false, message: err });
                    resolve({ count });
                });
            }
            catch (error) {
                reject({ success: false, message: error.message });
            }
        });
    });
};
exports.getRedisKeys = getRedisKeys;
let deleteRedisKeys = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                client.flushdb(function (err, succeeded) {
                    if (err)
                        reject({ success: false, message: err });
                    resolve({ message: "Keys Deleted", success: true });
                });
            }
            catch (error) {
                reject({ success: false, message: error.message });
            }
        });
    });
};
exports.deleteRedisKeys = deleteRedisKeys;
let searchAndDeleteKeys = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            let key = "*" + keyword + "*";
            client.keys(key, function (err, keys) {
                keys.forEach((k) => {
                    client.del(k, function (err, response) {
                        console.log(`${key} keys deleted`);
                        resolve(true);
                    });
                });
            });
        }
        catch (error) {
            reject({ success: false, message: error.message });
        }
    });
});
exports.searchAndDeleteKeys = searchAndDeleteKeys;
//# sourceMappingURL=redis.service.js.map