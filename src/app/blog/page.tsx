import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import BlogIndexClient from "@/components/BlogIndexClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | DMV Title Guy — Title Insurance & Real Estate Tips",
  description: "Expert insights on title insurance, closing costs, and real estate strategy for DC, Maryland, and Virginia agents, lenders, and buyers. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await fetchAllBlogPosts();
  return (
    <>
      <section className="section-blue py-20 md:py-28">
        <div className="container-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Blog</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Insights on real estate marketing, title insurance, and building a sustainable business in the DMV area.
          </p>
        </div>
      </section>

      <BlogIndexClient posts={posts} />

      <section className="section-blue">
        <div className="container-xl text-center max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to My Newsletter</h2>
          <p className="text-white/80 mb-6">Get real estate marketing insights and title industry updates delivered to your inbox.</p>
          <Link href="/subscribe" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
            Subscribe Now →
          </Link>
        </div>
      </section>
    </>
  );
}
