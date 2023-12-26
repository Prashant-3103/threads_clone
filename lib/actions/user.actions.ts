"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.modal"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.modal"
interface Params{
    userId: string,
    username: string,
    name: string,
    bio: string,
    path: string,
    image: string
}
export async function updateUser(
    {userId,
    username,
    name,
    bio,
    image,
    path}: Params
    ): Promise<void>{
connectToDB()
try {
    await User.findOneAndUpdate(
        { id: userId},
        {username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true
        },
        {upsert: true}
        )
        if(path==='/profile/edit'){
            revalidatePath(path)
        }

} catch (error: any) {
throw new Error(`failed to create update user: ${error.message}`)
}
}


export async function fetchUser(userId: string){
    try {
        connectToDB()
        return await User.findOne({id: userId})
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    } catch (error: any) {
throw new Error(`Failed to fetch new error: ${error.message}`)
    }
}


export async function fetchUserPosts(userId: string){
   try {
    connectToDB()
    //find all threads by user with userid
    const threads = await User.findOne({id: userId})
    .populate({
        path: 'threads',
        model: Thread,
        populate: {
            path: 'author',
            select: "name image id"
        }
    })
    return threads
   } catch (error: any) {
throw new Error(`failed to fetch user posts ${error.message}`)
   }
}
