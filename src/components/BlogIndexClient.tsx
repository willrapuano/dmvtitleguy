"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { postImageSrcSet, postImageUrl, resolvePostImage } from "@/lib/post-image";
import { postDisplayTitle } from "@/lib/post-titles";

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

const PAGE_SIZE = 12;

/**
 * Vary the fallback wash by slug so a run of placeholders doesn't read as one
 * flat navy block. Deterministic, so SSR and client agree.
 */
const PLACEHOLDER_WASHES = [
  "radial-gradient(circle at 28% 24%, #1B3F6B 0%, #0B1D3A 58%, #071428 100%)",
  "radial-gradient(circle at 72% 30%, #17395F 0%, #0B1D3A 60%, #071428 100%)",
  "linear-gradient(135deg, #123458 0%, #0B1D3A 55%, #071428 100%)",
];

function placeholderWash(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_WASHES[hash % PLACEHOLDER_WASHES.length];
}

/**
 * Nearly every post has a real Sanity image, so the branded fallback here is a
 * safety net for the handful whose `/blog/{slug}.png` path has no file behind it
 * — not the common case.
 */
function PostImage({
  post,
  className,
  widths,
  sizes,
  priority = false,
}: {
  post: Post;
  className: string;
  /** Candidate widths for srcset, matched to this card's rendered size. */
  widths: number[];
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A 404 can resolve before React attaches its onError listener during
  // hydration, so re-check the decoded size once on mount to catch those.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const image = resolvePostImage(post.slug, post.image);

  if (!image || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundImage: placeholderWash(post.slug) }}
      >
        {/* Decorative watermark — the category already appears as a chip below. */}
        <span aria-hidden="true" className="text-base font-bold tracking-tight text-white/40">
          DMV <span className="text-brand-blue/70">Title Guy</span>
        </span>
      </div>
    );
  }

  const widest = widths[widths.length - 1];

  return (
    <img
      ref={ref}
      src={postImageUrl(image, widest)}
      srcSet={postImageSrcSet(image, widths)}
      sizes={sizes}
      alt=""
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={() => setFailed(true)}
    />
  );
}

function PostMeta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${className}`}>
      <span className="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-brand-blue-deep">
        {post.category}
      </span>
      <span className="text-gray-500">{post.date}</span>
      <span aria-hidden="true" className="text-gray-300">
        ·
      </span>
      <span className="text-gray-500">{post.readTime}</span>
    </div>
  );
}

export default function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const postCategories = Array.from(new Set(posts.map((post) => post.category)));
    const ordered = CATEGORY_ORDER.filter((category) => postCategories.includes(category));
    const remaining = postCategories
      .filter((category) => !CATEGORY_ORDER.includes(category))
      .sort((a, b) => a.localeCompare(b));
    return ["All", ...ordered, ...remaining];
  }, [posts]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = active === "All" || post.category === active;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [active, posts, query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [active, query]);

  // Only the unfiltered view gets a featured treatment — inside a category the
  // posts are peers, so promoting one just creates an odd hierarchy.
  const featured = active === "All" && query.trim() === "" ? filtered[0] : undefined;
  const gridPosts = featured ? filtered.slice(1) : filtered;
  const visiblePosts = gridPosts.slice(0, visibleCount);
  const hasMore = visibleCount < gridPosts.length;

  return (
    <section className="bg-brand-gray-bg py-12 md:py-16">
      <div className="container-xl">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="relative mb-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <label htmlFor="blog-search" className="sr-only">Search articles</label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title insurance, closing costs, markets…"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-brand-navy outline-none placeholder:text-slate-500 focus:border-brand-blue-deep focus:bg-white focus:ring-2 focus:ring-brand-blue-deep/15"
            />
          </div>
          <div
            className="-mx-4 overflow-x-auto px-4 no-scrollbar md:mx-0 md:overflow-x-visible md:px-0"
            role="group"
            aria-label="Filter posts by category"
          >
            <div className="flex gap-2 md:flex-wrap">
            {categories.map((category) => {
              const isActive = active === category;
              const count = category === "All"
                ? posts.length
                : posts.filter((post) => post.category === category).length;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  aria-pressed={isActive}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep ${
                    isActive
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-blue-deep hover:text-brand-blue-deep"
                  }`}
                >
                  {category}
                  <span className={`ml-1.5 text-xs ${isActive ? "text-white/65" : "text-slate-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            {query.trim() ? ` matching “${query.trim()}”` : ""}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-brand-navy max-w-[68ch] mx-auto leading-relaxed">No articles match those filters.</p>
            <button
              type="button"
              onClick={() => {
                setActive("All");
                setQuery("");
              }}
              className="mt-3 text-sm font-semibold text-brand-blue-deep hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-12 grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl md:grid-cols-2"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-brand-navy md:aspect-auto md:min-h-[300px]">
                  <PostImage
                    post={featured}
                    priority
                    /* Full width on mobile, half the 1152px container on desktop. */
                    widths={[640, 900, 1200]}
                    sizes="(min-width: 768px) 576px, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-navy shadow-sm">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 md:p-9">
                  <PostMeta post={featured} />
                  <h2 className="mt-4 t-h4 text-brand-navy transition-colors group-hover:text-brand-blue-deep">
                    {postDisplayTitle(featured.slug, featured.title)}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-brand-muted max-w-[68ch]">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-deep">
                    Read article
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            )}

            {gridPosts.length > 0 && (
              <>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-gray-200 pb-4">
                  <div>
                    <p className="section-label max-w-[68ch] leading-relaxed">Insights &amp; Resources</p>
                    <h2 className="section-title">
                      {active === "All" ? "More Articles" : active}
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filtered.length} {filtered.length === 1 ? "post" : "posts"}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visiblePosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      /* The grid is ~127 cards. Left on, every one entering the
                         viewport starts an RSC prefetch and the browser then
                         cancels most of them — ~100 aborted requests per visit.
                         The featured card above keeps its prefetch; hover still
                         prefetches these. */
                      prefetch={false}
                      className="editorial-card group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-brand-navy">
                        <PostImage
                          post={post}
                          /* 3-up at lg (~355px), 2-up at sm, full width on mobile. */
                          widths={[400, 640, 800]}
                          sizes="(min-width: 1024px) 355px, (min-width: 640px) 50vw, 100vw"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <PostMeta post={post} />
                        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-blue-deep">
                          {postDisplayTitle(post.slug, post.title)}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand-blue-deep">
                          Read post
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                      className="min-h-11 rounded-lg border-2 border-brand-action px-6 py-2.5 text-sm font-semibold text-brand-action transition-[background-color,color,transform] duration-150 hover:bg-brand-action hover:text-white motion-safe:active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action"
                    >
                      Load {Math.min(PAGE_SIZE, gridPosts.length - visibleCount)} more articles
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
