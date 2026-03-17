"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/app/actions/createPost";

export function CreatePostForm() {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition(); //useTransition is used to mark the state update as non-urgent, allowing React to prioritize more important updates and keep the UI responsive.

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      await createPost(content);
      setContent("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something..."
        className="w-full border rounded-lg p-3"
      />

      <button
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        {isPending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
