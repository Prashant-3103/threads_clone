"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.modal"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.modal"
import { FilterQuery, SortOrder } from "mongoose"
import page from "@/app/(root)/activity/page"
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


export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy= "desc"
}:{
    userId: string,
    searchString?: string,
    sortBy?: SortOrder
    pageSize?: number,
    pageNumber?: number
}){
    try {
connectToDB();
const skipAmount =(pageNumber-1)*pageSize;
const regex= new RegExp(searchString,"i")
const query: FilterQuery<typeof User> = {
    id: {$ne: userId}
}
if(searchString.trim()!==""){
    query.$or=[
        {
            username: {$regex: regex}
        },
        {
            name: {$regex: regex}
        }
    ]
}

const sortOptions = {cretedAt: sortBy}
const usersQuery = User.find(query)
.sort(sortOptions)
.skip(skipAmount)
.limit(pageSize)

const totalUsersCount = await User.countDocuments(query)
const users = await usersQuery.exec()
const isNext = totalUsersCount>skipAmount+users.length
return {users, isNext}

    } catch (error: any) {
throw new Error(`failed to fetch users ${error.message}`)
    }
}


export async function getActivity(userId: string){
try {
    connectToDB()
    //find all thread created by user
    const userThread = await Thread.find({author: userId})
    //collect all he child threads (replies) from the child feild
    const childThreadIds = userThread.reduce((acc,userThread)=>{
        return acc.concat(userThread.children)
    },[])
const replies = await Thread.find({
    _id: {$in: childThreadIds},
    author: {$ne: userId}
}).populate({
    path: 'author',
    model: User,
    select: 'name image _id'
})

return replies
} catch (error: any) {
    throw new Error(`failed to fetch activity ${error.message}`)
}
}
