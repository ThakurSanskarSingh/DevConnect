'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(content: string) {
    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/auth/signin");
    }
    await prisma.post.create({
        data: {
            content,
            authorId : session.user.id
        }
    })

    revalidatePath("/");
}

