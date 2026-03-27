import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                paddingTop: '96px',
                textAlign: 'center',
            }}
        >
            {/* Glow */}
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '500px',
                height: '400px',
                background: 'radial-gradient(ellipse, rgba(255,92,40,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <p className="font-mono" style={{ fontSize: '13px', color: 'var(--accent-orange)', letterSpacing: '0.12em', marginBottom: '16px' }}>
        // ERROR 404
            </p>

            <h1
                className="font-bebas"
                style={{
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    color: '#F0F0F0',
                    lineHeight: 1.05,
                    marginBottom: '24px',
                    maxWidth: '700px',
                }}
            >
                This page crashed harder<br />
                than production on a Friday.
            </h1>

            <p className="font-dm" style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.7 }}>
                The page you&apos;re looking for doesn&apos;t exist, was deleted, or maybe never existed in the first place (like that bug you swore you fixed).
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                    ← Back to Home
                </Link>
                <Link href="/feed" className="btn-ghost" style={{ textDecoration: 'none' }}>
                    Browse the Feed
                </Link>
            </div>
        </div>
    );
}
