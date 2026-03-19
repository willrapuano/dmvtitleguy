import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllBlogPosts } from "@/lib/blog-data";

export const revalidate = 3600; // ISR — refresh every hour

export const metadata: Metadata = {
  title: "My Blog | DMV Title Guy — Real Estate Marketing & Title Insurance Insights",
  description: "Insights on real estate marketing, title insurance, and building a sustainable business in the DMV area. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/my-blog" },
};

export default async function MyBlogPage() {
  const posts = await fetchAllBlogPosts();

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
          {posts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-brand-navy mb-4">Latest Post</h2>
              <Link href={`/blog/${posts[0].slug}`} className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <p className="text-xs text-brand-blue font-medium mb-2">{posts[0].category}</p>
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{posts[0].title}</h3>
                <p className="text-sm text-brand-muted mb-4">{posts[0].excerpt}</p>
                <p className="text-xs text-gray-500">{posts[0].date} · {posts[0].readTime}</p>
              </Link>
            </div>
          )}

          <h2 className="text-xl font-bold text-brand-navy mb-4">All Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-44 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                    <span className="text-xs text-gray-300 mt-1 block">{post.date} · {post.readTime}</span>
                  </div>
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
