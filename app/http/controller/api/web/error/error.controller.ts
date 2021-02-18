import path from "path";

const globalAny: any = global;
globalAny.ROOTPATH = __dirname;

export let not_found_page = async function (req, res) {
    res.render(path.join(globalAny.ROOTPATH, "views/views/error/404.ejs"));
};

export let internal_server_error = async function (req, res) {
    if (req.query.err == null || req.query.err == "") {
        req.query.err = "Misuse of resource";
    }
    res.render(path.join(globalAny.ROOTPATH, "views/views/error/500.ejs"), { error: req.query.err });
};