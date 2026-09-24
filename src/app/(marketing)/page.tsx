import { HomePageClient, type HomeGuide } from "@/components/HomePageClient";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import { postDisplayTitle } from "@/lib/post-titles";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 3600;

export const metadata = createPageMetadata({
  title: "Title Insurance & Closing Costs: VA, MD, DC | DMV Title Guy",
  description: "Estimate title insurance and closing costs for Virginia, Maryland, and DC with free calculators and plain-English guides from Will Rapuano, Pruitt Title.",
  path: "/",
});

export default async function HomePage() {
  // The homepage must still render if Sanity is down; the guides row is optional.
  const posts = await fetchAllBlogPosts().catch(() => []);
  const latestGuides: HomeGuide[] = posts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: postDisplayTitle(post.slug, post.title),
    category: post.category,
    readTime: post.readTime,
    image: post.image,
  }));
  return <HomePageClient latestGuides={latestGuides} />;
}
