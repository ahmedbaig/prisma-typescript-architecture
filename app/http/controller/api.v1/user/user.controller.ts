import { User } from "@prisma/client";
import { Sender } from "../../../common/sender.handler";
import { SuccessObject, ErrorObject } from "../../../interfaces/ISender";
import { IUserController } from "../../../interfaces/IUserController";


export const userController = new class UserController implements IUserController<User> {
    create(req: any, res: any): ((res: any, data: SuccessObject) => any) | ((res: any, data: ErrorObject) => any) {
        return Sender.send(res, { success: true, status: 200, msg: "IMPLEMENTED" })
    }
    get(req: any, res: any): ((res: any, data: SuccessObject) => any) | ((res: any, data: ErrorObject) => any) {
        throw new Error("Method not implemented.");
    }
    update(req: any, res: any): ((res: any, data: SuccessObject) => any) | ((res: any, data: ErrorObject) => any) {
        throw new Error("Method not implemented.");
    }
    delete(req: any, res: any): ((res: any, data: SuccessObject) => any) | ((res: any, data: ErrorObject) => any) {
        throw new Error("Method not implemented.");
    }
}