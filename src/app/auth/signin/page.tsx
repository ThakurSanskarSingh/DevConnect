'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Glows */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(198,241,53,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(255,92,40,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div
                className="dp-card"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '48px 40px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: '32px',
                        color: '#F0F0F0',
                        marginBottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                    }}
                >
                    <span style={{ color: '#C6F135' }}>⌨</span>
                    DevPulse
                </div>

                <h1 className="font-bebas" style={{ fontSize: '48px', color: '#F0F0F0', lineHeight: 1, marginBottom: '16px' }}>
                    WELCOME BACK, DEV.
                </h1>

                <p className="font-dm" style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '40px' }}>
                    Connect your GitHub to start sharing your thoughts, rants, and discoveries with the community.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => signIn('github', { callbackUrl: '/feed' })}
                        className="btn-primary animate-glow-pulse"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '16px',
                            padding: '16px',
                        }}
                    >
                        {/* Simple GitHub Icon (SVG) */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Continue with GitHub
                    </button>

                    <Link
                        href="/feed"
                        className="btn-ghost"
                        style={{ textDecoration: 'none', padding: '14px', fontSize: '15px' }}
                    >
                        Wait, let me browse first →
                    </Link>
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <p className="font-dm" style={{ fontSize: '13px', color: '#666' }}>
                        By signing in, you agree to share your dev brain with the world. 🚀
                    </p>
                </div>
            </div>

            {/* Footer link */}
            <Link
                href="/"
                style={{
                    position: 'absolute',
                    bottom: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: "'DM Sans'",
                    fontSize: '14px',
                    color: '#555',
                    textDecoration: 'none',
                }}
            >
                ← Back to Landing Page
            </Link>
        </main>
    );
}
