import { prisma } from "@/lib/prisma";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return <div className="p-10">User not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
              {user.name?.[0]}
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-gray-700">{user.bio}</p>
          )}
        </div>

        {/* User Posts */}
        <div className="mt-6 space-y-4">
          {user.posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-700">{post.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
