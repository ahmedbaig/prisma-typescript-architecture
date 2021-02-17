"use strict";
import mongoose, { Schema, Document } from 'mongoose';
const moment = require("moment");
import { IUser } from './user.model';

export interface IToken extends Document {
  transaction: string;
  userId: IUser['_id'];
  token: string;
  expiresIn: Date;
  createdAt: Date;
}

const TokenSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "transaction",
  },
  token: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    default: moment().add(1, "hours"), // Expiration set to 1 hours on dev and 5 minutes on staging
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
});
// exports.Token = mongoose.model("token", tokenSchema);
export default mongoose.model<IToken>('token', TokenSchema);