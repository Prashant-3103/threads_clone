"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
// import { createThread } from "@/lib/actions/thread.actions";

interface Props{
  threadId: string,
  currentUserId: string,
  currentUserImg: string
}
const Comment = ({threadId, currentUserId, currentUserImg}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // await createThread({
    //   text: values.thread,
    //   author: userId,
    //   communityId: organization ? organization.id : null,
    //   path: pathname,
    // });

    router.push("/");
  };

  return (
    <Form {...form}>
    <form
      className='comment-form'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name='thread'
        render={({ field }) => (
          <FormItem className='flex w-full items-center gap-3'>
            <FormLabel >
              <Image src={currentUserImg} width={48} height={48} alt="profile image" className="rounded-full object-contain"/>
            </FormLabel>
            <FormControl className='border-none bg-transparent'>
              <Input type="text" placeholder="comment.." className="no-focus text-light-1 outline-none" {...field} />
            </FormControl>

          </FormItem>
        )}
      />

      <Button type='submit' className='comment-form_btn'>
        Reply
      </Button>
    </form>
  </Form>
  )
}

export default Comment

