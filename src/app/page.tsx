import { prisma } from "@/lib/prisma";
import { CreatePostForm } from "@/components/CreatePostForm";
import { DeletePostButton } from "@/components/DeletePostButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { LikeButton } from "@/components/LikeButton";
import { CommentsSection } from "@/components/CommentWrapper";
import Link from "next/link";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      likes: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          DevConnect 
        </h1>

        {/* Create Post */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
          <CreatePostForm />
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No posts yet. Be the first to share something!
          </p>
        )}

        {/* Feed */}
        <div className="space-y-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {post.author.name?.[0]}
                </div>

                <div>
                  <Link 
                  href={`/profile/${post.author.username}`}
                  className="font-semibold text-gray-800 hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="mt-3 text-gray-700 leading-relaxed">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <LikeButton
                  postId={post.id}
                  likedCount={post.likes.length} 
                  isLiked={post.likes.some(
                    (like) => like.userId === session?.user?.id
                  )}
                />

                {post.authorId === session?.user?.id && (
                  <DeletePostButton postId={post.id} />
                )}
              </div>

              {/* Comments */}
              <CommentsSection
                postId={post.id}
                initialComments={post.comments}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
