import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProfileRedirect() {
  const session = await getServerSession(authOptions);

  // If not logged in → go home (safe)
  if (!session || !session.user) {
    redirect("/");
  }

  let username = (session.user as { username?: string | null })?.username;

  // REPAIR: If username missing in DB/session, generate and save it
  if (!username) {
    const generated = session.user.name?.toLowerCase().replace(/\s+/g, "") || session.user.id;
    if (generated) {
      await prisma.user.update({
        where: { id: (session.user as { id: string }).id },
        data: { username: generated }
      });
      username = generated;
    }
  }

  console.log("Profile redirecting to:", username);

  if (!username) {
    redirect("/feed");
  }

  // Only redirect if valid
  redirect(`/profile/${username}`);
}
