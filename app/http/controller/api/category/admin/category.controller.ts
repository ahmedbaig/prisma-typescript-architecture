
import { CategorySerice } from "../../../../services/category.service"
import { Cloudinary, IUploadsResponse } from "../../../../../constants/cloudinary";
export class Category {
    constructor() {
    }
    async createService(req, res) {
        let cloudinary_uploads = new Cloudinary()
        let Category = new CategorySerice()
        try {
            const path = req.file.path;
            const dir = `uploads/categories/`;
            console.log(req.file.path)
            let imgUrl: IUploadsResponse = await cloudinary_uploads.uploads(path, dir);
            let { url, id } = imgUrl;
            let { name } = req.body;
            let data = {
                name,
                image: url,
                imageId: id
            }
            let createCategory = await Category.create({ data: data, req });
            res.status(200).send({ success: true, data: createCategory, msg: "Category created successfully" })
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message })
        }
    }
} 