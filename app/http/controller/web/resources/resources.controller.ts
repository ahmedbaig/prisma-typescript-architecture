import path from "path";
import * as appRoot from 'app-root-path'

export class Resources{
    public_image_get (req, res) {
        let filename = req.params.filename.replace(/\//g, '.')
        res.sendFile(
            path.join(appRoot.path, "views/images", filename)
        );
    };
    
}