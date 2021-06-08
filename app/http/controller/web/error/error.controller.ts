import path from "path";
import * as appRoot from 'app-root-path'
export class Error {
    unauthorized(req, res) {
        res.status(401).render(path.join(appRoot.path, "views/error/401.ejs"));
    };
    forbidden(req, res) {
        if (req.query.err == null || req.query.err == "") {
            req.query.err = "Misuse of resource";
        }
        res.status(403).render(path.join(appRoot.path, "views/error/403.ejs"), { error: req.query.err });
    };
    not_found_page(req, res) {
        res.status(404).render(path.join(appRoot.path, "views/error/404.ejs"));
    };
    internal_server_error(req, res) {
        if (req.query.err == null || req.query.err == "") {
            req.query.err = "Misuse of resource";
        }
        res.status(500).render(path.join(appRoot.path, "views/error/500.ejs"), { error: req.query.err });
    };
}