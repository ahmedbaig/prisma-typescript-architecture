import { IRequestHandler } from "./IRequestHandler";
export default interface IBaseController {
    create: IRequestHandler['request'];
    get: IRequestHandler['request'];
    update: IRequestHandler['request'];
    delete: IRequestHandler['request'];
}