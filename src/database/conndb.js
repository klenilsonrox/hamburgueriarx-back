import {PrismaClient} from '@prisma/client'
import mongoose from 'mongoose'


export const db = new PrismaClient()


export async function  connectDBMongoose() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongoose online")
    } catch (error) {
        console.log(error)
    }
}


