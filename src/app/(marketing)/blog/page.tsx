import type { Metadata } from "next";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import BlogIndexClient from "@/components/BlogIndexClient";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog | DMV Title Guy — Title Insurance & Real Estate Tips",
  description: "Expert insights on title insurance, closing costs, and real estate strategy for DC, Maryland, and Virginia agents, lenders, and buyers. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await fetchAllBlogPosts();
  return (
    <>
      <PageHero
        compact
        eyebrow="The DMV Title Guy Blog"
        title="Title Insurance & DMV Closing Insights"
        lede={
          <>
            <p>Straight answers on title insurance, closing costs, and settlement for buyers, agents, and lenders across DC, Maryland, and Virginia.</p>
            {posts.length > 0 && (
              <p className="mt-3 text-sm text-slate-300">
                {posts.length} {posts.length === 1 ? "article" : "articles"} · written by Will Rapuano, Pruitt Title LLC
              </p>
            )}
          </>
        }
      />

      <BlogIndexClient posts={posts} />

      <CTASection
        eyebrow="Stay in the loop"
        title="Get practical title and closing guidance in your inbox."
        lede="Real estate marketing insights and title industry updates, delivered without the noise. Unsubscribe any time."
        primaryLabel="Subscribe Now"
        primaryHref="/subscribe"
        secondaryLabel="Browse Calculators"
        secondaryHref="/calculators"
      />
    </>
  );
}
