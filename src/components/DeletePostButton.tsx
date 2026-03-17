import { deletePost } from "@/app/actions/deletePost";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        className="text-red-500 text-sm mt-2"
      >
        Delete
      </button>
    </form>
  );
}
