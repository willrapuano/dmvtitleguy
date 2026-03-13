import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog | DMV Title Guy — Title Insurance & Real Estate Tips",
  description: "Expert insights on title insurance, closing costs, and real estate strategy for DC, Maryland, and Virginia agents, lenders, and buyers. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Insights & Education</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">DMV Title Guy Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Expert articles on title insurance, closing costs, real estate investing, and market strategy across DC, Maryland, and Virginia.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-lg transition-shadow group">
                <div className="bg-brand-navy h-44 flex flex-col justify-end p-4">
                  <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                  <span className="text-xs text-gray-400 mt-1">{post.date} · {post.readTime}</span>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-blue transition-colors mb-2">{post.title}</h2>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="text-brand-blue text-xs mt-3 block font-medium">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
