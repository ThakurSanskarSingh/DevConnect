'use client';

import { useState, useTransition } from 'react';
import { createPostFull } from '@/app/actions/createPostFull';
import toast from 'react-hot-toast';

export function FeedComposer({ userName }: { userName: string }) {
    const [expanded, setExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) return;
        const fd = new FormData();
        fd.append('title', content.split('\n')[0].slice(0, 80));
        fd.append('content', content);
        fd.append('tags', '');
        fd.append('mood', 'casual');
        startTransition(async () => {
            await createPostFull(fd);
            setContent('');
            setExpanded(false);
            toast.success('Post published! 🚀');
        });
    }

    return (
        <div className="dp-card" style={{ padding: '20px' }}>
            {!expanded ? (
                <div
                    onClick={() => setExpanded(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'text',
                    }}
                >
                    <div className="avatar-ring" style={{ width: 40, height: 40, flexShrink: 0 }}>
                        <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '16px', color: '#C6F135' }}>
                            {userName[0]?.toUpperCase()}
                        </div>
                    </div>
                    <div
                        className="dp-input"
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            color: '#888',
                            fontFamily: "'DM Sans'",
                            fontSize: '14px',
                            borderRadius: '4px',
                            cursor: 'text',
                        }}
                    >
                        What&apos;s on your mind, {userName.split(' ')[0]}?
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                        className="btn-primary"
                        style={{ padding: '10px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}
                    >
                        Post it 🚀
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea
                        autoFocus
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind? Share a discovery, a rant, a win..."
                        className="dp-input"
                        style={{ width: '100%', padding: '14px', minHeight: '120px', resize: 'vertical', fontSize: '15px', lineHeight: 1.65, fontFamily: "'DM Sans'" }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={() => { setExpanded(false); setContent(''); }} className="btn-ghost" style={{ padding: '9px 18px', fontSize: '13px' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending || !content.trim()} className="btn-primary" style={{ fontSize: '14px' }}>
                            {isPending ? 'Posting...' : 'Post it 🚀'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
