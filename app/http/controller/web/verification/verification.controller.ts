import path from "path";
import * as appRoot from "app-root-path"
import { verifyNewAccountToken } from '../../../services/auth.service';
import { findById, update } from "../../../services/user.service";
import { MailSender } from "../../../mail";

export class Verification {
    verify_email(req, res) {
        verifyNewAccountToken(req.params.token, {
            errorCallback: (error) => {
                var errorBags = [{
                    message: error.msg,
                },];
                res.render(path.join(appRoot.path, "views/error/bags.ejs"), { errorBags });
                return;
            },
            callback: (data) => {
                findById(data.userId).then((user: any = {}) => {
                    if (data.token) { // User has an expired token 
                        if (user == null) {
                            var errorBags = [{
                                message: "User not found",
                            },];
                            res.render(path.join(appRoot.path, "views/error/bags.ejs"), { errorBags });
                            return;
                        }
                        let mail_sender_obj = new MailSender(user, data.token.token.token)
                        mail_sender_obj.sendUserVerifyEmail()
                            .then(data => {
                                res.render(path.join(appRoot.path, "views/pages/verify-email-resend.ejs"), {
                                    email: user.email,
                                });
                                return;
                            }).catch(error => {
                                res.status(error.status).send(error);
                                return;
                            });
                    } else { // DONE 
                        update({ _id: user._id }, { isEmailVerified: true })
                            .then(() => {
                                res.render(path.join(appRoot.path, "views/pages/verify-email.ejs"), {
                                    email: user.email,
                                });
                            }).catch(error => {
                                var errorBags = [{
                                    message: error.msg,
                                },];
                                res.render(path.join(appRoot.path, "views/error/bags.ejs"), { errorBags });
                                return;
                            })
                    }
                }).catch((error) => {
                    var errorBags = [{
                        message: error.msg,
                    },];
                    res.render(path.join(appRoot.path, "views/error/bags.ejs"), { errorBags });
                    return;
                });
            }
        })
    }
}