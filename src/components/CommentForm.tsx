"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/app/actions/createComment";

export function CommentForm({ postId , addComment}: { postId: string, addComment: (comment: string) => void }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
    if(content.trim() === "") return;

    addComment(content); // Optimistically add the comment to the UI
     startTransition(async () => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("postId", postId);

    await createComment(formData);
     });
    setContent("");

    
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="border px-2 py-1 rounded w-full"
      />

      <button
        disabled={isPending}
        className="bg-black text-white px-3 rounded"
      >
        {isPending ? "..." : "Post"}
      </button>
    </form>
  );
}
