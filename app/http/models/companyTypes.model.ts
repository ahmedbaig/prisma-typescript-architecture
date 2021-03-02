import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyType extends Document {
    name: string;
    image: string;
    imageId: string;
    createAt: Date;
    updatedAt: Date
};

const companyTypeSchema = new Schema<ICompanyType>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});
companyTypeSchema.pre<ICompanyType>('save', function (next) {
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});

export default mongoose.model<ICompanyType>("company_types", companyTypeSchema)