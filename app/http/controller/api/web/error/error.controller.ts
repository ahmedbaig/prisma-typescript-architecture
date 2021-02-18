import path from "path";
import * as appRoot from 'app-root-path'
export let not_found_page = async function (req, res) {
    res.render(path.join(appRoot.path, "views/error/404.ejs"));
};

export let internal_server_error = async function (req, res) {
    if (req.query.err == null || req.query.err == "") {
        req.query.err = "Misuse of resource";
    }
    res.render(path.join(appRoot.path, "views/views/error/500.ejs"), { error: req.query.err });
};