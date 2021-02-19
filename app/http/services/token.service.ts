'use strict';

import TokenSchema, { IToken } from '../models/token.user.model';

export class TokenService {
    findOne(query): Promise<IToken> {
        return new Promise((resolve, reject) => {
            TokenSchema.findOne(query, (err, token: IToken) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })

        })
    }
    findOneAndRemove(query) {
        return new Promise((resolve, reject) => {
            TokenSchema.findOneAndRemove(query).then((raw) => {
                resolve(raw);
            }).catch((err) => {
                reject(err);
            })
        })
    }
    create(userData): Promise<IToken> {
        return new Promise((resolve, reject) => {
            TokenSchema.create(userData, (err, token: IToken) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })

        })
    }

}