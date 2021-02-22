import path from "path";
import * as appRoot from "app-root-path"
import { UserService } from "../../../services/user.service";
import { MailSender } from "../../../mail";
import { AuthService } from "../../../services/auth.service";

export class Verification {

    verify_email(req, res) {
        let auth_service_obj = new AuthService()
        auth_service_obj.verifyNewAccountToken(req.params.token, {
            errorCallback: (error) => {
                var errorBags = [{
                    message: error.msg,
                },];
                res.render(path.join(appRoot.path, "views/error/bags.ejs"), { errorBags });
                return;
            },
            callback: (data) => {
                let user_service_obj = new UserService()
                user_service_obj.findById(data.userId).then((user: any = {}) => {
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
                        user_service_obj.update({ _id: user._id }, { isEmailVerified: true })
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