"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

const CATEGORY_ORDER = [
  "Title Insurance",
  "Market Updates",
  "Closing Costs",
  "Education",
  "For Agents",
  "For Lenders",
];

export default function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const available = CATEGORY_ORDER.filter((category) =>
      posts.some((post) => post.category === category)
    );
    return ["All", ...available];
  }, [posts]);

  const filtered =
    active === "All" ? posts : posts.filter((post) => post.category === active);

  const latest = filtered[0];
  const gridPosts = active === "All" ? filtered.slice(1) : filtered;

  return (
    <section className="section-light">
      <div className="container-xl">
        <div className="mb-8">
          <p className="section-label">Insights & Resources</p>
          <h2 className="section-title">Latest from DMV Title Guy</h2>
          <div className="gold-divider" />
          <p className="text-brand-muted max-w-2xl mt-4">
            Straight answers on title insurance, settlement, closing costs, and local market topics for buyers, agents, and lenders.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-navy mb-3">
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  active === category
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {latest ? (
          <>
            {active === "All" && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-brand-navy mb-4">Latest Post</h3>
                <Link
                  href={`/blog/${latest.slug}`}
                  className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {latest.image ? (
                    <div className="relative h-64 bg-brand-navy overflow-hidden">
                      <img
                        src={latest.image}
                        alt={latest.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-5">
                        <p className="text-xs text-brand-blue font-medium mb-2">{latest.category}</p>
                        <p className="text-xs text-gray-200">
                          {latest.date} · {latest.readTime}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div className="p-6">
                    {!latest.image ? (
                      <p className="text-xs text-brand-blue font-medium mb-2">{latest.category}</p>
                    ) : null}
                    <h3 className="text-2xl font-bold text-brand-navy mb-2">{latest.title}</h3>
                    <p className="text-sm text-brand-muted mb-4">{latest.excerpt}</p>
                    {!latest.image ? (
                      <p className="text-xs text-gray-500">
                        {latest.date} · {latest.readTime}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">
                {active === "All" ? "All Posts" : active}
                <span className="text-sm font-normal text-gray-400 ml-2">({filtered.length})</span>
              </h3>

              {gridPosts.length === 0 ? (
                <p className="text-brand-muted py-12 text-center">No posts in this category yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
                    >
                      {post.image ? (
                        <div className="relative h-44 bg-brand-navy overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-5">
                            <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                            <span className="text-xs text-gray-200 mt-1 block">
                              {post.date} · {post.readTime}
                            </span>
                          </div>
                        </div>
                      ) : null}
                      <div className="p-5 bg-white">
                        {!post.image ? (
                          <>
                            <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                            <span className="text-xs text-gray-400 mt-1 block">
                              {post.date} · {post.readTime}
                            </span>
                          </>
                        ) : null}
                        <h3 className="font-bold text-brand-navy text-base leading-snug group-hover:text-brand-blue transition-colors mb-2 line-clamp-2 mt-3">
                          {post.title}
                        </h3>
                        <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <span className="text-brand-blue text-sm mt-3 block font-medium">Read post →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-brand-muted py-12 text-center">No posts available yet.</p>
        )}
      </div>
    </section>
  );
}
