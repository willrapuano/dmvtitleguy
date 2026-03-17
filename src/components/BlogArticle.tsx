"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Components } from "react-markdown";

/**
 * Pre-process markdown to resolve [LINK:/path] patterns into standard markdown links.
 * Converts `[text][LINK:/path]` to `[text](/path)`.
 */
function resolveLinks(markdown: string): string {
  // Pattern: [label][LINK:/path]
  return markdown.replace(
    /\[([^\]]+)\]\[LINK:(\/[^\]]+)\]/g,
    "[$1]($2)"
  );
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    // Internal links use Next.js Link
    if (href && href.startsWith("/")) {
      return (
        <Link href={href} className="text-brand-blue hover:underline">
          {children}
        </Link>
      );
    }
    // External links open in new tab
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  // Ensure images below fold are lazy loaded
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} loading="lazy" className="rounded-lg" {...props} />
  ),
  // Style tables for readability
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-200 text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-brand-navy text-white px-4 py-2 text-left font-semibold border border-gray-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border border-gray-200">
      {children}
    </td>
  ),
};

export function BlogArticle({ content }: { content: string }) {
  const processed = resolveLinks(content);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {processed}
    </ReactMarkdown>
  );
}
