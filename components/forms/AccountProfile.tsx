"use client"
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod"
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
interface Props{
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    };
    btnTitle: string
}
const AccountProfile = ({user, btnTitle}: Props ) => {
  const {startUpload} = useUploadThing('media')
  const [files, setFiles] = useState<File[]>([])
    const form = useForm({
        resolver: zodResolver(UserValidation),
    defaultValues: {
        profile_photo: user?.image || "",
        name: user?.name || "",
        username: user?.username || "",
        bio: user?.bio || ""
        }
    })

    const handleImage=(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string)=>void)=>{
      e.preventDefault();
      const fileReader = new FileReader()
      if(e.target.files && e.target.files.length>0){
        const file = e.target.files[0];
        setFiles(Array.from(e.target.files))
        if(!file.type.includes("image")) return

        fileReader.onload= async(event)=>{
          const imageDataUrl = event.target?.result?.toString() || ""
          fieldChange(imageDataUrl)
        }
        fileReader.readAsDataURL(file)
      }
    }

   const onSubmit= async(values: z.infer<typeof UserValidation> )=> {
const blob = values.profile_photo
const hasImageChanged = isBase64Image(blob)
if(hasImageChanged){
  const imgRes = await startUpload(files)
  if(imgRes && imgRes[0].url){
    values.profile_photo = imgRes[0].url
  }
}
      }

  return (
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex w-full gap-4">
              <FormLabel className="account-form_image-input">{field.value? (
                <Image src={field.value} alt="profile_photo" width={96} height={96} priority className="rounded-full object-contain" />
              ):(
                <Image src="/assets/profile.svg" alt="profile_photo" width={24} height={24}  className="object-contain" />
              )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input type="file" placeholder="upload a photo" className="account-form_image-input" onChange={(e)=> handleImage(e, field.onChange)} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-gray-200">
              Name
              </FormLabel>
              <FormControl >
                <Input type="text"  className="account-form_input no-focus" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-gray-200">
             User Name
              </FormLabel>
              <FormControl >
                <Input type="text"  className="account-form_input no-focus" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-gray-200">
              Bio
              </FormLabel>
              <FormControl >
                <Textarea rows={10}  className="account-form_input no-focus" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-primary-500" type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile

