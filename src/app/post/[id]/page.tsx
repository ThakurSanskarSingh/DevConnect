import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { ReactionBar } from '@/components/ReactionBar';
import { DeletePostButton } from '@/components/DeletePostButton';

import { CommentsSection } from '@/components/CommentWrapper';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { decodePostContent } from '@/lib/post-utils';

interface Props { params: { id: string } }

function timeAgo(date: Date | string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function readTime(text: string) {
    const words = text.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);


    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: true,
            likes: true,
            comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        },
    });

    if (!post) notFound();

    const isAuthor = session?.user && (session.user as { id: string }).id === post.authorId;

    const { title, tags, content } = decodePostContent(post.content);


    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '64px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 80px' }}>

                {/* Back */}
                <Link href="/feed" style={{ fontFamily: "'DM Sans'", fontSize: '14px', color: '#888', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '32px' }}>
                    ← Back to Feed
                </Link>

                {/* Author block */}
                <div className="dp-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div className="avatar-ring" style={{ width: 64, height: 64, flexShrink: 0 }}>
                        <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '24px', color: '#C6F135' }}>
                            {post.author.name?.[0]?.toUpperCase() || '?'}
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <Link href={`/profile/${post.author.username || ''}`} style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '18px', color: '#F0F0F0', textDecoration: 'none' }}>
                            {post.author.name}
                        </Link>
                        {post.author.username && (
                            <p className="font-mono" style={{ fontSize: '12px', color: '#888' }}>@{post.author.username}</p>
                        )}
                        {post.author.bio && (
                            <p className="font-dm" style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{post.author.bio}</p>
                        )}
                    </div>
                    <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: '13px' }}>Follow</button>
                </div>

                {/* Post header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {tags.map(t => <span key={t} className="dp-tag">{t}</span>)}
                        </div>
                        {isAuthor && <DeletePostButton postId={post.id} />}
                    </div>

                    <p className="font-dm" style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                        {timeAgo(post.createdAt)} · {readTime(content)}
                    </p>
                    <h1 className="font-syne" style={{ fontWeight: 700, fontSize: 'clamp(26px, 4vw, 40px)', color: '#F0F0F0', lineHeight: 1.2, marginBottom: '8px' }}>
                        {title}
                    </h1>
                    <div style={{ height: '1px', background: 'var(--border)', marginTop: '24px' }} />
                </div>

                {/* Post body */}
                    <MarkdownRenderer content={content} />

                {/* Reaction zone */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h3 className="font-bebas" style={{ fontSize: '22px', color: '#F0F0F0', borderBottom: '2px solid #C6F135', paddingBottom: '4px' }}>
                            REACTIONS
                        </h3>
                        <span className="font-dm" style={{ fontSize: '13px', color: '#888' }}>Click to react</span>
                    </div>
                    <ReactionBar postId={post.id} initialCounts={{ fire: post.likes.length }} />
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />

                {/* Comments */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                        <h2 className="font-bebas" style={{ fontSize: '28px', color: '#F0F0F0' }}>JOIN THE CONVERSATION</h2>
                        <span className="font-dm" style={{ fontSize: '13px', color: '#888' }}>{post.comments.length} comments</span>
                    </div>
                    <CommentsSection
                        postId={post.id}
                        initialComments={post.comments.map(c => ({ id: c.id, content: c.content, user: { name: c.user.name } }))}
                    />
                </div>
            </div>
        </div>
    );
}
