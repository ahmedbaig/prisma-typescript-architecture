"use strict";
import { PrismaClient } from '@prisma/client'
import { IUser } from './user.model';
export interface IProfile {
    phoneNo: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    birthYearVisibility: Boolean;
    approved: Boolean;
    city?: string;
    country?: string;
    about?: string;
    profileImage?: string;
    userId?: IUser["id"];
    locationRange: Number;
    locationVisibility: Boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProfileCreate {
    phoneNo: string;
}

export interface IProfileEdit {
    name?: string;
    about?: string;
    phoneNo?: string;
    birthday?: Date;
    birthYearVisibility?: Boolean;
    locationRange?: Number;
    locationVisibility?: Boolean;
    city?: string;
    country?: string;
}

export class ValidateProfile {
    private prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    public async validate(_profile: IProfileCreate, { error, next }) {
        try {
            let validPhone = await this.phoneNo(_profile.phoneNo)
            if (validPhone != "") return error(validPhone)
            return next(_profile);
        } catch (e) {
            return error(e.message);
        }
    }
    private phoneNo(phoneNo: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.prisma.profile.findUnique({ where: { phoneNo } })
                .then(profile => {
                    if (profile) {
                        return resolve("The specified phone number is already in use.");
                    }
                    return resolve("");
                }).catch(function (e) {
                    return reject(e.message);
                }).finally(() => {
                    this.prisma.$disconnect();
                })
        })
    }
}