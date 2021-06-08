"use strict";

import { IUser, Role } from "../models/user.model";
import * as Joi from "joi";
interface UserRegister extends IUser {
    email: string;
    password: string;
    phoneNo: number;
    name: string
    gcm_id: string[],
    platform: string,
}
interface UserLogin extends IUser {
    email: string;
    password: string;
    role: Role;
    gcm_id: string[],
    platform: string,
}
interface UserSocialLogin extends IUser {
    token: string;
    gcm_id: string[];
    platform: string;
}

interface UserUpdate extends IUser {
    username: string;
    name: string;
    about: string;
}
export class Validator {
    constructor() { }

    //************************ VALIDATE USER REGISTER DATA ***********************//
    validateRegisterData(data: UserRegister) {
        const schema = Joi.object().keys({
            phoneNo: Joi.number().required(),
            username: Joi.string(),
            name: Joi.string(),
            profileImage: Joi.string(),
            email: Joi.string().email({ minDomainAtoms: 2 }),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER VERIFY DATA ***********************//
    validateVerifyData(data: UserRegister) {
        const schema = Joi.object().keys({
            phoneNo: Joi.number().required(),
            code: Joi.number().required(),
            gcm_id: Joi.string(),
            platform: Joi.string(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER LOGIN DATA ***********************//
    validateLoginData(data: UserLogin) {
        const schema = Joi.object().keys({
            phoneNo: Joi.string().required(),
            // role: Joi.string().required(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE USER UPDATE DATA ***********************//
    validateUserUpdateData(data: UserUpdate) {
        const schema = Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            city: Joi.string(),
            country: Joi.string(),
            birthday: Joi.string(),
            profileImage: Joi.string(),
            birthYearVisibility: Joi.boolean(),
            locationRange: Joi.number(),
            locationVisibility: Joi.boolean(),
            about: Joi.string().min(4).max(60),
        });
        return Joi.validate(data, schema);
    }
    
    //************************ VALIDATE USER UPDATE REQUIRED DATA ***********************//
    validateUserUpdateDataRequired(data: UserUpdate) {
        const schema = Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            birthday: Joi.string().required(),
            profileImage: Joi.string().required(),
            birthYearVisibility: Joi.boolean(),
            locationRange: Joi.number(),
            locationVisibility: Joi.boolean(),
            about: Joi.string().min(4).max(60).required(),
        });
        return Joi.validate(data, schema);
    }

    //************************ VALIDATE ADMIN USER UPDATE DATA ***********************//
    validateAdminUserUpdateData(data: UserUpdate) {
        const schema = Joi.object().keys({
            email: Joi.string(),
            id: Joi.string().required(),
            blocked: Joi.boolean(),
            username: Joi.string(),
            name: Joi.string(),
            about: Joi.string(),
        });
        return Joi.validate(data, schema);
    }
}
