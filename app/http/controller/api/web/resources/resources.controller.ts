import path from "path";
import * as appRoot from 'app-root-path'

export let public_image_get = async function (req, res) {
    let filename = req.params.filename.replace(/\//g, '.')
    res.sendFile(
        path.join(appRoot.path, "views/images", filename)
    );
};
