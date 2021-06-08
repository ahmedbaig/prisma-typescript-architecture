"use strict";
import _ from "lodash";
import passport from "passport";
// import axios from 'axios';
// import { Strategy } from 'passport-facebook';
// import { OAuth2Strategy } from 'passport-google-oauth';
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// import config from "config";
// import { UserService } from "../services/user.service";

// passport.use(new OAuth2Strategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: config.get("g-callback")
// },
//     function (accessToken, refreshToken, profile, done) {
//         const myUserService = new UserService();
//         myUserService.findOne({ email: profile._json.email })
//             .then(user => {
//                 let data;
//                 if (!user) {
//                     // CREATE NEW USER 
//                     data = {
//                         existing: false,
//                         user: {
//                             email: profile._json.email,
//                             profile: {
//                                 name: profile._json.name,
//                                 profileImage: profile._json.picture,
//                                 phoneNo: null
//                             }
//                         },
//                         next: `${config.get("origin")}/social/register`
//                     }
//                 } else {
//                     data = {
//                         existing: true,
//                         user,
//                         next: `${config.get("origin")}/api/users/verify`
//                     }
//                 }
//                 return done(null, data);
//             })
//     }));


// const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
// const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

// passport.use(new Strategy({
//     clientID: FACEBOOK_CLIENT_ID,
//     clientSecret: FACEBOOK_CLIENT_SECRET,
//     callbackURL: config.get("fb-callback")
// },
//     function (accessToken, refreshToken, profile, done) {
//         console.log(accessToken, refreshToken)
//         let requestData;
//         axios.get(`https://graph.facebook.com/v10.0/me?fields=id%2Cname%2Cemail%2Cpicture.type(large)&access_token=${accessToken}`)
//             .then(function (profile: any) {
//                 profile = profile.data
//                 const myUserService = new UserService();
//                 myUserService.findOne({ email: profile.email })
//                     .then(user => {
//                         let data;
//                         if (!user) {
//                             // CREATE NEW USER 
//                             data = {
//                                 existing: false,
//                                 user: {
//                                     email: profile.email,
//                                     profile: {
//                                         name: profile.name,
//                                         profileImage: profile.picture.data.url,
//                                         phoneNo: null
//                                     }
//                                 },
//                                 next: `${config.get("origin")}/social/register`
//                             }
//                         } else {
//                             data = {
//                                 existing: true,
//                                 user,
//                                 next: `${config.get("origin")}/api/users/verify`
//                             }
//                         }
//                         return done(null, data);
//                     })
//             })
//     }
// ));

export default passport