import path from "path";
import * as appRoot from 'app-root-path'
export class Views {
    index(req, res) {
        res.render(path.join(appRoot.path, "views/pages/welcome.ejs"));
    };
    login(req, res) {
        res.render(path.join(appRoot.path, "views/pages/login.ejs"));
    };

    social_callback(req, res) {
        res.cookie("user", JSON.stringify(req.user));
        // Successful authentication, redirect success.
        res.render(path.join(appRoot.path, 'views/pages/social-success.ejs'), { user: req.user })
    }

    not_found(req, res) {
        res.render(path.join(appRoot.path, "views/error/404.ejs"));
    };
}