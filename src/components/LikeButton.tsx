'use client';
import { toggleLike } from "@/app/actions/toggleLike";
import { startTransition, useState, useTransition } from "react";

export function LikeButton({postId, likedCount,isLiked}: {
    postId: string;
    likedCount: number;
    isLiked: boolean;
}) {

    const [liked, setLiked] = useState(isLiked);
    const [count, setCount] = useState(likedCount);
    const [isPending, setIsPending] = useTransition();

    function handleClick() {
        if(liked){
            setCount((prev) => prev - 1);
        }else{
            setCount((prev) => prev + 1);
        }
        setLiked(!liked);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("postId", postId);
            await toggleLike(formData);
        });
    }

    return (
       <button
        onClick={handleClick}
        disabled={isPending}
        className="text-sm mt-2 flex items-center gap-1"
      >
        {liked ? "❤️" : "🤍"} {count}
      </button>
    );
}
