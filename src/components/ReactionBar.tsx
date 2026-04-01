'use client';

import { useRef, useCallback, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toggleLike } from '@/app/actions/toggleLike';

interface ReactionBarProps {
    postId: string;
    initialCounts?: Record<string, number>;
    userReaction?: string | null;
}

const REACTIONS = [
    { emoji: '🔥', key: 'fire' },
    { emoji: '❤️', key: 'heart' },
    { emoji: '🤯', key: 'mind' },
    { emoji: '👏', key: 'clap' },
    { emoji: '💡', key: 'idea' },
];

function spawnParticles(el: HTMLElement, emoji: string) {
    const rect = el.getBoundingClientRect();
    const colors = ['#C6F135', '#FF5C28', '#4DAAFF', '#ffffff'];

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (i / 8) * 2 * Math.PI;
        const dist = 30 + Math.random() * 20;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.background = colors[i % colors.length];
        particle.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
        particle.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
        particle.style.position = 'fixed';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
    }

    // Float-up emoji
    const floatEl = document.createElement('span');
    floatEl.textContent = emoji;
    floatEl.className = 'float-emoji';
    const fx = (Math.random() - 0.5) * 30;
    floatEl.style.setProperty('--fx', `${fx}px`);
    floatEl.style.left = `${rect.left + window.scrollX}px`;
    floatEl.style.top = `${rect.top + window.scrollY}px`;
    floatEl.style.position = 'fixed';
    document.body.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1000);
}

export function ReactionBar({ postId, initialCounts = {}, userReaction = null }: ReactionBarProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const [counts, setCounts] = useState<Record<string, number>>({
        fire: initialCounts.fire ?? 0,
        heart: initialCounts.heart ?? 0,
        mind: initialCounts.mind ?? 0,
        clap: initialCounts.clap ?? 0,
        idea: initialCounts.idea ?? 0,
    });
    const [active, setActive] = useState<string | null>(userReaction);
    const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const handleReact = useCallback((key: string, emoji: string) => {
        if (!session) {
            router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
            return;
        }

        const btn = btnRefs.current[key];
        if (btn) {
            btn.classList.remove('reaction-pop');
            void btn.offsetWidth; // reflow
            btn.classList.add('reaction-pop');
            spawnParticles(btn, emoji);
            setTimeout(() => btn.classList.remove('reaction-pop'), 400);
        }

        setCounts((prev) => {
            const next = { ...prev };
            if (active === key) {
                next[key] = Math.max(0, next[key] - 1);
                setActive(null);
            } else {
                if (active) next[active] = Math.max(0, next[active] - 1);
                next[key] = (next[key] ?? 0) + 1;
                setActive(key);
            }
            return next;
        });

        startTransition(async () => {
            const formData = new FormData();
            formData.append('postId', postId);
            await toggleLike(formData);
        });
    }, [active, session, router, postId]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {REACTIONS.map(({ emoji, key }) => {
                const isActive = active === key;
                return (
                    <button
                        key={key}
                        ref={(el) => { btnRefs.current[key] = el; }}
                        onClick={() => handleReact(key, emoji)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            border: `1px solid ${isActive ? '#C6F135' : '#333'}`,
                            background: isActive ? 'rgba(198,241,53,0.15)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? '0 0 10px rgba(198,241,53,0.25)' : 'none',
                            position: 'relative',
                        }}
                    >
                        <span style={{ fontSize: '15px', lineHeight: 1 }}>{emoji}</span>
                        <span
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '12px',
                                color: isActive ? '#C6F135' : '#888888',
                                fontWeight: 600,
                                transition: 'color 0.15s',
                            }}
                        >
                            {counts[key] ?? 0}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
