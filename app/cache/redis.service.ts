import compose from "composable-middleware";
import * as _ from "lodash";
import { createClient } from "redis";
let client;
export class RedisService {
    connect_cache() {
        return new Promise((resolve, reject) => {
            client = createClient({
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
    protected setUserStateToken(auth: string, exp: number) {
        return new Promise((resolve, reject) => {
            try {
                client.setex(`${auth}/state/token/expiry`, exp, JSON.stringify(auth));
                resolve(true);
            } catch (error) {
                reject({ success: false, message: error.message });
            }
        });
    }
    protected getUserStateToken(auth) {
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
    protected async getRedisKeys() {
        return new Promise((resolve, reject) => {
            try {
                client.keys("*", (err, keys) => {
                    let count = _.filter(keys, (o) => {
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
    protected async deleteRedisKeys() {
        return new Promise((resolve, reject) => {
            try {
                client.flushdb((err, succeeded) => {
                    if (err) reject({ success: false, message: err });
                    resolve({ message: "Keys Deleted", success: true });
                });
            } catch (error) {
                reject({ success: false, message: error.message });
            }
        });
    };
    protected async searchAndDeleteKeys(keyword) {
        return new Promise((resolve, reject) => {
            try {
                let key = "*" + keyword + "*";

                client.keys(key, (err, keys) => {
                    keys.forEach((k) => {
                        client.del(k, (err, response) => {
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
}