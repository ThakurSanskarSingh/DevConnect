'use client';

import { useState, useTransition } from 'react';
import { createPostFull } from '@/app/actions/createPostFull';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import toast from 'react-hot-toast';

const MOODS = ['casual', 'technical', 'rant', 'announcement'] as const;
type Mood = typeof MOODS[number];

const MOOD_COLORS: Record<Mood, { bg: string; color: string }> = {
    casual: { bg: 'var(--bg-elevated)', color: '#F0F0F0' },
    technical: { bg: 'rgba(77,170,255,0.2)', color: '#4DAAFF' },
    rant: { bg: 'rgba(255,92,40,0.25)', color: '#FF5C28' },
    announcement: { bg: 'rgba(198,241,53,0.18)', color: '#C6F135' },
};

const TOOLBAR = [
    { label: 'B', insert: '**bold**', title: 'Bold' },
    { label: 'I', insert: '*italic*', title: 'Italic' },
    { label: '<>', insert: '`code`', title: 'Inline code' },
    { label: '🔗', insert: '[text](url)', title: 'Link' },
    { label: '```', insert: '\n```\ncode here\n```\n', title: 'Code block' },
    { label: '>', insert: '\n> blockquote\n', title: 'Blockquote' },
];

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [mood, setMood] = useState<Mood>('casual');
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPending, startTransition] = useTransition();

    function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagsInput.trim().replace(/^#/, '');
            if (val && !tags.includes(`#${val}`)) {
                setTags(prev => [...prev, `#${val}`]);
            }
            setTagsInput('');
        }
    }

    function handleInsert(snippet: string) {
        setContent(prev => prev + snippet);
        setTab('write');
    }

    function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required!');
            return;
        }
        const fd = new FormData();
        fd.append('title', title);
        fd.append('content', content);
        fd.append('tags', tags.join(','));
        fd.append('mood', mood);
        startTransition(async () => {
            await createPostFull(fd);
            setShowConfetti(true);
        });
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '64px', display: 'flex', flexDirection: 'column' }}>
            {showConfetti && (
                <ConfettiOverlay onClose={() => { setShowConfetti(false); window.location.href = '/feed'; }} />
            )}

            {/* Editor split */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_3fr]" style={{ minHeight: 'calc(100vh - 64px)' }}>


                {/* ── Left Panel ── */}
                <aside
                    className="p-6 sm:p-8"
                    style={{
                        borderRight: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        overflowY: 'auto',
                    }}
                >

                    {/* Header */}
                    <div>
                        <p className="font-bebas" style={{ fontSize: '13px', color: '#C6F135', letterSpacing: '0.12em', marginBottom: '4px' }}>POST DETAILS</p>
                        <div style={{ height: '1px', background: 'var(--border)' }} />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="font-dm" style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Give your post a killer title..."
                            className="dp-input"
                            style={{ width: '100%', padding: '12px 14px', fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="font-dm" style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' }}>Tags</label>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                padding: '10px',
                                background: 'var(--bg-primary)',
                                border: '1px solid #333',
                                borderRadius: 'var(--radius-sm)',
                                minHeight: '48px',
                            }}
                        >
                            {tags.map(t => (
                                <span key={t} className="dp-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {t}
                                    <button
                                        onClick={() => setTags(prev => prev.filter(x => x !== t))}
                                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0', fontSize: '12px', lineHeight: 1 }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            <input
                                value={tagsInput}
                                onChange={e => setTagsInput(e.target.value)}
                                onKeyDown={addTag}
                                placeholder={tags.length === 0 ? 'Add #react, #python...' : ''}
                                style={{ background: 'none', border: 'none', outline: 'none', color: '#F0F0F0', fontFamily: "'JetBrains Mono'", fontSize: '12px', flex: '1', minWidth: '120px' }}
                            />
                        </div>
                    </div>

                    {/* Mood selector */}
                    <div>
                        <label className="font-bebas" style={{ fontSize: '12px', color: '#888888', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>POST MOOD</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {MOODS.map(m => {
                                const c = MOOD_COLORS[m];
                                const isSelected = mood === m;
                                return (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m)}
                                        style={{
                                            padding: '7px 14px',
                                            borderRadius: '20px',
                                            border: `1px solid ${isSelected ? c.color : '#333'}`,
                                            background: isSelected ? c.bg : 'transparent',
                                            color: isSelected ? c.color : '#888',
                                            fontFamily: "'DM Sans'",
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tips */}
                    <div
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            marginTop: 'auto',
                        }}
                    >
                        <p className="font-bebas" style={{ fontSize: '15px', color: '#C6F135', marginBottom: '10px' }}>TIPS 💡</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {['Use #tags to reach your tribe', 'Code blocks make devs happy', 'Be real. No corporate speak.'].map(t => (
                                <li key={t} className="font-dm" style={{ fontSize: '13px', color: '#888', display: 'flex', gap: '8px' }}>
                                    <span style={{ color: '#C6F135' }}>›</span> {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ── Right Panel (Editor) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
                        {(['write', 'preview'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    padding: '14px 20px',
                                    fontFamily: "'DM Sans'",
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: tab === t ? '#C6F135' : '#888',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `2px solid ${tab === t ? '#C6F135' : 'transparent'}`,
                                    cursor: 'pointer',
                                    transition: 'color 0.15s, border-color 0.15s',
                                    textTransform: 'capitalize',
                                    marginBottom: '-1px',
                                }}
                            >
                                {t === 'write' ? '✏️ Write' : '👁 Preview'}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    {tab === 'write' && (
                        <div style={{ display: 'flex', gap: '4px', padding: '10px 24px', borderBottom: '1px solid var(--border)' }}>
                            {TOOLBAR.map(({ label, insert, title }) => (
                                <button
                                    key={label}
                                    title={title}
                                    onClick={() => handleInsert(insert)}
                                    style={{
                                        padding: '6px 10px',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '4px',
                                        color: '#F0F0F0',
                                        fontFamily: "'JetBrains Mono'",
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C6F135'; e.currentTarget.style.color = '#C6F135'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#F0F0F0'; }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Editor / Preview */}
                    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        {tab === 'write' ? (
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Start writing your post... Markdown is supported."
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    padding: '24px',
                                    background: 'var(--bg-primary)',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#F0F0F0',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '14px',
                                    lineHeight: 1.8,
                                    resize: 'none',
                                }}
                            />
                        ) : (
                            <div
                                style={{ flex: 1, padding: '24px', overflowY: 'auto' }}
                            >
                                {content ? (
                                    <MarkdownRenderer content={content} />
                                ) : (
                                    <p style={{ color: '#444', fontFamily: "'DM Sans'", fontStyle: 'italic' }}>Nothing to preview yet...</p>
                                )}
                            </div>
                        )}

                        {/* Status bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <span className="font-dm" style={{ fontSize: '12px', color: '#666' }}>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                                <span className="font-mono" style={{ fontSize: '11px', color: '#888', padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>Markdown</span>
                            </div>
                            {content.length > 0 && (
                                <span className="font-dm" style={{ fontSize: '12px', color: '#C6F135' }}>💾 Auto-saved</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Publish Button */}
            <button
                onClick={handleSubmit}
                disabled={isPending}
                className="btn-primary animate-glow-pulse fixed bottom-6 right-6 sm:bottom-8 sm:right-8"
                style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    borderRadius: '40px',
                    zIndex: 100,
                    opacity: isPending ? 0.7 : 1,
                }}
            >

                {isPending ? 'Publishing...' : 'PUBLISH POST'}
            </button>
        </div>
    );
}
