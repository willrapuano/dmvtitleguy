import { HomePageClient, type HomeGuide } from "@/components/HomePageClient";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import { showsPostImage } from "@/lib/post-image";
import { postDisplayTitle } from "@/lib/post-titles";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 3600;

export const metadata = createPageMetadata({
  // Leads with the Google Business Profile name so the homepage, not a dozen city pages,
  // answers "pruitt title" searches (2026-11-03; it averaged position 6 for that query).
  title: "Will Rapuano, Pruitt Title | Title & Closings in VA, MD, DC",
  description: "Will Rapuano and the Pruitt Title team handle title insurance and settlement in Virginia, Maryland and DC. Estimate your closing costs with free calculators.",
  path: "/",
});

export default async function HomePage() {
  // The homepage must still render if Sanity is down; the guides row is optional.
  const posts = await fetchAllBlogPosts().catch(() => []);
  // The row is a photo grid, so posts that run without a picture are skipped here.
  const latestGuides: HomeGuide[] = posts.filter((post) => showsPostImage(post.slug)).slice(0, 3).map((post) => ({
    slug: post.slug,
    title: postDisplayTitle(post.slug, post.title),
    category: post.category,
    readTime: post.readTime,
    image: post.image,
  }));
  return <HomePageClient latestGuides={latestGuides} />;
}
