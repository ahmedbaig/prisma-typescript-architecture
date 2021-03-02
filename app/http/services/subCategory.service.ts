import subCategorySchema, { ISubCategory } from "../models/subCategory.model";

export class SubCategoryService {
    create({ data, req }): Promise<ISubCategory> {
        return new Promise((resolve, reject) => {
            subCategorySchema.create(data)
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        });
    }
}