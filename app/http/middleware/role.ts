import compose from "composable-middleware";
import e from "express";
export class RoleMiddleware {

    isSuperAdmin() {
        return (
            compose()
                .use((req, res, next) => {
                    if (req.user.type == "Super Admin") {
                        next();
                    } else {
                        res.status(401).send({ success: false, msg: "Inusfficient  privileges." })
                    }
                })
        )
    }
    isAdmin() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.type == 'admin') {
                        next();
                    } else {
                        res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
                        return
                    }
                })
        )
    }
    isReception() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.type == 'reception' || req.user.type == 'admin') {
                        next();
                    } else {
                        res.status(401).send({ success: false, msg: "Insufficient privileges. Contact admin" });
                        return
                    }
                })
        )
    }
}