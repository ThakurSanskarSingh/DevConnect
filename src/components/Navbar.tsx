'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Don't show navbar on landing page
    const isLanding = pathname === '/';

    return (
        <nav
            className="px-4 sm:px-8"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(10,10,10,0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid #1A1A1A',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
            }}
        >

            <div
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                }}
            >
                {/* Logo */}
                <Link
                    href={session ? '/feed' : '/'}
                    className="flex items-center gap-2"
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(18px, 4vw, 22px)',
                        color: '#F0F0F0',
                        textDecoration: 'none',
                        letterSpacing: '-0.01em',
                    }}
                >
                    <span style={{ color: '#C6F135', fontSize: '18px' }}>⌨</span>
                    <span className={isLanding ? 'inline' : 'hidden sm:inline'}>devConnect</span>
                    {!isLanding && <span className="inline sm:hidden">devC</span>}
                </Link>


                {/* Nav links */}
                <div className="hidden md:flex items-center gap-6">
                    {!isLanding && <NavLink href="/feed" current={pathname}>Feed</NavLink>}
                    {session && !isLanding && (
                        <>
                            <NavLink href="/create" current={pathname}>+ New Post</NavLink>
                            <NavLink href="/profile" current={pathname}>
                                Profile
                            </NavLink>
                        </>
                    )}
                </div>


                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {session ? (
                        <>
                            {/* Avatar */}
                            <Link href="/profile"
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #C6F135, #FF5C28)',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                }}
                                title={session.user?.name || 'Profile'}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        background: '#1A1A1A',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: "'Syne', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        color: '#C6F135',
                                    }}
                                >
                                    {session.user?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                            </Link>

                            <Link href="/create" className="btn-primary hidden sm:block" style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>
                                + New Post
                            </Link>

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="btn-ghost"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                                <span className="hidden sm:inline">Sign Out</span>
                                <span className="sm:hidden">Exit</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/feed" className="btn-ghost px-4 py-2 text-xs sm:text-sm" style={{ textDecoration: 'none' }}>
                                Feed
                            </Link>
                            <button onClick={() => signIn('github')} className="btn-primary px-4 py-2 text-xs sm:text-sm">
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
    const isActive = current === href || current.startsWith(href + '/');
    return (
        <Link
            href={href}
            style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                color: isActive ? '#C6F135' : '#888888',
                textDecoration: 'none',
                borderBottom: isActive ? '1px solid #C6F135' : '1px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.15s, border-color 0.15s',
            }}
        >
            {children}
        </Link>
    );
}
