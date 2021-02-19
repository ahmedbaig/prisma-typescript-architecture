'use strict';

import TokenSchema, { IToken } from '../models/token.user.model';

export let findOne = function (query): Promise<IToken> {
    return new Promise(function (resolve, reject) {
        TokenSchema.findOne(query, function (err, token: IToken) {
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

export let create = function (userData): Promise<IToken> {
    return new Promise(function (resolve, reject) {
        TokenSchema.create(userData, function (err, token: IToken) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })

    })
}
