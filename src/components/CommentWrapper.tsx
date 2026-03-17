"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { CommentType } from "@/types";


export function CommentsSection({
  initialComments,
  postId,
}: {
  initialComments: CommentType[];
  postId: string;
}) {
  const [comments, setComments] = useState(initialComments);

  function addOptimisticComment(content: string) {
    const newComment: CommentType = {
      id: Math.random().toString(),
      content,
      user: { name: "You" },
    };

    setComments((prev) => [...prev, newComment]);
  }

  return (
    <div className="mt-4 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="text-sm border-t pt-2">
          <span className="font-semibold">
            {comment.user.name}:
          </span>{" "}
          {comment.content}
        </div>
      ))}

      <CommentForm
        postId={postId}
        addComment={addOptimisticComment}
      />
    </div>
  );
}
