import CategorySchema, { ICategories } from "../models/category.model";

export class CategorySerice {
    create({ data, req }): Promise<ICategories> {
        return new Promise((resolve, reject) => {
            CategorySchema.create(data)
                .then((data) => {
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })

        })
    }
}