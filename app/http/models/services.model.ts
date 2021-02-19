import mongoose, { Schema, Document } from "mongoose";
import mongooseTypes from "mongoose-types";

export interface IServices extends Document {
    name: string,
    image: string,
    createdDate: Date,
    updatedDate: Date
}

const ServiceSchema = new Schema<IServices>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: null,
    }
});

ServiceSchema.pre<IServices>('save', function (next) {
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});