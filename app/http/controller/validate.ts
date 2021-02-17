"use strict";

const Joi = require("joi");
interface RegisterData {
    email: string;
    password: string;
    dob: string;
    phoneNo: number;
}
//************************ VALIDATE USER REGISTER DATA ***********************//
function validateRegisterData(data: any) {
    const schema = Joi.object().keys({
        // REQURIED 
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(8).required(),
        dob: Joi.date().required(),
        phoneNo: Joi.number().required(),
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
        type: Joi.string(),
        gcm_id: Joi,
        platform: Joi.string(),
    });
    return Joi.validate(data, schema);
}

//************************ VALIDATE USER LOGIN DATA ***********************//
function validateLoginData(data) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(5),
        type: Joi.string()
    });
    return Joi.validate(data, schema);
}

function socialLoginData(data) {
    const schema = Joi.object().keys({
        token: Joi.string().required(),
        gcm_id: Joi,
        platform: Joi.string(),
    });
    return Joi.validate(data, schema);
}

export default {
    validateRegisterData,
    validateLoginData,
    socialLoginData
}
