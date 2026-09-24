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
    // This component owns its responsive srcset and fallback behavior, which
    // next/image cannot preserve without duplicating the image request logic.
    // eslint-disable-next-line @next/next/no-img-element
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
      <span className="font-bold uppercase tracking-[0.14em] text-brand-ink-light">{post.category}</span>
      <span aria-hidden="true" className="text-brand-line">|</span>
      <span className="text-brand-ink-light">{post.date} · {post.readTime}</span>
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
  const renderedCount = visiblePosts.length + (featured ? 1 : 0);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-xl">
        <div className="mb-12">
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
              aria-controls="blog-results"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title insurance, closing costs, markets…"
              className="min-h-12 w-full rounded-none border border-brand-line bg-white py-3 pl-10 pr-4 text-[15px] text-brand-navy outline-none placeholder:text-brand-ink-light focus:border-brand-navy md:max-w-xl"
            />
          </div>
          <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:hidden">
            <span>Browse by topic</span>
            <span className="normal-case tracking-normal text-slate-600">Swipe for more →</span>
          </div>
          <div
            className="-mx-4 overflow-x-auto px-4 no-scrollbar md:mx-0 md:overflow-x-visible md:px-0"
            role="group"
            aria-label="Filter posts by category"
          >
            <div className="flex gap-x-7 border-b border-brand-line md:flex-wrap">
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
                  className={`-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 pt-2 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy ${
                    isActive
                      ? "border-brand-brass text-brand-navy"
                      : "border-transparent text-brand-ink-light hover:text-brand-navy"
                  }`}
                >
                  {category}
                  <span className="ml-1.5 text-xs font-medium text-brand-ink-light">
                    {count}
                  </span>
                </button>
              );
            })}
            </div>
          </div>
          <p className="mt-4 text-[13px] text-brand-ink-light" aria-live="polite">
            Showing {renderedCount} of {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            {query.trim() ? ` matching “${query.trim()}”` : ""}
          </p>
        </div>

        <div id="blog-results">
        {filtered.length === 0 ? (
          <div className="border-t-2 border-brand-navy bg-brand-gray-bg px-6 py-16 text-center">
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
                className="group mb-16 grid gap-8 md:grid-cols-[7fr_5fr] md:gap-12"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-brand-navy">
                  <PostImage
                    post={featured}
                    priority
                    /* Full width on mobile, half the 1152px container on desktop. */
                    widths={[640, 900, 1200]}
                    sizes="(min-width: 768px) 576px, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 bg-brand-navy px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-brass">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <PostMeta post={featured} />
                  <h2 className="mt-4 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] text-brand-navy group-hover:underline group-hover:decoration-brand-brass group-hover:decoration-2 group-hover:underline-offset-4 md:text-[2.625rem]">
                    {postDisplayTitle(featured.slug, featured.title)}
                  </h2>
                  <p className="mt-4 line-clamp-3 max-w-[52ch] text-[17px] leading-relaxed text-brand-ink">
                    {featured.excerpt}
                  </p>
                  <span className="mt-7 inline-flex w-fit items-center gap-1.5 border-b-2 border-brand-brass pb-1 text-[15px] font-bold text-brand-navy">
                    Read article
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            )}

            {gridPosts.length > 0 && (
              <>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t-2 border-brand-navy pt-5">
                  <div>
                    <h2 className="font-display text-[2rem] font-medium tracking-[-0.015em] text-brand-navy md:text-[2.5rem]">
                      {active === "All" ? "More Articles" : active}
                    </h2>
                  </div>
                  <span className="text-[13px] text-brand-ink-light">
                    {visiblePosts.length} of {gridPosts.length} {gridPosts.length === 1 ? "post" : "posts"}
                  </span>
                </div>

                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden bg-brand-navy">
                        <PostImage
                          post={post}
                          /* 3-up at lg (~355px), 2-up at sm, full width on mobile. */
                          widths={[400, 640, 800]}
                          sizes="(min-width: 1024px) 355px, (min-width: 640px) 50vw, 100vw"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col pt-4">
                        <PostMeta post={post} />
                        <h3 className="mt-2.5 line-clamp-3 font-display text-[1.375rem] font-medium leading-[1.25] text-brand-navy group-hover:underline group-hover:decoration-brand-brass group-hover:decoration-2 group-hover:underline-offset-4">
                          {postDisplayTitle(post.slug, post.title)}
                        </h3>
                        <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-brand-ink-light">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                      className="btn-outline px-7"
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
      </div>
    </section>
  );
}
