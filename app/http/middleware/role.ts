import compose from "composable-middleware";
export class RoleMiddleware {
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