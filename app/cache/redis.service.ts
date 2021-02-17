"use strict";
import compose from "composable-middleware";
import _ from "lodash";
var redisClient = require("redis").createClient;
let client;

export let connect_cache = function () {
    return new Promise((resolve, reject) => {
        client = redisClient({
            port: process.env.REDIS_PORT, // replace with your port
            host: process.env.REDIS_HOST, // replace with your hostanme or IP address
            password: process.env.REDIS_PASS, // replace with your password
        });
        client.on("error", function (err) {
            reject(err);
        });
        client.on("connect", function () {
            resolve("Redis Connected");
        });
    });
};

export let setUserStateToken = function (auth, exp) {
    return new Promise((resolve, reject) => {
        try {
            client.setex(`${auth}/state/token/expiry`, exp, JSON.stringify(auth));
            resolve(true);
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};

export let getUserStateToken = function (auth) {
    return new Promise((resolve, reject) => {
        try {
            client.get(`${auth}/state/token/expiry`, (err, data) => {
                if (err) throw err;
                if (data !== null) {
                    resolve(data);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};

export let getRedisKeys = async function () {
    return new Promise((resolve, reject) => {
        try {
            client.keys("*", function (err, keys) {
                let count = _.filter(keys, function (o) {
                    return o.split("|")[0] == "count";
                });
                if (err) reject({ success: false, message: err });
                resolve({ count });
            });
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};

export let deleteRedisKeys = async function () {
    return new Promise((resolve, reject) => {
        try {
            client.flushdb(function (err, succeeded) {
                if (err) reject({ success: false, message: err });
                resolve({ message: "Keys Deleted", success: true });
            });
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};

export let searchAndDeleteKeys = async (keyword) => {
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
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
};