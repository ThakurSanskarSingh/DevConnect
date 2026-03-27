"use client";

export function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className="dp-card reveal tilt-card"
      style={{ padding: '32px', animationDelay: `${delay}s` }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        el.style.boxShadow = '0 0 32px rgba(198,241,53,0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>

      <h3 className="font-syne" style={{ fontWeight: 700, fontSize: '20px', color: '#F0F0F0', marginBottom: '10px' }}>
        {title}
      </h3>

      <p className="font-dm" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {desc}
      </p>
    </div>
  );
}
