import path from "path";
import { verifyNewAccountToken } from '../../../../services/auth.service';
import { findById, update } from "../../../../services/user.service";
import { sendUserVerifyEmail } from "../../../../mail";
const globalAny: any = global;
globalAny.ROOTPATH = __dirname;


export let verify_email = (req, res) => {
    verifyNewAccountToken(req.params.token, {
        errorCallback: (error) => {
            var errorBags = [{
                message: error.msg,
            },];
            res.render(path.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
            return;
        },
        callback: (data) => {
            findById(data.userId).then((user: any = {}) => {
                if (data.token) { // User has an expired token 
                    if (user == null) {
                        var errorBags = [{
                            message: "User not found",
                        },];
                        res.render(path.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                        return;
                    }
                    sendUserVerifyEmail({
                        token: data.token.token.token,
                        user
                    }).then(data => {
                        res.render(path.join(globalAny.ROOTPATH, "views/views/pages/verify-email-resend.ejs"), {
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
                            res.render(path.join(globalAny.ROOTPATH, "views/views/pages/verify-email.ejs"), {
                                email: user.email,
                            });
                        }).catch(error => {
                            var errorBags = [{
                                message: error.msg,
                            },];
                            res.render(path.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                            return;
                        })
                }
            }).catch((error) => {
                var errorBags = [{
                    message: error.msg,
                },];
                res.render(path.join(globalAny.ROOTPATH, "views/views/error/bags.ejs"), { errorBags });
                return;
            });
        }
    })
}