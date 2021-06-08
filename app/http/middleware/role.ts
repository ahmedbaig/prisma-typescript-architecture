import compose from "composable-middleware";
import e from "express";
export class RoleMiddleware {
    isAdmin() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.role == 'ADMIN') {
                        next();
                    } else {
                        res.status(401).send({ success: false, msg: "Insufficient privileges." });
                        return
                    }
                })
        )
    }
    isUser() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.role == 'USER' || req.user.role == 'ADMIN') {
                        next();
                    } else {
                        res.status(401).send({ success: false, msg: "Insufficient privileges." });
                        return
                    }
                })
        )
    }
}