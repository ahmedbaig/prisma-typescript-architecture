import compose from "composable-middleware";
import { RedisService } from "../../cache/redis.service";
import * as _ from "lodash";
import { SenderService } from "../services/sender.service";
export class CacheMiddleware extends RedisService {
    constructor() {
        super();
    }
    userSearch() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    let { id, key } = req.query;
                    if (id != null && id != "" && id != undefined) {
                        // Update user trend +1;
                        super.getData(`${id}|user|analytics|search`).then(data =>
                            super.setData(data !== null ? _.toInteger(data) + 1 : 1, `${id}|user|analytics|search`, 86400).catch((error) => { throw error })
                        )
                        super.searchData(`*${id}|user`).then(users => {
                            if (users.length > 0) {
                                SenderService.send(res,{
                                    success: true, data: users[0], status: 200,
                                })
                            } else {
                                next()
                            }
                        }).catch((error) => {
                            SenderService.errorSend(res, { status: 500, success: false, msg: error.message });
                        })
                    } else if (key != null && key != "" && key != undefined) {
                        super.searchData(`*${key}*|user`).then(users => {
                            if (users.length > 0) {
                                SenderService.send(res, {
                                    status:200,
                                    success: true,
                                    data: users,
                                    page: null,
                                    pages: null,
                                    count: users.length
                                })
                            } else {
                                next()
                            }
                        }).catch((error) => {
                            SenderService.errorSend(res, { status: 500, success: false, msg: error.message });
                        })
                    } else {
                        next();
                    }
                })
        )
    }
}