'use client';

import { useEffect, useRef } from 'react';

interface ConfettiOverlayProps {
    onClose: () => void;
}

const COLORS = ['#C6F135', '#FF5C28', '#4DAAFF', '#ffffff', '#A8D120'];

export function ConfettiOverlay({ onClose }: ConfettiOverlayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (overlayRef.current) {
                overlayRef.current.style.opacity = '0';
                overlayRef.current.style.transition = 'opacity 0.5s ease';
                setTimeout(onClose, 500);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const confetti = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        left: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        rotate: Math.random() * 360,
    }));

    return (
        <div
            ref={overlayRef}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(10,10,10,0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Confetti pieces */}
            {confetti.map((c) => (
                <div
                    key={c.id}
                    style={{
                        position: 'absolute',
                        left: `${c.left}%`,
                        top: '-20px',
                        width: c.size,
                        height: c.size,
                        background: c.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animation: `fall ${c.duration}s ${c.delay}s ease-in forwards`,
                    }}
                />
            ))}

            {/* Text */}
            <div
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(48px, 8vw, 80px)',
                    color: '#C6F135',
                    textAlign: 'center',
                    animation: 'slideUp 0.5s ease forwards',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    zIndex: 1,
                }}
            >
                🚀 POST PUBLISHED!
            </div>
            <div
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#888888',
                    marginTop: '16px',
                    fontSize: '14px',
                    zIndex: 1,
                }}
            >
                Click anywhere to dismiss
            </div>
        </div>
    );
}
