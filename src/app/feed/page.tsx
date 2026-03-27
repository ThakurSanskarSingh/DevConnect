import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { FeedComposer } from '@/components/FeedComposer';
import { decodePostContent, stripMarkdown } from '@/lib/post-utils';

export default async function FeedPage() {
    const session = await getServerSession(authOptions);

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            likes: true,
            comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        },
        take: 20,
    });

    const decoded = posts.map((post) => {
        const meta = decodePostContent(post.content);
        return { ...post, ...meta };
    });

    // Stats
    const userPostCount = session ? decoded.filter(p => p.author.id === (session.user as { id: string }).id).length : 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '64px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '32px', paddingTop: '32px' }}>

                {/* ── Left Sidebar ── */}
                <aside style={{ position: 'sticky', top: '96px', height: 'fit-content' }}>
                    {/* Profile card (Auth only) */}
                    {session ? (
                        <div className="dp-card" style={{ padding: '20px', marginBottom: '16px' }}>
                            <div className="avatar-ring" style={{ width: 64, height: 64, margin: '0 auto 12px' }}>
                                <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '24px', color: '#C6F135' }}>
                                    {session.user?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                            </div>
                            <p className="font-syne" style={{ fontWeight: 700, fontSize: '15px', color: '#F0F0F0', textAlign: 'center', marginBottom: '4px' }}>
                                {session.user?.name}
                            </p>
                            <p className="font-mono" style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginBottom: '12px' }}>
                                @{(session.user as { username?: string }).username || 'dev'}
                            </p>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="font-syne" style={{ fontWeight: 700, fontSize: '18px', color: '#C6F135' }}>{userPostCount}</div>
                                    <div className="font-dm" style={{ fontSize: '11px', color: '#888' }}>Posts</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="font-syne" style={{ fontWeight: 700, fontSize: '18px', color: '#C6F135' }}>
                                        {posts.reduce((acc, p) => acc + p.likes.length, 0)}
                                    </div>
                                    <div className="font-dm" style={{ fontSize: '11px', color: '#888' }}>Likes</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dp-card" style={{ padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                            <h3 className="font-bebas" style={{ fontSize: '24px', color: '#C6F135', marginBottom: '12px' }}>NEW HERE?</h3>
                            <p className="font-dm" style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, marginBottom: '20px' }}>
                                Join devConnect to start posting, reacting, and connecting with other devs.
                            </p>
                            <Link href="/api/auth/signin" className="btn-primary" style={{ display: 'block', textDecoration: 'none', padding: '12px' }}>
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Nav links */}
                    <div className="dp-card" style={{ padding: '8px' }}>
                        {[
                            { icon: '🏠', label: 'Home', href: '/feed' },
                            ...(session ? [
                                { icon: '📝', label: 'Create Post', href: '/create' },
                                { icon: '👤', label: 'My Profile', href: '/profile' }
                            ] : [])
                        ].map(({ icon, label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-gray-400 font-dm hover:bg-[var(--bg-elevated)] hover:text-[#C6F135] transition"
                            >
                                <span className="text-base">{icon}</span>
                                {label}
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* ── Center Feed ── */}
                <main style={{ minWidth: 0 }}>
                    {/* Composer (Auth only) */}
                    {session ? (
                        <FeedComposer userName={session.user?.name || 'dev'} />
                    ) : (
                        <div className="dp-card" style={{ padding: '24px', borderLeft: '3px solid #C6F135' }}>
                            <h2 className="font-syne" style={{ fontWeight: 700, fontSize: '18px', color: '#F0F0F0', marginBottom: '8px' }}>
                                Join the conversation
                            </h2>
                            <p className="font-dm" style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
                                Sign in to post your thoughts, react to others, and connect with the community.
                            </p>
                            <Link href="/api/auth/signin" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Sign In to Post
                            </Link>
                        </div>
                    )}

                    {/* Post cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        {decoded.length === 0 ? (
                            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
                                <p className="font-syne" style={{ fontSize: '24px', fontWeight: 700, color: '#444', marginBottom: '8px' }}>Nothing here yet.</p>
                                <p className="font-dm" style={{ color: '#666' }}>Go write something. 👇</p>
                                <Link href="/create" className="btn-primary" style={{ display: 'inline-block', marginTop: '24px', textDecoration: 'none' }}>
                                    Write your first post
                                </Link>
                            </div>
                        ) : (
                            decoded.map((post, i) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    excerpt={stripMarkdown(post.content).slice(0, 200)}
                                    tags={post.tags}
                                    author={{ name: post.author.name, username: post.author.username }}
                                    createdAt={post.createdAt}
                                    commentCount={post.comments.length}
                                    likeCount={post.likes.length}
                                    featured={i === 0}
                                />
                            ))
                        )}
                    </div>
                </main>

                {/* ── Right Sidebar ── */}
                <aside style={{ position: 'sticky', top: '96px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Trending tags */}
                    <div className="dp-card" style={{ padding: '20px' }}>
                        <h3 className="font-bebas" style={{ fontSize: '18px', color: '#F0F0F0', marginBottom: '4px', borderBottom: '2px solid #C6F135', paddingBottom: '8px', display: 'inline-block' }}>
                            TRENDING TAGS
                        </h3>
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {TRENDING.map(({ tag, count }) => (
                                <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="dp-tag">{tag}</span>
                                    <span className="font-dm" style={{ fontSize: '12px', color: '#666' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hot today */}
                    <div className="dp-card" style={{ padding: '20px' }}>
                        <h3 className="font-bebas" style={{ fontSize: '18px', color: '#F0F0F0', marginBottom: '12px' }}>
                            🔥 HOT TODAY
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {decoded.slice(0, 3).map(p => (
                                <Link
                                    key={p.id}
                                    href={`/post/${p.id}`}
                                    style={{
                                        fontFamily: "'DM Sans'",
                                        fontSize: '13px',
                                        color: '#C6F135',
                                        textDecoration: 'none',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical' as const,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {p.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Write CTA */}
                    <Link
                        href="/create"
                        className="btn-primary animate-glow-pulse"
                        style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}
                    >
                        + New Post
                    </Link>
                </aside>
            </div>
        </div>
    );
}

const TRENDING = [
    { tag: '#typescript', count: '2.1k posts' },
    { tag: '#rust', count: '1.8k posts' },
    { tag: '#react', count: '3.4k posts' },
    { tag: '#systemdesign', count: '892 posts' },
    { tag: '#opensource', count: '2.2k posts' },
];
