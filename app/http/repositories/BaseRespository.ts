import { PrismaClient } from "@prisma/client"

export default class BaseRepository<T> {
    create(data: T):T{
        return data;
    }
}