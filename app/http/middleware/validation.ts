import compose from "composable-middleware"
import { Validator } from "../controller/validate";
import { ValidateImages } from "../models/images.user.model";
import { SenderService } from "../services/sender.service";
export class ValidationMiddleware extends Validator {
    constructor() {
        super();
    }
    validateUserRegistration() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateRegisterData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                                status: 400
                            };
                            SenderService.errorSend(res, errors);
                            return;
                        });
                })
        )
    }
    validateUserVerify() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateVerifyData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                                status: 400
                            };
                            SenderService.errorSend(res, errors);
                            return;
                        });
                })
        )
    }
    validateUserLogin() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateLoginData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                                status: 400
                            };
                            SenderService.errorSend(res, errors);
                            return;
                        })
                })
        )
    }
    validateUserUpdate() {
        return (
            compose()
                .use((req, res, next) => {
                    if (req.user.data.profile.approved == false) {
                        super.validateUserUpdateDataRequired(req.body)
                            .then(data => {
                                next();
                            }).catch(error => {
                                var errors = {
                                    success: false,
                                    msg: error.details[0].message,
                                    data: error.name,
                                    status: 400
                                };
                                SenderService.errorSend(res, errors);
                                return;
                            })
                    } else {
                        super.validateUserUpdateData(req.body)
                            .then(data => {
                                next();
                            }).catch(error => {
                                var errors = {
                                    success: false,
                                    msg: error.details[0].message,
                                    data: error.name,
                                    status: 400
                                };
                                SenderService.errorSend(res, errors);
                                return;
                            })
                    }
                })
        )
    }

    validateAdminUserUpdate() {
        return (
            compose()
                .use((req, res, next) => {
                    super.validateAdminUserUpdateData(req.body)
                        .then(data => {
                            next();
                        }).catch(error => {
                            var errors = {
                                success: false,
                                msg: error.details[0].message,
                                data: error.name,
                                status: 400
                            };
                            SenderService.errorSend(res, errors);
                            return;
                        })
                })
        )
    }
    validateUserImageCount() {
        return (
            compose()
                .use((req, res, next) => {
                    const validateImages = new ValidateImages();
                    validateImages.validate(req.user.id, {
                        error: (msg) => SenderService.errorSend(res, { success: false, status: 409, msg }),
                        next: (count) => { req.body.alreadyUploaded = count; next() }
                    })
                })
        )
    }
}
