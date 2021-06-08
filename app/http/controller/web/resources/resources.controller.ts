import path from "path";
import appRoot from 'app-root-path'
import fs from 'fs';
import request from "request";
import config from "config";
const cloudinary = require('cloudinary').v2;
export class Resources {
    public_image_get(req, res) {
        let filename = req.params.filename.replace(/\//g, '.')
        let split = filename.split(".");
        let ext = split[split.length - 1];
        if (
            ext === "png" ||
            ext === "jpeg" ||
            ext === "jpg"
        ) {
            if (fs.existsSync(path.join(appRoot.path, "public/images", filename))) {
                res.sendFile(
                    path.join(appRoot.path, "public/images", filename)
                );
            } else {
                res.status(404).render(path.join(appRoot.path, "views/error/404.ejs"), { error: "" })
            }
        } else {
            res.status(403).render(path.join(appRoot.path, "views/error/403.ejs"), { error: "YOU CAN'T ACCESS THIS ROUTE THROUGH THE BROWSER" })
        }
    };
    cloudinary_image_get(req, res) {
        let filename = req.params.filename.replace(/\//g, '.')
        cloudinary.api.resource(`images/${req.params.userId}/${filename}`)
            .then(result => {
                let ext = result.format;
                if (
                    ext === "png" ||
                    ext === "jpeg" ||
                    ext === "jpg"
                ) {
                    res.redirect(result.secure_url)
                } else {
                    res.status(403).render(path.join(appRoot.path, "views/error/403.ejs"), { error: "YOU CAN'T ACCESS THIS ROUTE THROUGH THE BROWSER" })
                }
            })
            .catch(error => () => {
                res.status(404).render(path.join(appRoot.path, "views/error/404.ejs"), { error: "" })
            });
    };
    public_css_get(req, res) {

        let filename = req.params.filename.replace(/\//g, '.')
        let split = filename.split(".");
        let ext = split[split.length - 1];
        if (
            ext === "css"
        ) {
            res.sendFile(
                path.join(appRoot.path, "views/error/", filename)
            );
        } else {
            res.status(403).render(path.join(appRoot.path, "views/error/403.ejs"), { error: "YOU CAN'T ACCESS THIS ROUTE THROUGH THE BROWSER" })
        }
    };
}