'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function createPost(content: string) {
    const session = await getServerSession(authOptions);

    if(!session){
        throw new Error("Unauthorized");
    }
    await prisma.post.create({
        data: {
            content,
            authorId : session.user.id
        }
    })
}

