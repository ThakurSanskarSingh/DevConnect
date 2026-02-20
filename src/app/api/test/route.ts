import { prisma } from "@/lib/prisma";

export async function GET() {
    const res  = await prisma.user.findMany();
    return new Response(JSON.stringify(res));
}
