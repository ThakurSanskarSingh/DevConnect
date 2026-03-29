import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleLike(formData: FormData) {
  const postId = formData.get("postId") as string;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  revalidatePath("/");
}
