"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const CATEGORIES = [
  "All",
  "Education",
  "Title Insurance",
  "Settlement & Closing",
  "Market Update",
  "Closing Costs",
  "Lenders",
  "Investors",
  "Marketing",
  "New Construction",
  "Technology",
];

export default function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? posts
    : posts.filter((p) => p.category === active);

  return (
    <section className="section-light">
      <div className="container-xl">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                active === cat
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Latest post (only when showing All) */}
        {active === "All" && filtered.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Latest Post</h2>
            <Link
              href={`/blog/${filtered[0].slug}`}
              className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <p className="text-xs text-brand-blue font-medium mb-2">{filtered[0].category}</p>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">{filtered[0].title}</h3>
              <p className="text-sm text-brand-muted mb-4">{filtered[0].excerpt}</p>
              <p className="text-xs text-gray-500">{filtered[0].date} · {filtered[0].readTime}</p>
            </Link>
          </div>
        )}

        {/* Post grid */}
        <h2 className="text-xl font-bold text-brand-navy mb-4">
          {active === "All" ? "All Posts" : active}
          <span className="text-sm font-normal text-gray-400 ml-2">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <p className="text-brand-muted py-12 text-center">No posts in this category yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(active === "All" ? filtered.slice(1) : filtered).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark h-44 flex flex-col justify-end p-5">
                  <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                  <span className="text-xs text-gray-300 mt-1">{post.date} · {post.readTime}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-navy text-base leading-snug group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="text-brand-blue text-sm mt-3 block font-medium">Read post →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
