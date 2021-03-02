
import { SubCategoryService } from "../../../../services/subCategory.service"
import { Cloudinary, IUploadsResponse } from "../../../../../constants/cloudinary";
export class SubCategory {
    constructor() {
    }
    async createSubCategory(req, res) {
        let cloudinary_uploads = new Cloudinary()
        let subCategoryInstance = new SubCategoryService()
        try {
            const path = req.file.path;
            const dir = `uploads/sub_categories/`;
            let imgUrl: IUploadsResponse = await cloudinary_uploads.uploads(path, dir);
            let { url, id } = imgUrl;
            let { name } = req.body;
            let data = {
                name,
                image: url,
                imageId: id
            }
            let createSubCategory = await subCategoryInstance.create({ data: data, req });
            res.status(200).send({ success: true, data: createSubCategory, msg: "Sub Category created successfully" })
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message })
        }
    }
} 