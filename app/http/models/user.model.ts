import { PrismaClient } from '@prisma/client';
import { IProfile, IProfileCreate, IProfileEdit } from './profile.user.model';
interface IUser {
    id: string;
    email: string;
    role: Role;
    blocked: boolean;
    gcm: GCM[];
    createdAt: Date;
    updatedAt: Date;
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

export class User implements IUser {
    id: string;
    email: string;
    role: Role;
    blocked: boolean;
    gcm: GCM[];
    createdAt: Date;
    updatedAt: Date;
    prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient()
    }
    create(data: User) {
        return new Promise(async (resolve, reject) => {
            let user = await this.prisma.user
                .create({ data })
                .catch(e => reject(e))
                .finally(() => { this.prisma.$disconnect() })
            resolve(user)
        })
    }
}