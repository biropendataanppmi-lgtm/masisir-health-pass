import { Fragment, useMemo } from "react";
import { parseMarkdown, type Inline } from "../../../shared/markdown";

// Renders the restricted Markdown subset as React elements. No HTML string is
// ever injected, so content cannot run scripts or add arbitrary markup.

function InlineNodes({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case "text":
            return <Fragment key={i}>{n.text}</Fragment>;
          case "strong":
            return <strong key={i}><InlineNodes nodes={n.children} /></strong>;
          case "em":
            return <em key={i}><InlineNodes nodes={n.children} /></em>;
          case "link": {
            const external = /^https?:/i.test(n.href);
            return (
              <a key={i} href={n.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <InlineNodes nodes={n.children} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks = useMemo(() => parseMarkdown(source), [source]);
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 2 ? <h2 key={i}><InlineNodes nodes={b.children} /></h2> : <h3 key={i}><InlineNodes nodes={b.children} /></h3>;
          case "paragraph":
            return <p key={i}><InlineNodes nodes={b.children} /></p>;
          case "quote":
            return <blockquote key={i}><InlineNodes nodes={b.children} /></blockquote>;
          case "list": {
            const items = b.items.map((it, j) => <li key={j}><InlineNodes nodes={it} /></li>);
            return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
        }
      })}
    </div>
  );
}
