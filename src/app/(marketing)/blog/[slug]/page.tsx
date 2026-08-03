import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BLOG_SEO_OVERRIDES, postCanonicalPath, postDisplayTitle } from "@/lib/post-titles";
import {
  resolvePostImage,
  resolvePostImageAlt,
  resolvePostImageDimensions,
} from "@/lib/post-image";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { BlogArticle } from "@/components/BlogArticle";
import { fetchBlogPostBySlug, fetchAllBlogSlugs, fetchAllBlogPosts } from "@/lib/blog-data";
import { normalizeMarkdownBlogBody, splitBodyAndFAQ } from "@/lib/blog-content";
import { PortableText } from "@portabletext/react";
import { Callout } from "@/components/portable-text/Callout";
import { Table } from "@/components/portable-text/Table";
import { Accordion } from "@/components/portable-text/Accordion";
import { FAQSection } from "@/components/FAQSection";
import { BLOG_FAQ_OVERRIDES } from "@/data/blog-faq-overrides";
import { blogPostModifiedDateISO } from "@/data/blog";
import {
  blogFAQSchemaText,
  blogFAQQuestionKey,
  mergeBlogFAQs,
  normalizePortableBlogContent,
  portableBlockText,
  slugifyBlogHeading,
} from "@/lib/blog-portable-content";
import { serializeJsonLd } from "@/lib/json-ld";

export const revalidate = 0;

const INTERNAL_PATH_ALIASES: Record<string, string> = {
  "/construction-loan-title-insurance": "/title-company-for-builders",
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

/**
 * `blocks` is typed any[] | null at both call sites. A default parameter only
 * applies to undefined, so a null body would have reached .map and thrown —
 * 500ing generateMetadata for any post with no excerpt and no body.
 */
function stripPortableText(blocks: any[] | null = []): string {
  return (blocks ?? [])
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: any) => child.text || "").join("")
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}



const DMV_TITLE_SERVICES_POST_SLUG = "title-insurance-cost-virginia-maryland";

const dmvTitleServiceLinks = [
  {
    href: "/title-company-washington-dc",
    label: "Washington DC Title & Settlement Services",
    description: "Escrow, title insurance, and closing support in the District",
  },
  {
    href: "/title-company-bethesda-md",
    label: "Bethesda, MD Title Company",
    description: "Montgomery County title and settlement services",
  },
  {
    href: "/title-company-fredericksburg-va",
    label: "Fredericksburg, VA Title Services",
    description: "Closing support for Fredericksburg and the I-95 corridor",
  },
  {
    href: "/title-company-stafford-va",
    label: "Stafford, VA Title Company",
    description: "Northern Virginia title services south of Quantico",
  },
  {
    href: "/maryland-closing-cost-calculator",
    label: "Maryland Closing Cost Calculator",
    description: "Estimate what buyers and sellers pay in MD",
  },
];

function RelatedLocalTitleServices() {
  return (
    <section className="mt-10 rounded-xl border border-brand-blue/20 bg-blue-50 p-6">
      <h2 className="t-h4 text-brand-navy mb-3">
        Serving Buyers Across the DMV
      </h2>
      <p className="text-gray-700 leading-relaxed mb-5 max-w-[68ch]">
        Need title insurance or settlement services near you? Pruitt Title serves buyers, realtors, and lenders across Virginia, Maryland, and Washington DC.
      </p>
      <ul className="space-y-3 mb-6">
        {dmvTitleServiceLinks.map((link) => (
          <li key={link.href} className="text-gray-700 leading-relaxed">
            <Link href={link.href} className="font-semibold text-brand-blue-deep hover:underline">
              {link.label}
            </Link>
            <span className="text-gray-500"> - {link.description}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/calculators/title-quote"
        className="btn-primary"
      >
        Get a Title Quote →
      </Link>
    </section>
  );
}

function DmvTitleServicesFooterLinks() {
  return (
    <p className="mb-4 leading-relaxed max-w-[68ch]">
      <strong className="font-semibold text-gray-900">DMV title services:</strong>{" "}
      <Link href="/title-search-vienna-va" className="text-brand-blue-deep hover:underline">
        Vienna, VA
      </Link>
      {" | "}
      <Link href="/title-company-springfield-va" className="text-brand-blue-deep hover:underline">
        Springfield, VA
      </Link>
      {" | "}
      <Link href="/title-company-bethesda-md" className="text-brand-blue-deep hover:underline">
        Bethesda, MD
      </Link>
      {" | "}
      <Link href="/title-company-washington-dc" className="text-brand-blue-deep hover:underline">
        Washington, DC
      </Link>
    </p>
  );
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const { post, portableTextBody } = await fetchBlogPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };

  const seoOverride = BLOG_SEO_OVERRIDES[post.slug];
  const title = seoOverride?.title || post.title || "DMV Title Guy";
  // Never undefined: post.image is always set, so the fallback keeps the type honest.
  const ogImage = resolvePostImage(post.slug, post.image) ?? post.image;
  const ogImageDimensions = resolvePostImageDimensions(post.slug);

  const description =
    seoOverride?.description ||
    (post as any).seo?.description ||
    (post.excerpt && post.excerpt.trim()) ||
    stripPortableText(portableTextBody).slice(0, 155) ||
    "DMV Title Guy shares practical guidance on title, closing, and real estate transactions across DC, Maryland, and Virginia.";

  const canonical = postCanonicalPath(post.slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      publishedTime: post.dateISO,
      images: [{ url: ogImage, ...ogImageDimensions }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const [postResult, allPosts] = await Promise.all([
    fetchBlogPostBySlug(params.slug),
    fetchAllBlogPosts(),
  ]);
  const { post, portableTextBody, markdownContent } = postResult;
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Split body and FAQs from markdown
  const { body: rawMarkdownBody, faqs } = markdownContent
    ? splitBodyAndFAQ(markdownContent)
    : { body: null, faqs: [] };
  const bodyContent = rawMarkdownBody
    ? normalizeMarkdownBlogBody(rawMarkdownBody, post.title)
    : null;
  const normalizedPortable = normalizePortableBlogContent(portableTextBody, post.title, faqs);
  const hasPortableBody = normalizedPortable.body.length > 0;
  const inlineAccordionQuestionKeys = new Set(
    normalizedPortable.inlineAccordionQuestions.map(blogFAQQuestionKey),
  );
  const markdownFooterFAQs = faqs.filter(
    (faq) => !inlineAccordionQuestionKeys.has(blogFAQQuestionKey(faq.question)),
  );
  const articleFAQs = mergeBlogFAQs(
    normalizedPortable.faqs,
    markdownFooterFAQs,
    BLOG_FAQ_OVERRIDES[post.slug] ?? [],
  );
  const toc = hasPortableBody ? normalizedPortable.toc : extractTOC(bodyContent);

  const showDmvTitleServices = post.slug === DMV_TITLE_SERVICES_POST_SLUG;
  const canonicalPath = postCanonicalPath(post.slug);
  const isViennaTitleCompanyPost = canonicalPath === "/title-search-vienna-va";
  const canonicalUrl = `https://dmvtitleguy.io${canonicalPath}`;

  /**
   * What this post is called on the page. Retitled posts override the Sanity
   * title, and everything a reader or a crawler sees has to agree with the <h1>:
   * the breadcrumb, the share links, the BlogPosting headline.
   *
   * Deliberately NOT used by the body-dedup checks below, which compare against
   * the post's own Sanity title — a body heading was authored alongside that, not
   * alongside any override.
   *
   * That comparison is also why those checks no longer rely on an exact match for
   * an h1. Retitling fifteen posts in Sanity changed post.title out from under the
   * body headings, which stopped matching and started rendering. A leading h1 is
   * now stripped on structure rather than on text.
   */
  const displayTitle = postDisplayTitle(post.slug, post.title);
  const heroImage = resolvePostImage(post.slug, post.image) ?? post.image;
  const heroImageAlt = resolvePostImageAlt(post.slug);

  // Build share URLs
  const shareTitle = encodeURIComponent(displayTitle);
  const shareUrl = encodeURIComponent(canonicalUrl);

  const articleSchemaDesc =
    (post as any)?.seo?.description ||
    (post.excerpt && post.excerpt.trim()) ||
    stripPortableText(portableTextBody).slice(0, 155) ||
    "DMV Title Guy shares practical guidance on title, closing, and real estate transactions across DC, Maryland, and Virginia.";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: displayTitle,
    description: articleSchemaDesc,
    image: heroImage.startsWith("http") ? heroImage : `https://dmvtitleguy.io${heroImage}`,
    datePublished: post.dateISO,
    dateModified: blogPostModifiedDateISO(post),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Person",
      name: "Will Rapuano",
      jobTitle: "Business Development, Pruitt Title LLC",
      url: "https://dmvtitleguy.io",
      image: "https://dmvtitleguy.io/will-rapuano-headshot.jpg",
      sameAs: [
        "https://www.linkedin.com/in/will-rapuano-86914b130",
        "https://www.instagram.com/dmvtitleguy",
        "https://www.youtube.com/@dmvtitleguy",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "DMV Title Guy — Pruitt Title LLC",
      url: "https://dmvtitleguy.io",
      logo: {
        "@type": "ImageObject",
        url: "https://dmvtitleguy.io/logo.png",
      },
    },
  };

  const faqSchema = articleFAQs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: articleFAQs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: blogFAQSchemaText(faq.answer) },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dmvtitleguy.io/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://dmvtitleguy.io/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayTitle,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
        />
      )}

      {/* ─── Title + Meta ─── */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-10 md:pb-12 md:pt-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-blue-deep transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-brand-blue-deep transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[220px] truncate text-slate-400">{displayTitle}</span>
          </nav>

          {/* Hero comes before the headline so the article opens visually. */}
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-brand-navy shadow-[0_24px_70px_-38px_rgba(11,29,58,0.65)] md:aspect-[21/9]"
            data-blog-hero
          >
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1200px) 1152px, 100vw"
              data-blog-hero-image
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/25 via-transparent to-transparent" aria-hidden="true" />
          </div>

          <div className="mt-8 max-w-4xl md:mt-10">
            {/* Category tag */}
            <span className="mb-4 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="max-w-4xl font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-brand-navy md:text-5xl md:leading-[1.1]">
              {displayTitle}
            </h1>

            {/* Author + Date + Read time */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-brand-navy">
                  <Image
                    src="/will-rapuano-headshot.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <span className="font-medium text-brand-navy">Will Rapuano</span>
              </div>
              <span aria-hidden="true" className="hidden text-slate-300 sm:inline">·</span>
              <span>{post.date}</span>
              <span aria-hidden="true" className="hidden text-slate-300 sm:inline">·</span>
              <span>{post.readTime}</span>
            </div>

            {/* Social Share */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Share</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-[background-color,border-color,color] duration-150 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-[background-color,border-color,color] duration-150 hover:border-black hover:bg-black hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-[background-color,border-color,color] duration-150 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=${shareTitle}&body=Check out this article: ${canonicalUrl}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-[background-color,border-color,color] duration-150 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Article */}
            <article className="lg:col-span-2 min-w-0">
              {/* Excerpt lead */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-brand-blue-deep pl-5 max-w-[68ch]">
                {post.excerpt}
              </p>

              {!isViennaTitleCompanyPost && (
                <div className="mb-8 rounded-xl border border-brand-blue/20 bg-sky-50 p-5 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">Planning a closing?</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Get a local title quote for Virginia, Maryland, or Washington DC.
                  </p>
                  <Link
                    href="/calculators/title-quote"
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-action px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Get a Title Quote →
                  </Link>
                </div>
              )}

              {isViennaTitleCompanyPost && (
                <div className="mb-8 rounded-xl border border-brand-blue/20 bg-blue-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-deep mb-2 max-w-[68ch]">
                    Vienna title search services
                  </p>
                  <h2 className="t-h4 text-brand-navy mb-3">
                    Looking for title search services in Vienna?
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-5 max-w-[68ch]">
                    This article explains how title companies work in Vienna, but if you need a property-specific title review, start with our dedicated Vienna title search service page.
                  </p>
                  <Link
                    href="/title-search-vienna-va"
                    className="btn-primary"
                  >
                    Order your Vienna VA title search
                  </Link>
                </div>
              )}

              {/* Article body */}
              <div className="blog-content" data-blog-article-body>
                {hasPortableBody ? (
                  <PortableText
                    value={normalizedPortable.body}
                    components={{
                      types: {
                        callout: ({ value }: any) => <Callout value={value} />,
                        table: ({ value }: any) => <Table value={value} />,
                        accordion: ({ value }: any) => <Accordion value={value} />,
                        // Custom type: 'list' (standard PortableText list)
                        list: ({ children, value }: any) => {
                          if (value?.listItem === "bullet" || value?.listItem === "ul") {
                            return <ul className="list-disc list-outside ml-5 my-4 space-y-2">{children}</ul>;
                          }
                          return <ol className="list-decimal list-outside ml-5 my-4 space-y-2">{children}</ol>;
                        },
                      },
                      // Top-level list/listItem: @portabletext/react renderList uses components.list
                      list: ({ children, value }: any) => {
                        if (value?.listItem === "bullet" || value?.listItem === "ul") {
                          return <ul className="list-disc list-outside ml-5 my-4 space-y-2">{children}</ul>;
                        }
                        return <ol className="list-decimal list-outside ml-5 my-4 space-y-2">{children}</ol>;
                      },
                      listItem: ({ children }: any) => <li className="leading-relaxed text-gray-700 mb-2">{children}</li>,
                      marks: {
                        strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({ children }: any) => <em className="italic">{children}</em>,
                        underline: ({ children }: any) => <span className="underline">{children}</span>,
                        link: ({ value, children }: any) => {
                          const rawHref = value?.href || '';
                          const href = INTERNAL_PATH_ALIASES[rawHref] || rawHref;
                          const isExternal = href.startsWith('http');
                          return (
                            <a
                              href={href}
                              className="text-brand-blue-deep underline hover:text-brand-blue-700 transition-colors"
                              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                              {children}
                            </a>
                          );
                        },
                      },
                      block: {
                        normal: ({ children, value }: any) => {
                          const text = value?.children?.map((c: any) => c.text ?? "").join("").trim() ?? "";
                          if (showDmvTitleServices && /^DMV title services:/i.test(text)) {
                            return <DmvTitleServicesFooterLinks />;
                          }
                          // Render --- as hr
                          if (/^[-—\s]{3,}$/.test(text)) {
                            return <hr className="my-8 border-t border-gray-200" />;
                          }
                          // Suppress HTML comments
                          if (/^<!--[\s\S]*-->$/.test(text)) return null;
                          // Strip leading # markdown heading if it duplicates the post title
                          if (/^#{1,3}\s/.test(text)) {
                            const stripped = text.replace(/^#{1,3}\s+/, "").trim();
                            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                            if (normalize(stripped) === normalize(post.title)) return null;
                          }
                          // Equal Housing disclaimer
                          if (/equal housing opportunit/i.test(text)) {
                            const clean = text.replace(/^\*+|\*+$/g, "").trim();
                            return <p className="text-center text-sm italic font-semibold text-gray-500 mt-10 max-w-[68ch] mx-auto leading-relaxed">{clean}</p>;
                          }
                          // Pruitt Title boilerplate footer (starts with * and contains Pruitt Title)
                          if (/^\*Pruitt Title/i.test(text)) {
                            const clean = text.replace(/^\*+|\*+$/g, "").trim();
                            return <p className="text-sm italic text-gray-500 mt-6 mb-2 max-w-[68ch] leading-relaxed">{clean}</p>;
                          }
                          // Parse markdown links [text](/path) into React elements
                          const mdLinkRegex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
                          if (mdLinkRegex.test(text)) {
                            const parts: React.ReactNode[] = [];
                            let lastIdx = 0;
                            mdLinkRegex.lastIndex = 0;
                            let m: RegExpExecArray | null;
                            let key = 0;
                            while ((m = mdLinkRegex.exec(text)) !== null) {
                              if (m.index > lastIdx) {
                                parts.push(<span key={key++}>{text.slice(lastIdx, m.index)}</span>);
                              }
                              parts.push(
                                <Link key={key++} href={m[2]} className="text-brand-blue-deep hover:underline">
                                  {m[1]}
                                </Link>
                              );
                              lastIdx = m.index + m[0].length;
                            }
                            if (lastIdx < text.length) {
                              parts.push(<span key={key++}>{text.slice(lastIdx)}</span>);
                            }
                            return <p className="mb-4 leading-relaxed max-w-[68ch]">{parts}</p>;
                          }
                          return <p className="mb-4 leading-relaxed max-w-[68ch]">{children}</p>;
                        },
                        // Rendered as h2, not h1: the page heading above is the document's only h1.
                        // Styling is unchanged, so nothing looks different.
                        h1: ({ children, value }: any) => <h2 id={slugifyBlogHeading(portableBlockText(value))} className="t-h3 text-brand-navy mt-10 mb-4">{children}</h2>,
                        h2: ({ children, value }: any) => <h2 id={slugifyBlogHeading(portableBlockText(value))} className="t-h4 text-brand-navy mt-10 mb-4">{children}</h2>,
                        h3: ({ children, value }: any) => <h3 id={slugifyBlogHeading(portableBlockText(value))} className="t-h5 text-brand-navy mt-8 mb-3">{children}</h3>,
                        h4: ({ children }: any) => <h4 className="t-h6 font-semibold text-brand-navy mt-8 mb-3">{children}</h4>,
                      },
                    }}
                  />
                ) : bodyContent ? (
                  <BlogArticle content={bodyContent} />
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <p className="font-semibold text-brand-navy mb-2 max-w-[68ch] leading-relaxed">Full Article Coming Soon</p>
                    <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">
                      This article is being finalized. The URL is live and indexed for SEO.
                    </p>
                  </div>
                )}
              </div>

              {/* ─── FAQ Section ─── */}
              {articleFAQs.length > 0 && (
                <FAQSection faqs={articleFAQs} includeSchema={false} />
              )}

              {showDmvTitleServices && <RelatedLocalTitleServices />}

              {/* ─── CTA Section ─── */}
              <div className="mt-14 bg-brand-navy rounded-2xl p-8 text-center">
                <h3 className="t-h4 text-white mb-3">
                  Ready to Get a Title Quote?
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Pruitt Title serves buyers, sellers, and lenders across Virginia, Maryland, and Washington DC. We make closing simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/calculators/title-quote"
                    className="btn-primary px-7 py-3.5"
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
            </article>

            {/* ─── Sidebar ─── */}
            <aside className="space-y-6 lg:sticky lg:top-24 h-fit min-w-0">
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
                          className="text-xs text-gray-600 hover:text-brand-blue-deep leading-snug block transition-colors"
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
                          className="text-sm font-medium text-brand-navy hover:text-brand-blue-deep leading-snug block transition-colors"
                        >
                          {postDisplayTitle(r.slug, r.title)}
                        </Link>
                        <span className="text-xs text-gray-600 mt-0.5 block">{r.date} · {r.readTime}</span>
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
                    <p className="font-bold text-brand-navy text-sm max-w-[68ch] leading-relaxed">Will Rapuano</p>
                    <p className="text-xs text-gray-500 max-w-[68ch]">Business Development, Pruitt Title LLC</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-[68ch]">
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
            <h2 className="t-h4 text-brand-navy mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 group block"
                >
                  <div className="relative h-44 overflow-hidden bg-brand-navy">
                      <Image
                      src={resolvePostImage(r.slug, r.image) ?? r.image}
                      alt={postDisplayTitle(r.slug, r.title)}
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <span className="text-xs text-brand-blue-deep font-semibold">{r.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-blue-deep transition-colors mb-2 line-clamp-2">
                      {postDisplayTitle(r.slug, r.title)}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-[68ch]">{r.date} · {r.readTime}</p>
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
