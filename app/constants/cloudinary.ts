const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
const { reject } = require('lodash');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    env_variable: process.env.CLOUDINARY_ENV_VARIABLE
});
export interface IUploadsResponse{
    url: string,
    id: string
}
export class Cloudinary {
    uploads(file, name): Promise<IUploadsResponse> {
        return new Promise((resolve, reject) => {
            try {
                cloudinary.uploader.upload(file, (result) => {
                    resolve({
                        url: result.url,
                        id: result.public_id
                    })
                }, {
                    resource_type: "auto",
                    folder: name
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    remove(cloudinaryId) {
        return new Promise(resolve => {
            cloudinary.uploader.destroy(cloudinaryId, (result) => {
                console.log(result);
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            })
        })
    }

}