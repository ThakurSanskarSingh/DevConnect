"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(formData: FormData) {
  const postId = formData.get("postId") as string;

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Not allowed");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/");
}
