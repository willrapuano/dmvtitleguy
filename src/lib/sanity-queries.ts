import { sanityClient } from "./sanity-client";

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author?: { name: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
}

const POST_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  publishedAt,
  readTime,
  mainImage { asset->{ url }, alt },
  author->{ name }
`;

const POST_FULL_FIELDS = `
  ${POST_LIST_FIELDS},
  body
`;

// Sanity project not yet configured for DMVTitleGuy — return empty until
// the correct project ID is set (forces fallback to static blog data).
const SANITY_READY = true;

export async function getAllPosts(): Promise<SanityBlogPost[]> {
  if (!SANITY_READY) return [];
  try {
    return await sanityClient.fetch(
      `*[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= now()] | order(publishedAt desc) {
        ${POST_LIST_FIELDS}
      }`
    );
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  if (!SANITY_READY) return null;
  try {
    const result = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        ${POST_FULL_FIELDS}
      }`,
      { slug }
    );
    return result || null;
  } catch {
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!SANITY_READY) return [];
  try {
    const results = await sanityClient.fetch(
      `*[_type == "post" && !(_id in path("drafts.**"))] { "slug": slug.current }`
    );
    return results.map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}
