import ISender from "../interfaces/ISender";
export const Sender = new class Sender implements ISender {
    errorSend(res, data): any {
        console.error("ERROR", data)
        return res.status(data.status).send(data);
    }
    send(res, data) {
        return res.status(data.status).send(data);
    }
} 
