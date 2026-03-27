"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { encodePostContent } from "@/lib/post-utils";

export async function createPostFull(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = (formData.get("title") as string) || "Untitled";
  const content = (formData.get("content") as string) || "";
  const tagsRaw = (formData.get("tags") as string) || "";
  const mood = (formData.get("mood") as string) || "casual";

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const encoded = encodePostContent({ title, content, tags, mood });

  await prisma.post.create({
    data: {
      content: encoded,
      authorId: session.user.id,
    },
  });

  revalidatePath("/feed");
  revalidatePath("/");
}
