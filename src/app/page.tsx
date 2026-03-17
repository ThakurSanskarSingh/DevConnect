import { prisma } from "@/lib/prisma";
import { CreatePostForm } from "@/components/CreatePostForm";
import { DeletePostButton } from "@/components/DeletePostButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { LikeButton } from "@/components/LikeButton";
import { CommentForm } from "@/components/CommentForm";
import { CommentsSection } from "@/components/CommentWrapper";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "asc" },
      },
     },
  });

  const session = await getServerSession(authOptions);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        DevConnect Feed
      </h1>

      <CreatePostForm />

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-xl p-4 shadow-sm"
          >
            <p className="font-semibold">
              {post.author.name}
            </p>

            <p className="text-gray-600 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>

            <p className="mt-2">{post.content}</p>
           

            {post.authorId === session?.user?.id && (
              <DeletePostButton postId={post.id} />
            )}
            <LikeButton
               postId={post.id}
              likedCount={post.likes.length}
              isLiked={
               post.likes.some(
                (like) => like.userId === session?.user?.id
            )
         }
        />
        <CommentsSection
  postId={post.id}
  initialComments={post.comments}
/>
      </div>
    ))}
  </div>
</main>
);
}
