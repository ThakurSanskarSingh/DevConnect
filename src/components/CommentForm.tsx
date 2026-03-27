'use client';

import { useState, useTransition } from 'react';
import { createComment } from '@/app/actions/createComment';
import toast from 'react-hot-toast';

export function CommentForm({ postId, addComment }: { postId: string; addComment: (comment: string) => void }) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    addComment(content);
    const saved = content;
    setContent('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('content', saved);
      formData.append('postId', postId);
      await createComment(formData);
      toast.success('Comment posted!');
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What do you think?"
        className="dp-input"
        style={{
          width: '100%',
          padding: '12px 14px',
          minHeight: '80px',
          resize: 'vertical',
          fontSize: '14px',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="btn-primary"
          style={{ padding: '10px 24px', fontSize: '14px', opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
