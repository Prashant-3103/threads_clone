"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.modal"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.modal"

interface Params {
   text: string,
   author: string,
   communityId: string | null,
   path: string
}

export async function createThread({ text, author, communityId, path }: Params
    ) {
      try {
        connectToDB();
        const createdThread = await Thread.create({
          text,
          author,
          community: null, // Assign communityId if provided, or leave it null for personal account
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
          $push: { threads: createdThread._id },
        });



        revalidatePath(path);
      } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
      }
    }


    export async function fetchPosts(pageNumber = 1, pageSize= 20){
      connectToDB();
//calculate number of posts to skip

const skipAmount = (pageNumber-1)*pageSize


      //fetch post having no parents (top level threads)
      const postsQuery = Thread.find({parentId: {$in: [null, undefined]}})
.sort({createdAt: 'desc'})
.skip(skipAmount)
.limit(pageSize)
.populate({path: 'author', model: User})
.populate({path: 'children',
populate: {
  path: 'author',
  model: User,
  select: "_id name parentId image"
}})

const totalPostsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
const posts = await postsQuery.exec()
const isNext = totalPostsCount>skipAmount+posts.length
return {posts,isNext}
    }

    export async function fetchThreadById(id: string) {
      connectToDB()
      try {
//todo populate community

        const thread = await Thread.findById(id)
        .populate({
          path: 'author',
          model: User,
          select: "_id id name image"
        })
        .populate({
          path: 'children',
          populate: [
            {
              path: 'author',
              model: User,
              select: "_id id name parentId image"
            },
            {
              path: 'children',
              model: Thread,
              populate: {
                path: 'author',
                model: User,
                select: "_id id name parentId image"
              }
            }
          ]
        }).exec()
        return thread

      } catch (error: any) {
throw new Error(`error fetchinh thread: ${error.message}`)
      }
    }
