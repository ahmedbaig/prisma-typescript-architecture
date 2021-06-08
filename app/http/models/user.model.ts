"use strict";
import { PrismaClient } from '@prisma/client'
import { IProfile, IProfileCreate, IProfileEdit } from './profile.user.model';
export interface IUser {
    id?: string;
    email?: string;
    role?: Role;
    blocked?: boolean;
    gcm?: Array<GCM>;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

interface GCM {
    id: string;
    platform: string;
    userId: IUser['id'];
}

export interface IUserEdit {
    email?: string;
    blocked?: boolean;
    profile?: { update: IProfileEdit };
}

export interface IUserProfile extends IUser {
    profile: IProfile;
}

export interface IUserCreateProfile extends IUser {
    profile: { create: IProfileCreate }
}

export class ValidateUser {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    public async validate(data: IUser, { error, next }): Promise<string | IUser> {
        try {
            let user = data;
            let validEmail = await this.email(data.email)
            if (validEmail != "") return error(validEmail)
            return next(user);
        } catch (e) {
            return error(e);
        }
    }

    public async validateGCM(data: IUser, gcm_id: GCM['id'], { error, next }): Promise<string | boolean> {
        try {
            return next(await this.uniqueGCM(data.id, gcm_id))
        } catch (e) {
            return error(e)
        }
    }

    private uniqueGCM(user: IUser['id'], gcm: GCM['id']): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.prisma.gCM.findFirst({ where: { id: gcm } })
                .then(async gcmFound => {
                    if (gcmFound != null) {
                        if (gcmFound.userId == user) {
                            // already assigned to this user
                            return resolve(true)
                        } else if (gcmFound.userId != user || gcmFound.userId == null) {
                            // someone else has access to this token 
                            await this.updateGCM(gcmFound.id, user)
                            return resolve(true) // User owns this GCM now
                        }
                    } else if (gcmFound == null) {
                        return resolve(false);
                    }
                })
                .catch(function (e) {
                    return reject(e.message);
                }).finally(() => {
                    this.prisma.$disconnect();
                })
        })
    }

    private updateGCM(id: GCM['id'], user: IUser['id']): Promise<GCM> {
        console.log("Updating GCM", id, user)
        return new Promise((resolve, reject) => {
            this.prisma.gCM.update({ where: { id }, data: { userId: user } })
                .then(updatedGCM => resolve(updatedGCM))
                .catch(function (e) {
                    return reject(e.message);
                }).finally(() => {
                    this.prisma.$disconnect();
                })
        })
    }

    private email(email): Promise<string> {
        return new Promise((resolve, reject) => {
            this.prisma.user.findUnique({ where: { email } })
                .then(function (user) {
                    if (user) {
                        return resolve("The specified email address is already in use.");
                    }
                    let emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    return resolve(!emailRegex.test(email) ? "Invalid email address" : "");
                })
                .catch(function (e) {
                    return reject(e.message);
                }).finally(() => {
                    this.prisma.$disconnect();
                })
        })
    }
}