'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.comment.create({
        data: {
            content,
            postId,
            userId: session.user.id,
        }
    });
    revalidatePath("/");
}
