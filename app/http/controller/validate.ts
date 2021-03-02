"use strict";

import { IUser, Type, Address } from "../models/user.model";
import { ICategories } from "../models/category.model";
import * as Joi from "joi";
interface UserRegister extends IUser {
    email: string;
    password: string;
    dob: Date;
    phoneNo: number;
    type: Type,
    firstName?: string;
    middleName?: string,
    lastName?: string,
    address?: Address,
    gcm_id?: string[],
    platform: string,
}
interface UserLogin extends IUser {
    email: string;
    password: string;
    type: Type;
}
interface UserSocialLogin extends IUser {
    token: string;
    gcm_id: string[];
    platform: string;
}

interface Categories extends ICategories {
    name: string,
    image: string
}

export class Validator {
    constructor() { }

    //************************ VALIDATE USER REGISTER DATA ***********************//
    validateRegisterData(data: UserRegister) {
        const schema = Joi.object().keys({
            // REQURIED 
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(8).required(),
            dob: Joi.date().required(),
            phoneNo: Joi.number().required(),
            type: Joi.string().required(),
            // ssn: Joi.number().min(1000).max(9999).required(),
            // OPTIONAL
            firstName: Joi.string().min(3),
            middleName: Joi.string().min(1),
            lastName: Joi.string().min(3),
            address: Joi.object().keys({
                street: Joi.string(),
                city: Joi.string(),
                postalCode: Joi.string(),
            }),
            gcm_id: Joi.array().items(Joi.string()),
            platform: Joi.string(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER LOGIN DATA ***********************//
    validateLoginData(data: UserLogin) {
        const schema = Joi.object().keys({
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(5),
            type: Joi.string()
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER SOCIAL LOGIN DATA ***********************//
    socialLoginData(data: UserSocialLogin) {
        const schema = Joi.object().keys({
            token: Joi.string().required(),
            gcm_id: Joi.array().items(Joi.string()).required(),
            platform: Joi.string().required(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER CATEGORY DATA ***********************//
    validateCategoryData(data: Categories) {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
        });
        return Joi.validate(data, schema);
    }
}
