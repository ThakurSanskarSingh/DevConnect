import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { decodePostContent, stripMarkdown } from '@/lib/post-utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { PostCard } from '@/components/PostCard';

function timeAgo(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: { likes: true, comments: true },
      },
    },
  });

  if (!user) notFound();

  const decodedPosts = user.posts.map(p => ({ ...p, ...decodePostContent(p.content) }));
  const totalLikes = user.posts.reduce((acc, p) => acc + p.likes.length, 0);
  const isOwn = (session?.user as { id?: string })?.id === user.id;

  const seed = user.username?.charCodeAt(0) ?? 65;
  const hue = (seed * 47) % 360;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '64px' }}>

      {/* ── Banner ── */}
      <div
        className="h-[180px] sm:h-[260px] p-6 sm:p-8 lg:p-12 flex items-end"
        style={{
          width: '100%',
          background: `
            radial-gradient(ellipse at 30% 60%, hsla(${hue}, 80%, 50%, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, rgba(198,241,53,0.08) 0%, transparent 50%),
            #111111
          `,
          position: 'relative',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >

        {/* Tech-pattern grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, #1A1A1A 0, #1A1A1A 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px',
          opacity: 0.5,
        }} />

        <h1
          className="font-bebas"
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            color: '#F0F0F0',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            letterSpacing: '0.04em',
            position: 'relative',
            zIndex: 1,
            lineHeight: 1,
          }}
        >
          @{user.username}
        </h1>

       
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pb-20">


        {/* ── Profile Card ── */}
        <div
          className="dp-card flex flex-col sm:flex-row items-start gap-6 p-6 -mt-10 relative z-10"
        >

          {/* Avatar */}
          <div className="avatar-ring" style={{ width: 96, height: 96, flexShrink: 0 }}>
            <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: '36px', color: '#C6F135' }}>
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="font-syne" style={{ fontWeight: 700, fontSize: '22px', color: '#F0F0F0', marginBottom: '2px' }}>
              {user.name}
            </h2>
            <p className="font-mono" style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              @{user.username}
            </p>
            {user.bio && (
              <p className="font-dm" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '480px', marginBottom: '8px' }}>
                {user.bio}
              </p>
            )}
            <p className="font-dm" style={{ fontSize: '12px', color: '#666' }}>
              Joined {timeAgo(user.createdAt)}
            </p>
          </div>

          {/* Stats column */}
          <div className="flex flex-wrap gap-6 sm:gap-8 items-center w-full sm:w-auto mt-4 sm:mt-0">
            <StatBox label="Posts" value={user.posts.length} />
            <StatBox label="Reactions" value={totalLikes} />

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isOwn && (
                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>Follow</button>
              )}

            </div>
          </div>
        </div>

        {/* ── Tabs + Content ── */}
        <div style={{ marginTop: '32px' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
            {['POSTS'].map((tab) => (
              <div
                key={tab}
                style={{
                  padding: '12px 24px',
                  fontFamily: "'Bebas Neue'",
                  fontSize: '16px',
                  color: tab === 'POSTS' ? '#C6F135' : '#888',
                  borderBottom: tab === 'POSTS' ? '2px solid #C6F135' : '2px solid transparent',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  marginBottom: '-1px',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Posts Grid */}
          {decodedPosts.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '64px' }}>
              <p className="font-syne" style={{ fontSize: '22px', fontWeight: 700, color: '#444', marginBottom: '8px' }}>
                Nothing here yet.
              </p>
              <p className="font-dm" style={{ color: '#666' }}>Go write something.</p>
              {isOwn && (
                <Link href="/create" className="btn-primary" style={{ display: 'inline-block', marginTop: '24px', textDecoration: 'none' }}>
                  Write your first post
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {decodedPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={stripMarkdown(post.content).slice(0, 180)}
                  tags={post.tags}
                  author={{ id: user.id, name: user.name, username: user.username }}
                  createdAt={post.createdAt}
                  commentCount={post.comments.length}
                  likeCount={post.likes.length}
                  featured={i === 0}
                />

              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="font-syne" style={{ fontWeight: 700, fontSize: '28px', color: '#C6F135' }}>
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
      <div className="font-dm" style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}
