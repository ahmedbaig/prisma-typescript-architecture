export default interface ISender {
    errorSend: (res: any, data: ErrorObject) => any;
    send: (res: any, data: SuccessObject) => any;
}
export interface ErrorObject {
    success: boolean;
    status: ErrorCodes;
    msg?: string;
    raw?: any;
    message?: string
}

export interface SuccessObject {
    success: boolean;
    status: ErrorCodes;
    msg?: string;
    data?: any;
    raw?: any;
    message?: string;
    pages?: number;
    page?: number;
    count?: number;
}

enum ErrorCodes {
    success = 200,
    created = 201,
    badRequest = 400,
    unAuthorizedAccess = 401,
    conflict = 409,
    serverError = 500,
}