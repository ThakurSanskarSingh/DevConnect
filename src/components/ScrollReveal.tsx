'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.12 }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        // Also observe newly added elements
        const mutObs = new MutationObserver(() => {
            document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
        });
        mutObs.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutObs.disconnect();
        };
    }, []);

    return null;
}
