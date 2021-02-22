import mongoose, { Schema, Document } from "mongoose";

export interface ICategories extends Document {
    name: string,
    image: string,
    createdDate: Date,
    updatedDate: Date
}

const CategorySchema = new Schema<ICategories>({
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

CategorySchema.pre<ICategories>('save', function (next) {
    this.name.trim()[0].toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});

export default mongoose.model<ICategories>('categories', CategorySchema);