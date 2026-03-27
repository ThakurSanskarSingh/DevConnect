'use client';

import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentType } from '@/types';

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
      user: { name: 'You' },
    };
    setComments((prev) => [...prev, newComment]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Comment list */}
      {comments.map((comment, i) => (
        <div
          key={comment.id}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '16px 0',
            borderBottom: i < comments.length - 1 ? '1px solid var(--border)' : 'none',
            animation: 'slideUp 0.4s ease forwards',
            animationDelay: `${i * 0.06}s`,
            opacity: 0,
          }}
        >
          {/* Avatar */}
          <div className="avatar-ring" style={{ width: 36, height: 36, flexShrink: 0 }}>
            <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '13px', color: '#C6F135' }}>
              {comment.user.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="font-syne" style={{ fontWeight: 700, fontSize: '13px', color: '#F0F0F0' }}>
                {comment.user.name}
              </span>
            </div>
            <p className="font-dm" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {comment.content}
            </p>
            <button
              style={{
                marginTop: '6px',
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: "'DM Sans'",
                padding: 0,
              }}
            >
              Reply
            </button>
          </div>
        </div>
      ))}

      {/* Composer */}
      <div style={{ marginTop: '24px' }}>
        <CommentForm postId={postId} addComment={addOptimisticComment} />
      </div>
    </div>
  );
}
