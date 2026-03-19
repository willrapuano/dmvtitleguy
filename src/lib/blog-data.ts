/**
 * Unified blog data layer.
 * Tries Sanity first, falls back to static data + markdown files.
 */

import { BlogPost, BLOG_POSTS } from "@/data/blog";
import { getAllPosts, getPostBySlug, getAllPostSlugs, SanityBlogPost } from "./sanity-queries";
import { getBlogContent } from "./blog-content";

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
    category: p.category ?? "General",
    readTime: p.readTime ?? "5 min read",
    image: p.mainImage?.asset?.url ?? `/blog/${p.slug}.png`,
  };
}

/** Fetch all posts — Sanity first, static fallback */
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const sanityPosts = await getAllPosts();
  if (sanityPosts.length > 0) {
    return sanityPosts.map(mapSanityPost);
  }
  return BLOG_POSTS;
}

/** Fetch a single post by slug — Sanity first, static fallback */
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

  // Static fallback
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  const markdownContent = getBlogContent(slug);
  return { post, portableTextBody: null, markdownContent };
}

/** Fetch all slugs — Sanity first, static fallback */
export async function fetchAllBlogSlugs(): Promise<string[]> {
  const sanitySlugs = await getAllPostSlugs();
  if (sanitySlugs.length > 0) return sanitySlugs;
  return BLOG_POSTS.map((p) => p.slug);
}

// Re-export static posts for use in non-async contexts
export { BLOG_POSTS as STATIC_BLOG_POSTS };
export { getBlogContent };
