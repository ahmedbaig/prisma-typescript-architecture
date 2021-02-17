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
const _ = require("lodash");
const { getRedisKeys, deleteRedisKeys, searchAndDeleteKeys } = require("./redis.service");
exports.getRedisKeys = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            getRedisKeys()
                .then((data) => {
                res.json(data);
            })
                .catch((error) => res.json(error));
        }
        catch (error) {
            res.send({ success: false, message: error.message });
        }
    });
};
exports.flushdb = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.pass == null) {
                res.status(401).send({ success: false, message: "Missing credentials" });
                return;
            }
            else if (req.body.pass == process.env.REDIS_PASS) {
                deleteRedisKeys()
                    .then((data) => {
                    res.json(data);
                })
                    .catch((error) => res.json(error));
            }
            else {
                res.status(401).send({ success: false, message: "Invalid credentials" });
                return;
            }
        }
        catch (error) {
            res.send({ success: false, message: error.message });
        }
    });
};
exports.flushAuth = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.pass == null || req.body.key == null) {
                res.status(401).send({ success: false, message: "Missing credentials / key" });
                return;
            }
            else if (req.body.pass == process.env.REDIS_PASS) {
                searchAndDeleteKeys(req.body.key)
                    .then((data) => {
                    res.json(data);
                })
                    .catch((error) => res.json(error));
            }
            else {
                res.status(401).send({ success: false, message: "Invalid credentials" });
                return;
            }
        }
        catch (error) {
            res.send({ success: false, message: error.message });
        }
    });
};
//# sourceMappingURL=cache.controller.js.map