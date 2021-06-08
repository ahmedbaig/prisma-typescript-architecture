import * as _ from "lodash";
import * as fs from "fs";
import moment from "../../../../modules/moment";
import { UserService } from "../../../services/user.service";
import { RedisService } from "../../../../cache/redis.service";
import { SenderService } from "../../../services/sender.service";
import { IUserEdit } from "../../../models/user.model";
import { Cloudinary, ICloudinaryUpload } from "../../../../constants/cloudinary";
import { ImageService } from "../../../services/image.service";
export class User extends RedisService {
    constructor() {
        super();
    }
    async get(req, res) {
        try {
            let limit = _.toInteger(req.query.limit);
            let page = _.toInteger(req.query.page);
            let { key, id } = req.query;
            let myUserService = new UserService();
            if (id != null && id != "" && id != undefined) {
                let user = await myUserService.findOne({ id })
                myUserService.redisUpdateUser(user);
                res.send({
                    success: true, user: user.profile
                })
                return;
            } else {
                let query = { blocked: false, role: "USER", profile: { approved: true } }
                if (key != null && key != "") {
                    let orQuery = [
                        { email: { contains: key, mode: "insensitive", } },
                        { profile: { firstName: { contains: key, mode: "insensitive", } } },
                        { profile: { lastName: { contains: key, mode: "insensitive", } } }
                    ]
                    query['OR'] = orQuery;
                }
                let { users, count } = await myUserService.findWithLimit(query, limit, page)
                let user_profiles = users.map(x => x.profile)
                users.map(user => myUserService.redisUpdateUser(user))
                SenderService.send(res, {
                    success: true, data: user_profiles,
                    raw: req.user,
                    page: page,
                    pages: Math.ceil(count / limit),
                    count,
                    status: 200
                });
            }
        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }

    async update(req, res) {
        try {
            let update = req.body;
            if (req.body.birthday != null && req.body.birthday != "") {
                if (!moment(req.body.birthday).olderThan14()) {
                    SenderService.errorSend(res, { success: false, msg: "You must be older than 14 years to use the app", status: 400 });
                    return;
                } else {
                    update['birthday'] = moment(req.body.birthday).format()
                }
            }
            update['city'] = update.city.toLowerCase();
            update['country'] = update.country.toLowerCase();
            let user: IUserEdit = {
                profile: {
                    update
                }
            }
            const myUserService = new UserService();
            let updatedUser = await myUserService.findOneAndUpdate({ id: req.user.id }, user)
            if (req.user.data.profile.approved == false && updatedUser.profile.firstName != null && updatedUser.profile.lastName != null && updatedUser.profile.about != null && updatedUser.profile.profileImage != null) {
                updatedUser = await myUserService.findOneAndUpdate({ id: req.user.id }, { profile: { update: { approved: true } } })
                myUserService.redisUpdateUser(updatedUser) // this only works once because the profile is approved after registrations
            }
            if (req.user.data.profile.approved) {
                myUserService.redisUpdateUser(updatedUser)
            }
            SenderService.send(res, {
                status: 200, success: true, data: updatedUser, msg: "User updated successfully"
            });
        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }

    async uploader(req, res) {
        try {
            let { files, alreadyUploaded } = req.body;
            const image: any = async (path, name) => { // MINI Function
                const cloudinary = new Cloudinary()
                return await cloudinary.uploads(path, `${req.user.id}/${name}`);
            }
            if (files != null && files.length != 0) {
                if (files.length > Math.abs(3 - alreadyUploaded)) {
                    SenderService.errorSend(res, { success: false, status: 409, msg: `Your profile already has ${alreadyUploaded} images uploaded. Cannot upload more than ${Math.abs(3 - alreadyUploaded)} images on your profile` })
                    files.map(file => {
                        fs.unlink(file, () => { console.log(`Deleted ${file}`) });
                    })
                } else {
                    let images: ICloudinaryUpload[] = await Promise.all(files.map(async file => {
                        let pathSplit = file.split('\\')[2].split('.').slice(0, -1).join('.')
                        const imgURL = await image(file, pathSplit);
                        fs.unlink(file, () => { console.log(`Deleted ${file}`) });
                        return imgURL;
                    }))
                    const imageService = new ImageService();
                    SenderService.send(res, { success: true, data: await imageService.create(images.map(i => { return { cloudinaryId: i.id, path: i.path, userId: req.user.id } })), msg: "Images uploaded", status: 201 })
                }
            } else {
                SenderService.errorSend(res, { success: false, status: 400, msg: "Files not found" })
            }

        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }

    async getImages(req, res) {
        try {
            const imageService = new ImageService();
            SenderService.send(res, { success: true, data: await imageService.find({ userId: req.params.id, type: "USER" }), status: 200 })
        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }
    async imageRemove(req, res) {
        try {
            const image: any = async (path) => { // MINI Function
                const cloudinary = new Cloudinary()
                return await cloudinary.remove(path);
            }
            const imageService = new ImageService();
            const deletedImage = await imageService.findOne({ id: req.body.id, userId: req.user.id, type: "USER" })
            await image(deletedImage.cloudinaryId);
            SenderService.send(res, { success: true, msg: "Image deleted", data: await imageService.delete({ userId: req.user.id, type: "USER", id: req.body.id }), status: 200 })
        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }
}
