'use strict';
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
import * as fs from "fs";
const globalAny: any = global;
globalAny.ROOTPATH = __dirname;

var app = express();

// const swaggerUi = require("swagger-ui-express"),
//     swaggerDocument = require("./swagger.json");

app.use(cors());

app.use(express.static(__dirname + "views"));

app.set("view engine", "ejs");

// Express TCP requests parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser());

// create a write stream (in append mode) for system logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('common', { stream: accessLogStream }))

// Static rendering
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

// Route definitions
app.use('/cache', require('./app/cache'))
app.use("/console", require('./routes/console'));

app.use("/api", require("./routes/api"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// require("./routes/web")(app);;

module.exports = app;