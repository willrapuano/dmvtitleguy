/**
 * Unified blog data layer.
 * Tries Sanity first, then merges static + markdown-backed legacy posts.
 */

import { BlogPost, BLOG_POSTS, PUBLISHED_BLOG_POSTS } from "@/data/blog";
import { getAllPosts, getPostBySlug, getAllPostSlugs, SanityBlogPost } from "./sanity-queries";
import { getBlogContent, getMarkdownBlogSlugs } from "./blog-content";
import { postCanonicalPath } from "./post-titles";
import { normalizeIndependentProviderVoice } from "./provider-voice.ts";

const LOCAL_MARKDOWN_BODY_OVERRIDES = new Set([
  "firpta-explained-dmv",
  "title-insurance-cost-virginia-maryland",
  "what-is-a-title-settlement-fee",
]);

const LOCAL_CONTENT_UPDATED_AT: Record<string, string> = {
  "firpta-explained-dmv": "2026-08-26T00:00:00.000Z",
  "what-is-a-title-settlement-fee": "2026-08-26T00:00:00.000Z",
};

function normalizeCategory(category?: string | null, slug?: string): string {
  const value = (category || "").trim();

  if (!value || /^general$/i.test(value)) {
    const text = `${slug ?? ""} ${value}`.toLowerCase();

    if (text.includes("closing-cost")) return "Closing Costs";
    if (text.includes("lender")) return "For Lenders";
    if (text.includes("agent") || text.includes("realtor") || text.includes("broker")) return "For Agents";
    if (
      text.includes("market") ||
      text.includes("spring") ||
      text.includes("bethesda") ||
      text.includes("alexandria") ||
      text.includes("arlington") ||
      text.includes("annandale") ||
      text.includes("fairfax") ||
      text.includes("woodbridge")
    ) {
      return "Market Updates";
    }

    return "Education";
  }

  return value;
}

function mapSanityPost(p: SanityBlogPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    date: new Date(p.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    dateISO: p.publishedAt?.slice(0, 10) ?? "",
    updatedAtISO: LOCAL_CONTENT_UPDATED_AT[p.slug] || p._updatedAt || undefined,
    excerpt: normalizeIndependentProviderVoice(p.excerpt ?? ""),
    category: normalizeCategory(p.category, p.slug),
    readTime: p.readTime ?? "5 min read",
    image:
      p.mainImage?.asset?.url ??
      // Posts with no mainImage fall back to a file named for the slug. The
      // post images are JPEG now: they are photographs, were 24-bit PNG at up
      // to 3.3 MB each, and none had an alpha channel.
      `/blog/${p.slug}.jpg`,
  };
}

function mergeUniquePosts(...groups: BlogPost[][]): BlogPost[] {
  const seen = new Set<string>();
  const merged: BlogPost[] = [];

  for (const group of groups) {
    for (const post of group) {
      if (!post?.slug || seen.has(post.slug)) continue;
      seen.add(post.slug);
      merged.push({
        ...post,
        category: normalizeCategory(post.category, post.slug),
      });
    }
  }

  return merged.sort((a, b) => {
    const aDate = new Date(a.dateISO || a.date).getTime();
    const bDate = new Date(b.dateISO || b.date).getTime();
    return bDate - aDate;
  });
}

/** Fetch all posts — Sanity first, then merge with static/markdown legacy inventory */
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  // Let Sanity outages throw. These routes use ISR, so a failed revalidation
  // keeps the last known-good page instead of replacing the index or sitemap
  // with a silently truncated static fallback.
  const sanityPosts: SanityBlogPost[] = await getAllPosts();
  console.log(`[BlogData] Sanity returned ${sanityPosts.length} posts`);
  const mappedSanityPosts = sanityPosts.map(mapSanityPost);

  const staticPosts = PUBLISHED_BLOG_POSTS.map((post) => ({
    ...post,
    category: normalizeCategory(post.category, post.slug),
  }));

  const markdownPosts = PUBLISHED_BLOG_POSTS.filter((post) => getMarkdownBlogSlugs().includes(post.slug)).map((post) => ({
    ...post,
    category: normalizeCategory(post.category, post.slug),
  }));

  const merged = mergeUniquePosts(mappedSanityPosts, staticPosts, markdownPosts);
  const canonicalPosts = merged.filter((post) => postCanonicalPath(post.slug) === `/blog/${post.slug}`);
  console.log(`[BlogData] Total merged posts: ${canonicalPosts.length}`);
  return canonicalPosts;
}

/** Fetch a single post — Sanity first, static fallback */
export async function fetchBlogPostBySlug(slug: string): Promise<{
  post: BlogPost | null;
  portableTextBody: any[] | null;
  markdownContent: string | null;
}> {
  const sanityPost = await getPostBySlug(slug);
  const markdownContent = getBlogContent(slug);

  if (sanityPost) {
    return {
      post: mapSanityPost(sanityPost),
      portableTextBody: LOCAL_MARKDOWN_BODY_OVERRIDES.has(slug) ? null : sanityPost.body || null,
      // Preserve a local Markdown source even when Sanity supplies the visible
      // body. Its authored FAQ section can supplement the shared article footer.
      markdownContent,
    };
  }

  const post = PUBLISHED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;

  return {
    post: post ? { ...post, category: normalizeCategory(post.category, post.slug) } : null,
    portableTextBody: null,
    markdownContent,
  };
}

/** Fetch all slugs — merge Sanity and static/markdown sources */
export async function fetchAllBlogSlugs(): Promise<string[]> {
  const sanitySlugs = await getAllPostSlugs();
  const staticSlugs = PUBLISHED_BLOG_POSTS.map((p) => p.slug);
  return Array.from(new Set([...sanitySlugs, ...staticSlugs]));
}

export { BLOG_POSTS as STATIC_BLOG_POSTS };
export { getBlogContent };
