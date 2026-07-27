import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import BlogIndexClient from "@/components/BlogIndexClient";

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
      <section className="relative overflow-hidden bg-brand-navy py-12 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/office-bg.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/88 to-brand-navy-dark/95"
          aria-hidden="true"
        />
        <div className="container-xl relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            The DMV Title Guy Blog
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">
            Title Insurance &amp; DMV Closing Insights
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-slate-200">
            Straight answers on title insurance, closing costs, and settlement for buyers,
            agents, and lenders across DC, Maryland, and Virginia.
          </p>
          {posts.length > 0 && (
            <p className="mt-5 text-sm text-slate-300">
              {posts.length} {posts.length === 1 ? "article" : "articles"} · written by Will Rapuano,
              Pruitt Title LLC
            </p>
          )}
        </div>
      </section>

      <BlogIndexClient posts={posts} />

      <section className="bg-brand-navy py-14 md:py-20">
        <div className="container-xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Stay in the loop
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
              Subscribe to My Newsletter
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-200">
              Real estate marketing insights and title industry updates, delivered to your inbox.
              No spam — unsubscribe any time.
            </p>
            <Link
              href="/subscribe"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-action px-8 py-3.5 font-semibold text-white transition-colors hover:bg-brand-action-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Subscribe Now
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
