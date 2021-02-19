import path from "path";
import * as appRoot from 'app-root-path'
export class Error {
    not_found_page(req, res) { 
        res.render(path.join(appRoot.path, "views/error/404.ejs"));
    };
    internal_server_error(req, res) {
        if (req.query.err == null || req.query.err == "") {
            req.query.err = "Misuse of resource";
        }
        res.render(path.join(appRoot.path, "views/error/500.ejs"), { error: req.query.err });
    };
}