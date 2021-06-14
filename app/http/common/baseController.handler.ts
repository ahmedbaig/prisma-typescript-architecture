import IBaseController from "../interfaces/IBaseController";
import ISender, { ErrorObject, SuccessObject } from "../interfaces/ISender";
import { Sender } from "./sender.handler";

export default class BaseController implements IBaseController {
    create(req: any, res: any): ISender['send'] | ISender['errorSend'] { throw Sender.errorSend(res, { success: false, status: 501, msg: "Method not implemented" }) };
    get(req: any, res: any): ISender['send'] | ISender['errorSend'] { throw Sender.errorSend(res, { success: false, status: 501, msg: "Method not implemented" }) };
    update(req: any, res: any): ISender['send'] | ISender['errorSend'] { throw Sender.errorSend(res, { success: false, status: 501, msg: "Method not implemented" }) };
    delete(req: any, res: any): ISender['send'] | ISender['errorSend'] { throw Sender.errorSend(res, { success: false, status: 501, msg: "Method not implemented" }) };
}