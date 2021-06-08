'use strict';
const express = require("express");
const session = require('express-session');
const RateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const path = require("path");
const cors = require("cors");

const busboyBodyParser = require('busboy-body-parser');
const cookieParser = require("cookie-parser");
const appRoot = require('app-root-path')

const passport = require('passport');
const fs = require("fs")
const logger = require("morgan");

const RedisStore = require('connect-redis')(session)
import { RedisService } from './app/cache/redis.service';
import { BrowserMiddleware } from './app/http/middleware/browser';
const redisClient = new RedisService();

var app = express();
app.use(cors());

app.use(session({
    store: new RedisStore({ client: redisClient.connectCache() }),
    secret: process.env.PASSPHRASE,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie 
        maxAge: 48 * 60 * 60 * 1000 // 48 hours session max age in miliseconds
    }
}))

app.use(passport.initialize());
app.use(passport.session());

// Express TCP requests parsing
app.use(busboyBodyParser({ limit: '10mb', multi:true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// create a write stream (in append mode) for system logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('common', { stream: accessLogStream }))

// Static rendering
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

// Rate limiter
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// app.set('trust proxy', 1);

// Storing in memCache
const slD = new slowDown({
    prefix: "slowDown",
    windowMs: 5 * 60 * 1000, //how long to keep records of requests in memory.
    delayAfter: 50,
    delayMs: 500, // begin adding 500ms of delay per request above 100:
});
const rtL = new RateLimit({
    max: 100,
    prefix: "rateLimit",
    skipFailedRequests: false, // Do not count failed requests (status >= 400)
    skipSuccessfulRequests: false, // Do not count successful requests (status < 400)
    windowMs: 5 * 60 * 1000,
    expiry: 300,
    resetExpiryOnChange: true,
    handler: function (req, res /*, next*/) { 
        // res.status(429).send({ success: false, msg: "Too any requests, please try again later" })
        res.status(429).render(path.join(appRoot.path, "views/error/429.ejs"), { error: "Too any requests from your IP, please try again later" });
        return;
    },
    // onLimitReached: function (req, res, optionsUsed) {
    //     console.log("HERE Limit reached")
    //     // res.status(429).send({ success: false, msg: "Going a little too fast. Your IP has been blocked for a minute" })
    //     res.status(429).render(path.join(appRoot.path, "views/error/429.ejs"), { error: "Going a little too fast. Your IP has been blocked for 5 mins" });
    //     return;
    // }
});
// Route definitions
app.use('/cache', slD, rtL, BrowserMiddleware.restrictedBrowser(), require('./app/cache'))
app.use("/console", slD, rtL, require('./routes/console'));
app.use("/api/v1", slD, rtL, BrowserMiddleware.restrictedBrowser(), require("./routes/api.v1"));
app.post('/reset-limit', function (req, res) {
    slD.resetKey(req.ip)
    rtL.resetKey(req.ip)
    res.redirect(req.header('Referer') || '/');
});
require("./routes/web")(app);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
module.exports = app;