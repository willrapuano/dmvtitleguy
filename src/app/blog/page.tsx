import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllBlogPosts } from "@/lib/blog-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | DMV Title Guy — Title Insurance & Real Estate Tips",
  description: "Expert insights on title insurance, closing costs, and real estate strategy for DC, Maryland, and Virginia agents, lenders, and buyers. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const PUBLISHED_BLOG_POSTS = await fetchAllBlogPosts();
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

      <section className="section-light">
        <div className="container-xl">
          {PUBLISHED_BLOG_POSTS.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-brand-navy mb-4">Latest Post</h2>
              <Link href={`/blog/${PUBLISHED_BLOG_POSTS[0].slug}`} className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <p className="text-xs text-brand-blue font-medium mb-2">{PUBLISHED_BLOG_POSTS[0].category}</p>
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{PUBLISHED_BLOG_POSTS[0].title}</h3>
                <p className="text-sm text-brand-muted mb-4">{PUBLISHED_BLOG_POSTS[0].excerpt}</p>
                <p className="text-xs text-gray-500">{PUBLISHED_BLOG_POSTS[0].date} · {PUBLISHED_BLOG_POSTS[0].readTime}</p>
              </Link>
            </div>
          )}

          <h2 className="text-xl font-bold text-brand-navy mb-4">All Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PUBLISHED_BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark h-44 flex flex-col justify-end p-5">
                  <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                  <span className="text-xs text-gray-300 mt-1">{post.date} · {post.readTime}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-navy text-base leading-snug group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="text-brand-blue text-sm mt-3 block font-medium">Read post →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
