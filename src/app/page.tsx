import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FeatureCard } from '@/components/FeatureCard';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/feed');

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '64px', overflow: 'hidden' }}>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          gap: '48px',
        }}
      >
        {/* Lime radial glow */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '-10%',
          width: '600px', height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(198,241,53,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Left: Text */}
        <div style={{ flex: '1', minWidth: 0 }}>
          <h1
            className="font-bebas"
            style={{
              fontSize: 'clamp(64px, 8vw, 108px)',
              lineHeight: 0.95,
              color: '#F0F0F0',
              marginBottom: '24px',
            }}
          >
            <span className="hero-word" style={{ animationDelay: '0s', display: 'block' }}>YOUR DEV</span>
            <span className="hero-word" style={{ animationDelay: '0.15s', display: 'block', color: '#C6F135' }}>
              BRAIN,
            </span>
            <span className="hero-word" style={{ animationDelay: '0.3s', display: 'block' }}>OUT LOUD.</span>
          </h1>
          <p
            className="font-dm"
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '480px',
              marginBottom: '40px',
              animation: 'slideUp 0.6s 0.5s ease forwards',
              opacity: 0,
            }}
          >
            Share thoughts, discoveries, rants, and code wins.<br />
            devConnect is where developers come to be real.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              animation: 'slideUp 0.6s 0.65s ease forwards',
              opacity: 0,
            }}
          >
            <Link href="/api/auth/signin" className="btn-primary animate-glow-pulse" style={{ textDecoration: 'none', fontSize: '16px' }}>
              Start Posting Free
            </Link>
            <Link href="/feed" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '16px' }}>
              Browse the Feed
            </Link>
          </div>
        </div>

        {/* Right: Floating mock post card */}
        <div style={{ flex: '0 0 420px', display: 'flex', justifyContent: 'center' }}>
          <HeroCard />
        </div>

        {/* Scroll arrow */}
        <div
          className="animate-bounce-y"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--text-muted)',
            fontSize: '24px',
          }}
        >
          ↓
        </div>
      </section>

      {/* ── Marquee Bar ── */}
      <section
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 0',
          overflow: 'hidden',
        }}
      >
        <div className="marquee-track" style={{ gap: '40px' }}>
          {[...TAGS, ...TAGS].map((tag, i) => (
            <span
              key={i}
              className="font-mono"
              style={{
                fontSize: '13px',
                color: i % 3 === 0 ? '#C6F135' : '#F0F0F0',
                flexShrink: 0,
                padding: '0 20px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={{ padding: '120px 48px', maxWidth: '1280px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '64px' }}>
          <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '8px' }}>
            // PLATFORM
          </p>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: '#F0F0F0' }}>
            WHAT IS devConnect?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '0 48px 120px', maxWidth: '1280px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '64px' }}>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: '#F0F0F0' }}>
            HOW IT WORKS
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', maxWidth: '640px' }}>
          {/* Dashed line */}
          <div style={{
            position: 'absolute',
            left: '28px',
            top: '64px',
            bottom: '64px',
            width: '2px',
            background: 'repeating-linear-gradient(to bottom, #C6F135 0, #C6F135 8px, transparent 8px, transparent 16px)',
          }} />
          {STEPS.map((s, i) => (
            <div key={i} className="reveal" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', paddingBottom: '56px', position: 'relative' }}>
              {/* Step number bubble */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}>
                <span className="font-bebas" style={{ fontSize: '28px', color: '#C6F135', lineHeight: 1 }}>{i + 1}</span>
              </div>
              <div style={{ paddingTop: '8px' }}>
                <h3 className="font-syne" style={{ fontSize: '22px', fontWeight: 700, color: '#F0F0F0', marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p className="font-dm" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mock Feed Preview ── */}
      <section style={{ padding: '0 48px 120px', maxWidth: '1280px', margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '8px' }}>// COMMUNITY</p>
            <h2 className="font-bebas" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#F0F0F0' }}>LATEST FROM THE COMMUNITY</h2>
          </div>
          <Link href="/feed" className="btn-ghost" style={{ textDecoration: 'none' }}>See all posts →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="reveal">
            <MockPostCard large {...MOCK_POSTS[0]} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="reveal reveal-delay-1"><MockPostCard {...MOCK_POSTS[1]} /></div>
            <div className="reveal reveal-delay-2"><MockPostCard {...MOCK_POSTS[2]} /></div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="noise-overlay"
        style={{
          background: '#C6F135',
          padding: '100px 48px',
          textAlign: 'center',
        }}
      >
        <h2 className="font-bebas reveal" style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: '#0A0A0A', marginBottom: '32px', lineHeight: 1 }}>
          READY TO POST YOUR<br />FIRST THOUGHT?
        </h2>
        <Link
          href="/api/auth/signin"
          className="reveal reveal-delay-1"
          style={{
            display: 'inline-block',
            background: '#0A0A0A',
            color: '#C6F135',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            padding: '16px 40px',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
        >
          Join devConnect Free
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid #1A1A1A',
          padding: '48px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <span className="font-syne" style={{ fontWeight: 800, fontSize: '20px', color: '#F0F0F0' }}>
            <span style={{ color: '#C6F135' }}>⌨</span> devConnect
          </span>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Home', 'Feed', 'Create', 'About'].map(l => (
              <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} style={{ fontFamily: "'DM Sans'", fontSize: '14px', color: '#888', textDecoration: 'none' }}>
                {l}
              </Link>
            ))}
          </div>
          <p className="font-dm" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2024 devConnect · Built for devs, by devs.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ── Sub-components ── */

function HeroCard() {
  return (
    <div
      className="animate-float dp-card"
      style={{
        width: '100%',
        maxWidth: '380px',
        padding: '24px',
        borderColor: '#C6F135',
        boxShadow: '0 0 60px rgba(198,241,53,0.12), 0 24px 48px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div className="avatar-ring" style={{ width: 38, height: 38 }}>
          <div className="avatar-inner" style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '14px', color: '#C6F135' }}>C</div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: '13px', color: '#F0F0F0' }}>@codebreaker99</div>
          <div className="font-dm" style={{ fontSize: '11px', color: '#888' }}>2 mins ago</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <span className="dp-tag">#react</span>
        <span className="dp-tag">#darkmode</span>
      </div>
      <p className="font-syne" style={{ fontWeight: 700, fontSize: '16px', color: '#F0F0F0', marginBottom: '12px', lineHeight: 1.4 }}>
        just shipped dark mode at 2am and I&apos;m crying happy tears 🚀
      </p>
      <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#888', fontFamily: "'DM Sans'" }}>
        <span>🔥 142</span>
        <span>❤️ 89</span>
        <span>🤯 34</span>
        <span>💬 23</span>
      </div>
    </div>
  );
}

// function FeatureCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
//   return (
//     <div
//       className="dp-card reveal tilt-card"
//       style={{ padding: '32px', animationDelay: `${delay}s` }}
//       onMouseMove={(e) => {
//         const el = e.currentTarget;
//         const r = el.getBoundingClientRect();
//         const x = (e.clientX - r.left) / r.width - 0.5;
//         const y = (e.clientY - r.top) / r.height - 0.5;
//         el.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
//         el.style.boxShadow = '0 0 32px rgba(198,241,53,0.18)';
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = '';
//         e.currentTarget.style.boxShadow = '';
//       }}
//     >
//       <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
//       <h3 className="font-syne" style={{ fontWeight: 700, fontSize: '20px', color: '#F0F0F0', marginBottom: '10px' }}>{title}</h3>
//       <p className="font-dm" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
//     </div>
//   );
// }

function MockPostCard({ title, author, tags, reactions, large }: {
  title: string; author: string; tags: string[]; reactions: string; large?: boolean;
}) {
  return (
    <div
      className="dp-card"
      style={{
        padding: '24px',
        height: large ? '100%' : 'auto',
        borderLeft: large ? '3px solid #C6F135' : undefined,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {tags.map(t => <span key={t} className="dp-tag">{t}</span>)}
      </div>
      <p className="font-syne" style={{ fontWeight: 700, fontSize: large ? '20px' : '16px', color: '#F0F0F0', marginBottom: '12px', lineHeight: 1.3 }}>
        {title}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: '12px', color: '#888' }}>@{author}</span>
        <span className="font-dm" style={{ fontSize: '12px', color: '#888' }}>{reactions}</span>
      </div>
    </div>
  );
}

/* ── Static data ── */
const TAGS = ['#ReactJS', '#DailyDev', '#OpenSource', '#SideProjects', '#GotTheBug', '#ShippedIt', '#HiringAlert', '#LearnInPublic', '#TypeScript', '#Rust', '#NodeJS', '#SystemDesign'];

const FEATURES = [
  { icon: '🧠', title: 'Post Anything', desc: 'Ship a hot take on Rust. Rant about a horrible PR review. Document your 3am debugging session. It all belongs here.' },
  { icon: '⚡', title: 'React & Connect', desc: 'Like, comment, and vibe with devs who get it. No algorithm deciding what you see. Just real people, real posts.' },
  { icon: '🌐', title: 'Tech First', desc: 'Tag your posts with tech stacks. Find your tribe — React devs, Rustaceans, Python wizards, DevOps warriors.' },
];

const STEPS = [
  { title: 'Create your account', desc: 'Sign up with GitHub in 30 seconds. No forms, no bs.' },
  { title: 'Write your post', desc: 'Markdown supported. Add tags. Choose your mood. Hit publish.' },
  { title: 'Join the conversation', desc: 'Get reactions, comments, and real developer feedback.' },
];

const MOCK_POSTS = [
  { title: 'Why I Switched from Go to Rust and Never Looked Back', author: 'rustlover', tags: ['#rust', '#performance'], reactions: '🔥 312  ❤️ 156  🤯 89' },
  { title: 'The Node.js event loop explained with a pizza analogy', author: '10xdev', tags: ['#javascript', '#nodejs'], reactions: '💡 178  👏 94' },
  { title: 'I spent 6 hours on one CSS button. Worth it.', author: 'csswhisperer', tags: ['#css', '#animation'], reactions: '🔥 245  ❤️ 189' },
];
