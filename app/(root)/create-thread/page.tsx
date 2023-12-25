import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
    return null; // Ensure you return null if the user is not onboarded
  }

  // Convert userInfo._id to a simple value (e.g., string or number)
  const userId = userInfo._id.toString(); // Assuming _id is an ObjectId and converting it to a string

  return (
    <>
      <h1 className="head-text">Create thread</h1>
      <PostThread userId={userId} />
    </>
  );
}

export default Page;
