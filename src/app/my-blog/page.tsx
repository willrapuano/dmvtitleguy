import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "My Blog | DMV Title Guy — Real Estate Marketing & Title Insurance Insights",
  description: "Insights on real estate marketing, title insurance, and building a sustainable business in the DMV area. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/my-blog" },
};

export default function MyBlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-blue py-20 md:py-28">
        <div className="container-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            My Blog
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Insights on real estate marketing, title insurance, and building a sustainable business in the DMV area.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark h-44 flex flex-col justify-end p-5">
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

      {/* Subscribe CTA */}
      <section className="section-blue">
        <div className="container-xl text-center max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to My Newsletter</h2>
          <p className="text-white/80 mb-6">
            Get real estate marketing insights, title industry updates, and exclusive resources delivered to your inbox.
          </p>
          <Link href="/subscribe" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
            Subscribe Now →
          </Link>
        </div>
      </section>
    </>
  );
}
