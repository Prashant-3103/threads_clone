import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export async function Page() {
    const user = await currentUser()
   



    if(!user) return null
    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')
return(
    <h1 className="head-text">Create thread</h1>
)
}

export default Page
