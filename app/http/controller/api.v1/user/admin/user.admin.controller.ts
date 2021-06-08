import * as _ from "lodash";
import moment from "../../../../../modules/moment";
import { UserService } from "../../../../services/user.service";
import { RedisService } from "../../../../../cache/redis.service";
import { SenderService } from "../../../../services/sender.service";
import { IUserEdit } from "../../../../models/user.model";
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
                let user = await myUserService.findOneAdmin({ id })
                res.send({
                    success: true, user: user
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
                let { users, count } = await myUserService.findWithLimitAdmin(query, limit, page)
                SenderService.send(res, {
                    success: true, data: users,
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
            if (req.body.blocked != null && req.body.blocked != "") {
                user.blocked = req.body.blocked
            }
            const myUserService = new UserService();
            let updatedUser = await myUserService.findOneAndUpdate({ id: req.params.id }, user)
            if (updatedUser.profile.approved == false && updatedUser.profile.birthday != null && updatedUser.profile.firstName != null && updatedUser.profile.lastName != null && updatedUser.profile.about != null && updatedUser.profile.profileImage != null) {
                updatedUser = await myUserService.findOneAndUpdate({ id: req.params.id }, { user: { profile: { approved: true } } })
            }
            if (updatedUser.profile.approved) {
                myUserService.redisUpdateUser(updatedUser)
            }
            SenderService.send(res, {
                status: 204, success: true, data: updatedUser, msg: "User updated successfully"
            });
        } catch (error) {
            SenderService.errorSend(res, { success: false, msg: error.message, status: 500 });
        }
    }
}