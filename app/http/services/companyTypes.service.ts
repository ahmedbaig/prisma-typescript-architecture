import companyTypeSchema, { ICompanyType } from "../models/companyTypes.model";

export class CompanyTypeService {
    create({ data, req }): Promise<ICompanyType> {
        return new Promise((resolve, reject) => {
            companyTypeSchema.create(data)
                .then(data => resolve(data))
                .catch(error => reject(error))
        })
    }
} 