'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const move = (e: MouseEvent) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    };

    const addHover = () => dot.classList.add('hovered');
    const removeHover = () => dot.classList.remove('hovered');

    document.addEventListener('mousemove', move);

    const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"], .dp-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    // Re-run for dynamically added elements via MutationObserver
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, input, textarea, [role="button"], .dp-card');
      els.forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
