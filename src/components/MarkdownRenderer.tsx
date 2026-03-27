'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`post-body ${className}`}>
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
}
