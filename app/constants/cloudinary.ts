require('dotenv').config();
const cloudinary = require('cloudinary').v2; 
import config from "config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    env_variable: process.env.CLOUDINARY_ENV_VARIABLE
});
export interface ICloudinaryUpload {
    id: string;
    path: string;
    url: string;
}
export class Cloudinary {

    uploads(file, name) {
        return new Promise((resolve, reject) => {
            try {
                cloudinary.uploader.unsigned_upload(file, "kqlyxzrz", {
                    public_id: `${name}`,
                }).then(function (result, error) {
                    resolve({
                        url: result.url,
                        path: `${config.get("origin")}/resources/cloudinary/${result.public_id}`,
                        id: result.public_id
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    remove(cloudinaryId) {
        return new Promise(resolve => {
            cloudinary.uploader.destroy(cloudinaryId).then((result) => {
                resolve(result)
            })
        })
    }

}