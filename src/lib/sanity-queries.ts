import { sanityClient } from "./sanity-client";

export interface SanityBlogPost {
  _id: string;
  _updatedAt: string;
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
  body?: any[];
}

const POST_LIST_FIELDS = `
  _id,
  _updatedAt,
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
const PUBLISHED_POST_FILTER = `_type in ["post","blogPost"] && !(_id in path("drafts.**")) && publishedAt <= now()`;

export async function getAllPosts(): Promise<SanityBlogPost[]> {
  if (!SANITY_READY) return [];
  try {
    const posts = await sanityClient.fetch(
      `*[${PUBLISHED_POST_FILTER}] | order(publishedAt desc) {
        ${POST_LIST_FIELDS}
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    return posts || [];
  } catch (error) {
    console.error('[Sanity] Error fetching posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  if (!SANITY_READY) return null;
  const result = await sanityClient.fetch(
    `*[${PUBLISHED_POST_FILTER} && slug.current == $slug][0] {
      ${POST_FULL_FIELDS}
    }`,
    { slug }
  );
  return result || null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!SANITY_READY) return [];
  const results = await sanityClient.fetch(
    `*[${PUBLISHED_POST_FILTER}] { "slug": slug.current }`
  );
  return results.map((r: { slug: string }) => r.slug);
}
