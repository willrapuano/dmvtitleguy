/**
 * Unified blog data layer.
 * Tries Sanity first, then merges static + markdown-backed legacy posts.
 */

import { BlogPost, BLOG_POSTS, PUBLISHED_BLOG_POSTS } from "@/data/blog";
import { getAllPosts, getPostBySlug, getAllPostSlugs, SanityBlogPost } from "./sanity-queries";
import { getBlogContent, getMarkdownBlogSlugs } from "./blog-content";

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
    excerpt: p.excerpt ?? "",
    category: normalizeCategory(p.category, p.slug),
    readTime: p.readTime ?? "5 min read",
    image: p.mainImage?.asset?.url ?? `/blog/${p.slug}.png`,
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
  let sanityPosts: SanityBlogPost[] = [];
  try {
    sanityPosts = await getAllPosts();
    console.log(`[BlogData] Sanity returned ${sanityPosts.length} posts`);
  } catch (error) {
    console.error('[BlogData] Error fetching from Sanity:', error);
  }
  const mappedSanityPosts = sanityPosts.map(mapSanityPost);

  const staticPosts = PUBLISHED_BLOG_POSTS.map((post) => ({
    ...post,
    category: normalizeCategory(post.category, post.slug),
  }));

  const markdownPosts = BLOG_POSTS.filter((post) => getMarkdownBlogSlugs().includes(post.slug)).map((post) => ({
    ...post,
    category: normalizeCategory(post.category, post.slug),
  }));

  const merged = mergeUniquePosts(mappedSanityPosts, staticPosts, markdownPosts);
  console.log(`[BlogData] Total merged posts: ${merged.length}`);
  return merged;
}

/** Fetch a single post — Sanity first, static fallback */
export async function fetchBlogPostBySlug(slug: string): Promise<{
  post: BlogPost | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  portableTextBody: any[] | null;
  markdownContent: string | null;
}> {
  const sanityPost = await getPostBySlug(slug);

  if (sanityPost) {
    return {
      post: mapSanityPost(sanityPost),
      portableTextBody: sanityPost.body || null,
      markdownContent: null,
    };
  }

  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  const markdownContent = getBlogContent(slug);

  return {
    post: post ? { ...post, category: normalizeCategory(post.category, post.slug) } : null,
    portableTextBody: null,
    markdownContent,
  };
}

/** Fetch all slugs — merge Sanity and static/markdown sources */
export async function fetchAllBlogSlugs(): Promise<string[]> {
  const sanitySlugs = await getAllPostSlugs();
  const staticSlugs = BLOG_POSTS.map((p) => p.slug);
  return Array.from(new Set([...sanitySlugs, ...staticSlugs]));
}

export { BLOG_POSTS as STATIC_BLOG_POSTS };
export { getBlogContent };
