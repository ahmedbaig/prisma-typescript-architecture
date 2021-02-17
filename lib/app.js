'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = __importStar(require("fs"));
const globalAny = global;
globalAny.ROOTPATH = __dirname;
var app = express();
// const swaggerUi = require("swagger-ui-express"),
//     swaggerDocument = require("./swagger.json");
app.use(cors());
app.use(express.static(__dirname + "views"));
app.set("view engine", "ejs");
// Express TCP requests parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
// create a write stream (in append mode) for system logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(logger('common', { stream: accessLogStream }));
// Static rendering
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
// Route definitions
app.use('/cache', require('./app/cache'));
app.use("/console", require('./routes/console'));
app.use("/api", require("./routes/api"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// require("./routes/web")(app);;
module.exports = app;
//# sourceMappingURL=app.js.map