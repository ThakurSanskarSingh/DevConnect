import { deletePost } from "@/app/actions/deletePost";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        className="font-syne text-[#FF5C28] hover:text-[#ff3d00] transition-colors flex items-center gap-1.5"
        style={{ fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        title="Delete Post"
      >
        <span>🗑️</span>
        <span className="hidden sm:inline">Delete</span>
      </button>
    </form>
  );
}

