import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { BlogArticle } from "@/components/BlogArticle";
import { fetchBlogPostBySlug, fetchAllBlogSlugs, fetchAllBlogPosts } from "@/lib/blog-data";
import { splitBodyAndFAQ } from "@/lib/blog-content";
import { PortableText } from "@portabletext/react";
import { Callout } from "@/components/portable-text/Callout";
import { Table } from "@/components/portable-text/Table";
import { Accordion } from "@/components/portable-text/Accordion";

export const revalidate = 0;

/** Internal linking map */
const STATIC_VALID_PATHS = new Set([
  "/",
  "/blog",
  "/my-blog",
  "/title-insurance",
  "/why-choose-us",
  "/virginia-closing-cost-calculator",
  "/maryland-closing-cost-calculator",
  "/dc-closing-cost-calculator",
  "/subscribe",
  "/contact",
]);

const VALID_INTERNAL_PATHS = new Set([
  ...Array.from(STATIC_VALID_PATHS),
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
]);

const INTERNAL_LINKS: Record<string, { label: string; href: string }[]> = {
  "lenders-title-insurance-vs-owners-title-insurance": [
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
    { label: "Standard vs Enhanced Title Insurance", href: "/blog/standard-vs-enhanced-title-insurance" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "what-is-a-title-settlement-fee": [
    { label: "Closing Costs in Virginia (2026)", href: "/blog/closing-costs-in-virginia-2026" },
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "what-does-a-title-company-do": [
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "What Is a Title Settlement Fee?", href: "/blog/what-is-a-title-settlement-fee" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "standard-vs-enhanced-title-insurance": [
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "closing-costs-in-virginia-2026": [
    { label: "What Is a Title Settlement Fee?", href: "/blog/what-is-a-title-settlement-fee" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Title Insurance Resources", href: "/title-insurance" },
  ],
  "title-companies-in-northern-virginia": [
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
    { label: "Title Companies in Fredericksburg", href: "/blog/title-companies-fredericksburg-va" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "title-companies-fredericksburg-va": [
    { label: "Title Companies in Northern Virginia", href: "/blog/title-companies-in-northern-virginia" },
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
};

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractTOC(content: string | null): { id: string; label: string }[] {
  if (!content) return [];
  return content
    .split("\n")
    .filter((line) => /^##\s+/.test(line) && !/^##\s+(FAQ|Frequently)/i.test(line) && !line.match(/\?$/))
    .map((line) => line.replace(/^##\s+/, "").trim())
    .filter(Boolean)
    .map((label) => ({ id: slugifyHeading(label), label }));
}

export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { post } = await fetchBlogPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateISO,
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { post, portableTextBody, markdownContent } = await fetchBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await fetchAllBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Split body and FAQs from markdown
  const { body: bodyContent, faqs } = markdownContent
    ? splitBodyAndFAQ(markdownContent)
    : { body: null, faqs: [] };

  const toc = extractTOC(bodyContent);

  // Build share URLs
  const canonicalUrl = `https://www.dmvtitleguy.io/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(canonicalUrl);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `https://www.dmvtitleguy.io${post.image}`,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Person",
      name: "Will Rapuano",
      jobTitle: "Business Development, Pruitt Title LLC",
      url: "https://www.dmvtitleguy.io",
      sameAs: [
        "https://www.linkedin.com/in/will-rapuano-86914b130",
        "https://www.instagram.com/dmvtitleguy",
        "https://www.youtube.com/@dmvtitleguy",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "DMV Title Guy — Pruitt Title LLC",
      url: "https://www.dmvtitleguy.io",
    },
  };

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const relatedLinks = (
    INTERNAL_LINKS[post.slug] || [
      { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
      { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
      { label: "Title Insurance", href: "/title-insurance" },
    ]
  ).filter((link) => VALID_INTERNAL_PATHS.has(link.href)).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ─── Hero Image ─── */}
      <div className="w-full bg-brand-navy">
        <div className="relative w-full" style={{ paddingBottom: "42%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.85 }}
            loading="eager"
            onError={undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/20 to-brand-navy/60" />
        </div>
      </div>

      {/* ─── Title + Meta ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/my-blog" className="hover:text-brand-blue transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-500 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Category tag */}
          <span className="inline-block text-xs font-semibold text-brand-blue bg-blue-50 px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-5">
            {post.title}
          </h1>

          {/* Author + Date + Read time */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
                WR
              </div>
              <span className="font-medium text-brand-navy">Will Rapuano</span>
            </div>
            <span className="text-gray-300">|</span>
            <span>{post.date}</span>
            <span className="text-gray-300">|</span>
            <span>{post.readTime}</span>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 uppercase tracking-wide mr-1">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Twitter/X
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a
              href={`mailto:?subject=${shareTitle}&body=Check out this article: ${canonicalUrl}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
              Email
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Article */}
            <article className="lg:col-span-2">
              {/* Excerpt lead */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-brand-blue pl-5">
                {post.excerpt}
              </p>

              {/* Article body */}
              <div className="blog-content">
                {portableTextBody ? (
                  <PortableText
                    value={portableTextBody}
                    components={{
                      types: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        callout: ({ value }: any) => <Callout value={value} />,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        table: ({ value }: any) => <Table value={value} />,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        accordion: ({ value }: any) => <Accordion value={value} />,
                      },
                    }}
                  />
                ) : bodyContent ? (
                  <BlogArticle content={bodyContent} />
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <p className="font-semibold text-brand-navy mb-2">📝 Full Article Coming Soon</p>
                    <p className="text-sm text-brand-muted">
                      This article is being finalized. The URL is live and indexed for SEO.
                    </p>
                  </div>
                )}
              </div>

              {/* ─── FAQ Section ─── */}
              {faqs.length > 0 && (
                <div className="mt-14 pt-10 border-t border-gray-100">
                  <h2 className="text-2xl font-bold text-brand-navy mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-0 divide-y divide-gray-100">
                    {faqs.map((faq, i) => (
                      <details
                        key={`faq-${i}`}
                        className="group py-5 cursor-pointer"
                        open={i === 0}
                      >
                        <summary className="flex items-start justify-between gap-4 list-none [&::-webkit-details-marker]:hidden select-none">
                          <span className="font-semibold text-brand-navy text-base leading-snug pr-4">
                            {faq.question}
                          </span>
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-open:rotate-180 transition-transform">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 4l4 4 4-4" />
                            </svg>
                          </span>
                        </summary>
                        <p className="mt-3 text-gray-600 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── CTA Section ─── */}
              <div className="mt-14 bg-brand-navy rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ready to Get a Title Quote?
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Pruitt Title serves buyers, sellers, and lenders across Virginia, Maryland, and Washington, DC. We make closing simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/calculators/title-quote"
                    className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-7 py-3.5 rounded-lg transition-colors"
                  >
                    Get a Free Quote →
                  </Link>
                  <Link
                    href="/title-insurance"
                    className="inline-block border-2 border-white/30 hover:border-white text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
                  >
                    Learn About Title Insurance
                  </Link>
                </div>
              </div>

              {/* ─── Related Resources ─── */}
              {relatedLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="font-bold text-brand-navy mb-4 text-base">Related Resources</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-brand-blue hover:text-brand-blue-dark border border-gray-100 hover:border-brand-blue/30 rounded-lg p-3.5 block transition-all no-underline group"
                      >
                        <span className="group-hover:underline">{link.label}</span>
                        <span className="ml-1 opacity-60">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ─── Sidebar ─── */}
            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-brand-navy mb-4 text-sm uppercase tracking-wide">
                    On This Page
                  </h3>
                  <ul className="space-y-2.5">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-xs text-gray-600 hover:text-brand-blue leading-snug block transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lead Capture Form */}
              <LeadCaptureForm
                compact
                title="Get a Free Quote"
                location={`blog-${post.slug}`}
              />

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-brand-navy mb-4 text-sm uppercase tracking-wide">
                    More Articles
                  </h3>
                  <ul className="space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/blog/${r.slug}`}
                          className="text-sm font-medium text-brand-navy hover:text-brand-blue leading-snug block transition-colors"
                        >
                          {r.title}
                        </Link>
                        <span className="text-xs text-gray-400 mt-0.5 block">{r.date} · {r.readTime}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    WR
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy text-sm">Will Rapuano</p>
                    <p className="text-xs text-gray-500">Business Development, Pruitt Title LLC</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Will is a title professional serving buyers, sellers, and lenders across the DMV area. He writes about real estate closings, title insurance, and navigating the DC/Maryland/Virginia markets.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ─── Related Posts Section ─── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group block"
                >
                  <div className="relative h-44 overflow-hidden bg-brand-navy">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <span className="text-xs text-brand-blue font-semibold">{r.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-blue transition-colors mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500">{r.date} · {r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
