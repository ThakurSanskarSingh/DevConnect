'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ReactionBar } from './ReactionBar';

interface PostCardProps {
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
    author: {
        name: string | null;
        username?: string | null;
    };
    createdAt: Date | string;
    commentCount: number;
    likeCount: number;
    featured?: boolean;
}

function timeAgo(date: Date | string) {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function PostCard({ id, title, excerpt, tags, author, createdAt, commentCount, likeCount, featured }: PostCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    }

    function onMouseLeave() {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        }
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="dp-card tilt-card"
            style={{
                padding: '24px',
                position: 'relative',
                borderLeft: featured ? '3px solid #C6F135' : undefined,
                transition: 'border-color 0.25s, transform 0.2s, box-shadow 0.25s',
            }}
        >
            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {/* Avatar */}
                <div className="avatar-ring" style={{ width: 38, height: 38, flexShrink: 0 }}>
                    <div className="avatar-inner" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px', color: '#C6F135' }}>
                        {author.name?.[0]?.toUpperCase() || '?'}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                        href={`/profile/${author.username || author.name?.toLowerCase().replace(/\s+/g, '') || 'dev'}`}
                        style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#F0F0F0',
                            textDecoration: 'none',
                        }}
                    >
                        @{author.username || author.name?.toLowerCase().replace(/\s+/g, '')}
                    </Link>
                    <span style={{ color: '#444', marginLeft: '8px', fontSize: '13px' }}>·</span>
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '6px', fontFamily: "'DM Sans', sans-serif" }}>
                        {timeAgo(createdAt)}
                    </span>
                </div>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="dp-tag">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Title */}
            <Link href={`/post/${id}`} style={{ textDecoration: 'none' }}>
                <h3
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: featured ? '20px' : '17px',
                        color: '#F0F0F0',
                        marginBottom: '8px',
                        lineHeight: 1.3,
                    }}
                >
                    {title}
                </h3>
            </Link>

            {/* Excerpt */}
            <p
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    color: '#888888',
                    lineHeight: 1.65,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                }}
            >
                {excerpt}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <ReactionBar postId={id} initialCounts={{ fire: likeCount }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link
                        href={`/post/${id}`}
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '13px',
                            color: '#888',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        💬 {commentCount}
                    </Link>
                </div>
            </div>
        </div>
    );
}
