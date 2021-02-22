
import { CategorySerice } from "../../../../services/category.service"

export class Category {
    constructor() {
    }
    async createService(req, res) {
        let Category = new CategorySerice()
        try {
            let createService = await Category.create({ data: req.body, req })
            console.log("🚀 ~ file: category.controller.ts ~ line 11 ~ Service ~ createService ~ createService", createService)
        } catch (error) {
            console.log("🚀 ~ file: category.controller.ts ~ line 12 ~ Service ~ createService ~ error", error)
        }
    }
} 