import { describe, expect, it } from "vitest";
import { isSafeUrl, parseInline, parseMarkdown } from "../shared/markdown";

describe("parseMarkdown", () => {
  it("parses headings, paragraphs and lists", () => {
    const blocks = parseMarkdown("## Judul\n\nSatu\ndua\n\n- a\n- b\n\n1. x\n2. y");
    expect(blocks.map((b) => b.type)).toEqual(["heading", "paragraph", "list", "list"]);
    expect(blocks[1]).toEqual({ type: "paragraph", children: [{ type: "text", text: "Satu dua" }] });
    expect(blocks[3]).toMatchObject({ type: "list", ordered: true });
  });

  it("keeps raw HTML as plain text", () => {
    const blocks = parseMarkdown("<script>alert(1)</script>");
    expect(blocks).toEqual([{ type: "paragraph", children: [{ type: "text", text: "<script>alert(1)</script>" }] }]);
  });

  it("drops unsafe link targets but keeps the text", () => {
    expect(parseInline("[klik](javascript:alert(1))")).toEqual([{ type: "text", text: "klik" }, { type: "text", text: ")" }]);
    expect(parseInline("[WHO](https://www.who.int)")).toEqual([
      { type: "link", href: "https://www.who.int", children: [{ type: "text", text: "WHO" }] },
    ]);
  });

  it("parses bold text", () => {
    expect(parseInline("a **b** c")).toEqual([
      { type: "text", text: "a " },
      { type: "strong", children: [{ type: "text", text: "b" }] },
      { type: "text", text: " c" },
    ]);
  });
});

describe("isSafeUrl", () => {
  it.each([
    ["https://x.org", true],
    ["http://x.org", true],
    ["mailto:a@b.c", true],
    ["tel:+201", true],
    ["/edukasi", true],
    ["//evil.com", false],
    ["javascript:alert(1)", false],
    ["data:text/html,hi", false],
  ])("%s -> %s", (url, ok) => expect(isSafeUrl(url)).toBe(ok));
});
