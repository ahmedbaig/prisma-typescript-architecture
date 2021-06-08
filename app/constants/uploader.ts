import compose from "composable-middleware"
import fs from 'fs';
import path from 'path'; 
import { SenderService } from "../http/services/sender.service";

// This implementation requires busboy-body-parser initialized in app
interface IFields {
    name: string;
}
export class Uploader {
    static dest: string = './public/images';
    public static fields(names: IFields[]) {
        return (
            compose()
                .use((req, res, next) => {
                    if (req.files == null) { next(); } else {
                        names.forEach(o => {
                            if (req.files[o.name] != null) {
                                Uploader.fileFilter(req.files[o.name], (error, status) => {
                                    if (!status) SenderService.errorSend(res, { success: false, msg: error, status: 500 })
                                    Uploader.fileStorage(req.files[o.name], (error, status, files) => {
                                        if (!status) SenderService.errorSend(res, { success: false, msg: error, status: 500 })
                                        req.body.files = files;
                                        next();
                                    })
                                })
                            }
                        })
                    }
                })
        )
    }

    public static async fileStorage(files, cb) {
        let filePaths = await Promise.all(files.map(async file => {
            let filePath = path.join(Uploader.dest, `${new Date().toISOString().replace(/:/g, "-")}-${file.name}`);
            await fs.writeFileSync(filePath, file.data);
            return filePath;
        }))
        cb(null, true, filePaths);
    }

    public static fileFilter(files, cb) {
        files.forEach(file => {
            if (
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/jpg" &&
                file.mimetype !== "image/jpeg"
            ) {
                cb("Image uploaded is not of type jpg/jpeg or png", false);
            }
        });
        cb(null, true);
    }
}