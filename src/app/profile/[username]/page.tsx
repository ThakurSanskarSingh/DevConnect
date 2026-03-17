import { prisma } from "@/lib/prisma";

export default async function UserProfile({
    params,
}: {
    params: { username: string };
}) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: {posts: true},
    });
    if(!user) return <p>User not found</p>;

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
            <p className="text-gray-600">{user.bio}</p>

            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">Posts</h2>
                <ul>
                    {user.posts.map(post => (
                        <li key={post.id} className="border-b py-2">
                            <p className="text-gray-600">{post.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
