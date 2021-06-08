
import { errorRouter } from "../app/http/controller/web/error";
import { resourceRouter } from "../app/http/controller/web/resources";
import { verificationRouter } from "../app/http/controller/web/verification"
import { viewsRouter } from "../app/http/controller/web/views"

module.exports = function (app) {

    app.use("/error", errorRouter);

    app.use("/resources", resourceRouter);

    app.use("/verification", verificationRouter);
    
    app.use("/", viewsRouter)

}