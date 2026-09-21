"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Components } from "react-markdown";
import { PUBLISHED_BLOG_POSTS } from "@/data/blog";

const STATIC_VALID_PATHS = new Set([
  "/",
  "/blog",
  "/my-blog",
  "/title-insurance",
  "/why-choose-us",
  "/virginia-closing-cost-calculator",
  "/maryland-closing-cost-calculator",
  "/dc-closing-cost-calculator",
  "/calculators/seller-net-sheet",
  "/calculators/title-quote",
  "/contact",
  "/subscribe",
  "/title-company-washington-dc",
  "/title-company-fredericksburg-va",
  "/title-company-stafford-va",
  "/title-company-herndon-va",
  "/title-search-vienna-va",
  "/title-company-springfield-va",
  "/title-company-bethesda-md",
]);

const VALID_INTERNAL_PATHS = new Set([
  ...Array.from(STATIC_VALID_PATHS),
  ...PUBLISHED_BLOG_POSTS.map((p) => `/blog/${p.slug}`),
]);

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return textFromChildren(children.props.children);
  }
  return "";
}

/**
 * Pre-process markdown to resolve [LINK:/path] patterns into standard markdown links.
 * Converts `[text][LINK:/path]` to `[text](/path)`.
 */
function resolveLinks(markdown: string): string {
  let output = markdown.replace(/\[([^\]]+)\]\[LINK:(\/[^\]]+)\]/g, "[$1]($2)");

  // Normalize old/internal absolute URLs to current relative paths
  output = output
    .replace(/https?:\/\/dmvtitleguy\.vercel\.app(\/[^\s)\]]*)/g, "$1")
    .replace(/https?:\/\/www\.dmvtitleguy\.com(\/[^\s)\]]*)/g, "$1")
    .replace(/https?:\/\/dmvtitleguy\.com(\/[^\s)\]]*)/g, "$1")
    .replace(/https?:\/\/www\.dmvtitleguy\.io(\/[^\s)\]]*)/g, "$1")
    .replace(/https?:\/\/dmvtitleguy\.io(\/[^\s)\]]*)/g, "$1");

  return output;
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    if (href && href.startsWith("/")) {
      if (!VALID_INTERNAL_PATHS.has(href)) {
        return <span className="text-brand-muted">{children}</span>;
      }
      return (
        <Link href={href} className="text-brand-blue-deep hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...props}>
        {children}
      </a>
    );
  },
  // The article shell supplies the document h1. Legacy Markdown bodies that
  // contain another h1 are demoted to a section heading.
  h1: ({ children }) => {
    const text = textFromChildren(children);
    const id = slugifyHeading(text);
    return <h2 id={id}>{children}</h2>;
  },
  h2: ({ children }) => {
    const text = textFromChildren(children);
    const id = slugifyHeading(text);
    return <h2 id={id}>{children}</h2>;
  },
  h3: ({ children }) => {
    const text = textFromChildren(children);
    const id = slugifyHeading(text);
    return <h3 id={id}>{children}</h3>;
  },
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} loading="lazy" className="rounded-lg" {...props} />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-200 text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-brand-navy text-white px-4 py-2 text-left font-semibold border border-gray-200">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 border border-gray-200">{children}</td>,
  /**
   * Without a `p` override, markdown paragraphs rendered as bare <p> with no
   * measure cap and no spacing — FAQ answers ran to 112 characters per line and
   * multi-paragraph answers had no gap between them, since Tailwind's preflight
   * zeroes paragraph margins. Inside `.blog-content` the stylesheet's `p` rules
   * are more specific, so article bodies keep their existing rhythm.
   */
  p: ({ children }) => <p className="max-w-[68ch] leading-relaxed mb-4">{children}</p>,
  // Explicitly handle strong and em to ensure markdown ** and * work properly
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

export function BlogArticle({ content }: { content: string }) {
  // Handle null/undefined/empty content gracefully
  if (!content || typeof content !== 'string') {
    return null;
  }

  try {
    const processed = resolveLinks(content);

    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processed}
      </ReactMarkdown>
    );
  } catch (error) {
    console.error("BlogArticle render error:", error);
    // Fallback to plain text if markdown parsing fails
    return <p className="text-gray-700 max-w-[68ch] leading-relaxed">{content}</p>;
  }
}
