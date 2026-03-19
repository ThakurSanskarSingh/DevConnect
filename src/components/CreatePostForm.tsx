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
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        disabled={isPending}
        className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
