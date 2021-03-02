import mongoose, { Schema, Document } from "mongoose";
import { ICategories } from "./category.model";

export interface ISubCategory extends Document {
    name: string;
    image: string;
    imageId: string;
    serviceId: ICategories["_id"];
    createdAt: Date;
    updateAt: Date;
};

const subCategorySchema = new Schema<ICategories>({
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
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "categories"
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: null,
    }
});

subCategorySchema.pre<ISubCategory>('save', function (next) {
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});

export default mongoose.model<ISubCategory>("sub_categories", subCategorySchema)