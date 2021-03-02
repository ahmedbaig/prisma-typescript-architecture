import { CompanyTypeService } from "../../../../services/companyTypes.service";
import { Cloudinary, IUploadsResponse } from "../../../../../constants/cloudinary";
export class CompanyTypeController {
    constructor() {
    }
    async create(req, res) {
        let cloudinary_uploads = new Cloudinary();
        let companyTypeServiceInstance = new CompanyTypeService();
        try {
            const path = req.file.path;
            const dir = `uploads/company_type/`;
            let imgUrl: IUploadsResponse = await cloudinary_uploads.uploads(path, dir);
            let { url, id } = imgUrl;
            let { name } = req.body;
            let data = {
                name,
                image: url,
                imageId: id
            }
            let createSubCategory = await companyTypeServiceInstance.create({ data: data, req });
            res.status(200).send({ success: true, data: createSubCategory, msg: "Company type created successfully" })
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message })
        }
    }
}