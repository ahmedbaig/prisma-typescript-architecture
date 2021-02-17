'use strict';

import TokenSchema, { IToken } from '../models/token.user.model';

export let findOne = function (query) {
    return new Promise(function (resolve, reject) {
        TokenSchema.findOne(query, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })

    })
}

export let findOneAndRemove = function (query) {
    return new Promise(function (resolve, reject) {
        TokenSchema.findOneAndRemove(query).then((raw) => {
            resolve(raw);
        }).catch((err) => {
            reject(err);
        })
    })
}

export let create = function (userData) {
    return new Promise(function (resolve, reject) {
        TokenSchema.create(userData, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })

    })
}
