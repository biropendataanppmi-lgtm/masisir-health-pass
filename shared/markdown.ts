// A deliberately small Markdown subset for health content.
//
// Content is parsed into a plain data tree and rendered by React components,
// so raw HTML in the source is never interpreted (it is shown as text). Links
// are limited to http(s), mailto and tel, and site-relative paths.

export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "heading"; level: 2 | 3; children: Inline[] }
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; children: Inline[] };

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;

export function isSafeUrl(url: string): boolean {
  return SAFE_URL.test(url.trim());
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = "";
  const flush = () => {
    if (buf) out.push({ type: "text", text: buf });
    buf = "";
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m: RegExpMatchArray | null;
    if ((m = rest.match(/^\*\*(.+?)\*\*/))) {
      flush();
      out.push({ type: "strong", children: parseInline(m[1]) });
      i += m[0].length;
    } else if ((m = rest.match(/^_(.+?)_/))) {
      flush();
      out.push({ type: "em", children: parseInline(m[1]) });
      i += m[0].length;
    } else if ((m = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/))) {
      flush();
      if (isSafeUrl(m[2])) out.push({ type: "link", href: m[2], children: parseInline(m[1]) });
      else out.push({ type: "text", text: m[1] });
      i += m[0].length;
    } else {
      buf += src[i];
      i += 1;
    }
  }
  flush();
  return out;
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "paragraph", children: parseInline(para.join(" ")) });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: list.items.map(parseInline) });
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    let m: RegExpMatchArray | null;
    if (!line) {
      flushPara();
      flushList();
    } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flushPara();
      flushList();
      blocks.push({ type: "heading", level: m[1].length as 2 | 3, children: parseInline(m[2]) });
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      blocks.push({ type: "quote", children: parseInline(m[1]) });
    } else if ((m = line.match(/^([-*]|\d+\.)\s+(.*)$/))) {
      flushPara();
      const ordered = /\d/.test(m[1]);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push(m[2]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}
