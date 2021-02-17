"use strict";

const _ = require("lodash");
const { getRedisKeys, deleteRedisKeys, searchAndDeleteKeys } = require("./redis.service");

exports.getRedisKeys = async function (req, res) {
    try {
        getRedisKeys()
            .then((data) => {
                res.json(data);
            })
            .catch((error) => res.json(error));
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};

exports.flushdb = async function (req, res) {
    try {
        if (req.body.pass == null) {
            res.status(401).send({ success: false, message: "Missing credentials" })
            return;
        } else if (req.body.pass == process.env.REDIS_PASS) {
            deleteRedisKeys()
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => res.json(error));
        } else {
            res.status(401).send({ success: false, message: "Invalid credentials" })
            return;
        }
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};

exports.flushAuth = async function (req, res) {
    try {

        if (req.body.pass == null || req.body.key == null) {
            res.status(401).send({ success: false, message: "Missing credentials / key" })
            return;
        } else if (req.body.pass == process.env.REDIS_PASS) {
            searchAndDeleteKeys(req.body.key)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => res.json(error));
        } else {
            res.status(401).send({ success: false, message: "Invalid credentials" })
            return;
        }
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};


