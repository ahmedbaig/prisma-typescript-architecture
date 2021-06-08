"use strict";
import * as defaults from "../../../config/default.json";
import { IUser } from "../models/user.model";
import nodemailer from "nodemailer";
import config from "config";
import { UserService } from "../services/user.service";

export class MailSender {
  user: IUser;
  token: String;
  transporter: any;

  constructor();
  constructor(user: IUser);
  constructor(user: IUser, token?: String);
  constructor(user?: IUser, token?: string) {
    this.user = user;
    this.token = token;
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  sendUserVerifyEmail(): Promise<any> {
    var mailOptions = {
      to: this.user.email,
      from: process.env.NODEMAILER_USER,
      subject: "Email Verification",
      text:
        "You are receiving this because you have requested email verification for your account.\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        config.get("origin") +
        "/verification/email/" +
        this.token +
        "\n\n" +
        "If you did not request this, please ignore this email if you did not create an account.\n" +
        "\n\n" +
        "This link will expire in " +
        defaults.ACCESS_TOKEN.EXPIRE_NUM +
        defaults.ACCESS_TOKEN.EXPIRE_VALUE,
    };
    return new Promise((resolve, reject) => {
      try {
        this.transporter.sendMail(mailOptions, async (err, info) => {
          if (err) {
            reject({ msg: err, status: 502, success: false });
            return;
          }
          let user_service_obj = new UserService();
          user_service_obj
            .findOneAndUpdate(
              { _id: this.user.id, email: this.user.email },
              { isEmailVerified: false }
            )
            .then((result) => {
              var data = {
                success: true,
                id: this.user.id,
                msg: "Please check your email for account verification!",
                status: 200,
              };
              resolve(data);
              return;
            })
            .catch((error) => {
              if (error) {
                reject({ success: false, msg: error, status: 409 });
                return;
              }
            });
        });
      } catch (e) {
        reject({ success: false, msg: e.message, status: 500 });
        return;
      }
    });
  }
}
