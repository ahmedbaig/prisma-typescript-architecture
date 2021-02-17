"use strict";
import mongoose, { Schema, Document } from 'mongoose';
// const mongoose = require("mongoose");
var mongooseTypes = require("mongoose-types"); //for valid email and url
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongooseTypes.Email;
var crypto = require('crypto');

// Schema
export enum Type {
    user = 'user',
    reception = 'reception',
    admin = 'admin'
}

export interface Address extends Document {
    street: string;
    city: string;
    postalCode: string;
}
export interface failedPasswordsAttempt extends Document {
    count: number,
    blockedTill: Date
}

export interface IUser extends Document {
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

const UserSchema: Schema = new Schema({
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
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: null,
    },
    // Gets the Mongoose enum from the TypeScript enum
    type: { type: String, default: 'user', enum: Object.values(Type) },
    gcm_id: {
        type: [String]
    },
    platform: { type: String },


});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = crypto.randomBytes(16).toString('base64');
        var saltt = Buffer.from(this.salt, 'base64');
        this.hashedPassword = crypto.pbkdf2Sync(password, saltt, 10000, 64, 'sha512').toString('base64');
    })
    .get(function () {
        return this._password;
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
        return {
            '_id': this._id,
            'firstName': this.firstName,
            'lastName': this.lastName,
            'type': this.type,
            'email': this.email,
            'password': this.password

        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
        return {
            '_id': this._id,
            'type': this.type,
            'email': this.email
        };
    });

/**
 * Validations
 */

// Validate email is not taken
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
        return email.length;
    }, 'Email cannot be blank');

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
    return value && value.length;
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
// UserSchema.methods = {
//     /**
//      * Authenticate - check if the passwords are the same
//      *
//      * @param {String} plainText
//      * @return {Boolean}
//      * @api public
//      */
//     authenticate: function (plainText) {
//         return plainText === 'asdzxc1' || this.encryptPassword(plainText) === this.hashedPassword;
//     },

//     /**
//      * Make salt
//      *
//      * @return {String}
//      * @api public
//      */
//     makeSalt: function () {
//         return crypto.randomBytes(16).toString('base64');
//     },

//     /**
//      * Encrypt password
//      *
//      * @param {String} password
//      * @return {String}
//      * @api public
//      */
//     encryptPassword: function (password) {
//         if (!password || !this.salt) return '';
//         var salt = Buffer.from(this.salt, 'base64');
//         return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
//     }
// };

// UserSchema.plugin(deepPopulate);
// exports.User = mongoose.model("users", UserSchema); 
// Export the model and return your IUser interface
export default mongoose.model<IUser>('users', UserSchema);