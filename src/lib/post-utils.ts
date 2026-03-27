export interface PostMeta {
  title: string;
  content: string;
  tags: string[];
  mood: string;
}

export function encodePostContent(meta: PostMeta): string {
  const header = JSON.stringify({
    title: meta.title,
    tags: meta.tags,
    mood: meta.mood,
  });

  return `__devConnect__${header}__devConnect__\n${meta.content}`;
}

export function decodePostContent(raw: string): PostMeta {
  const prefix = "__devConnect__";

  if (raw.startsWith(prefix)) {
    const end = raw.indexOf(prefix, prefix.length);

    if (end !== -1) {
      try {
        const json = raw.slice(prefix.length, end);
        const parsed = JSON.parse(json);
        const content = raw.slice(end + prefix.length + 1);

        return {
          title: parsed.title || "Untitled",
          tags: parsed.tags || [],
          mood: parsed.mood || "casual",
          content,
        };
      } catch { }
    }
  }

  const first = raw.split("\n")[0];

  return {
    title: first.slice(0, 80),
    content: raw,
    tags: [],
    mood: "casual",
  };
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, "") // Headers
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
    .replace(/`{3}[\s\S]*?`{3}/g, "") // Code blocks
    .replace(/`(.+?)`/g, "$1") // Inline code
    .replace(/^>\s+/gm, "") // Blockquotes
    .replace(/\n+/g, " ") // Newlines to spaces
    .trim();
}
