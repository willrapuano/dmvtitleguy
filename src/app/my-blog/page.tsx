import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllBlogPosts } from "@/lib/blog-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Title Insurance & Closing Tips | DMV Title Guy Blog",
  description:
    "Practical guidance on title insurance, closing costs, and navigating real estate transactions in DC, Maryland, and Virginia. Written by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/my-blog" },
};

export default async function MyBlogPage() {
  const posts = await fetchAllBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-brand-navy py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-xs font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            The DMV Title Guy Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Real Estate Closing Insights
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Practical answers on title insurance, closing costs, and everything in between —
            written for buyers, sellers, and agents in the DC, Maryland, and Virginia markets.
          </p>
        </div>
      </section>

      {/* ─── Featured Post ─── */}
      {featured && (
        <section className="bg-white py-14 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-semibold text-brand-blue uppercase tracking-widest mb-6">
              Latest Post
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-8 items-center"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl bg-brand-navy" style={{ paddingBottom: "56%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
              </div>
              {/* Content */}
              <div>
                <span className="inline-block text-xs font-semibold text-brand-blue bg-blue-50 px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {featured.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4 group-hover:text-brand-blue transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                  <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">WR</div>
                  <span>Will Rapuano</span>
                  <span className="text-gray-200">|</span>
                  <span>{featured.date}</span>
                  <span className="text-gray-200">|</span>
                  <span>{featured.readTime}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm group-hover:gap-3 transition-all">
                  Read the full article
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ─── All Posts Grid ─── */}
      {rest.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-8">All Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative overflow-hidden bg-brand-navy" style={{ paddingBottom: "52%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold text-white bg-brand-blue px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-brand-navy text-base leading-snug group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400">{post.date} · {post.readTime}</span>
                      <span className="text-brand-blue text-xs font-semibold group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Subscribe CTA ─── */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-white/70 mb-8">
            Get title insurance tips, closing cost guides, and DMV market updates delivered to your inbox.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Subscribe for Free →
          </Link>
        </div>
      </section>
    </>
  );
}
