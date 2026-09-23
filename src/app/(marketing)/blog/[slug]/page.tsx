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
import { PRUITT_TITLE, WILL } from "@/lib/brand-identity";
import { normalizeIndependentProviderVoice } from "@/lib/provider-voice.ts";

// Preserve the last successful render if Sanity is temporarily unavailable.
export const revalidate = 3600;

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
  return normalizeIndependentProviderVoice((blocks ?? [])
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: any) => child.text || "").join("")
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim());
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
    <section className="mt-10 rounded-xl border border-brand-blue/20 bg-brand-gray-bg p-6">
      <h2 className="t-h4 text-brand-navy mb-3">
        Local Title and Closing Resources
      </h2>
      <p className="text-gray-700 leading-relaxed mb-5 max-w-[68ch]">
        Use these DMV Title Guy resources to understand local costs and process. Eligible title and settlement requests can be referred to Pruitt Title LLC for review.
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
  const leadContext =
    post.slug === "firpta-explained-dmv"
      ? {
          context: "firpta" as const,
          title: "Request an Early FIRPTA Closing Review",
          subtitle: "Share the timing and non-sensitive transaction context. Do not send taxpayer IDs or tax documents here.",
        }
      : post.slug === "types-of-property-surveys-dc-md-va"
        ? {
            context: "survey" as const,
            title: "Talk Through a Survey or Title Concern",
            subtitle: "Share the jurisdiction, timing, and issue you are trying to resolve before closing.",
          }
        : null;
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
      "@id": `${WILL.url}#person`,
      name: WILL.name,
      jobTitle: WILL.jobTitle,
      url: WILL.url,
      image: WILL.image,
      worksFor: {
        "@type": "Organization",
        "@id": PRUITT_TITLE.id,
        name: PRUITT_TITLE.name,
        url: PRUITT_TITLE.url,
      },
      sameAs: WILL.sameAs,
    },
    publisher: {
      "@type": "Person",
      "@id": `${WILL.url}#person`,
      name: WILL.name,
      url: WILL.url,
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

      {/* ─── Title block (Paper: "Refresh — Article") ─── */}
      <header className="bg-white">
        <div className="mx-auto max-w-[1296px] px-6 pb-10 pt-10 md:pb-12 md:pt-16">
          <div className="max-w-[1030px]">
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold uppercase tracking-[0.14em] text-brand-ink-light">
              <Link href="/blog" className="transition-colors hover:text-brand-navy">Guides</Link>
              <span aria-hidden="true">/</span>
              <span>{post.category}</span>
            </nav>

            <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-brand-navy md:text-[3.5rem] lg:text-[4.25rem] lg:leading-[1.03]">
              {displayTitle}
            </h1>

            {post.excerpt && (
              <p className="mt-6 max-w-[820px] font-display text-xl leading-[1.45] text-brand-ink md:text-2xl md:leading-[1.42]">
                {post.excerpt}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[15px]">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-brand-gray-bg">
                <Image
                  src="/will-rapuano-headshot.jpg"
                  alt=""
                  fill
                  className="scale-[1.28] object-cover object-[50%_22%]"
                  sizes="44px"
                />
              </div>
              <Link href="/about-will-rapuano" className="font-bold text-brand-ink hover:underline">
                Will Rapuano
              </Link>
              <span className="text-brand-ink-light">
                {post.date} · {post.readTime}
              </span>
            </div>
          </div>
        </div>

        <figure className="mx-auto max-w-[1296px] px-0 md:px-6">
          <div
            className="relative aspect-[3/2] overflow-hidden bg-brand-gray-bg md:aspect-[1296/560]"
            data-blog-hero
          >
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1344px) 1296px, 100vw"
              data-blog-hero-image
            />
          </div>
          {heroImageAlt && (
            <figcaption className="mt-2.5 px-6 text-[13px] text-brand-ink-light md:px-0" aria-hidden="true">
              {heroImageAlt}
            </figcaption>
          )}
        </figure>
      </header>

      {/* ─── Main Content ─── */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1296px] px-6 pb-20 pt-12 md:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-24">

            {/* Article */}
            <article className="min-w-0">
              {!isViennaTitleCompanyPost && (
                <div className="mb-10 border-l-4 border-brand-brass bg-brand-gray-bg px-5 py-5 lg:hidden">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-light">Planning a closing?</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-brand-ink">
                    Estimate title costs for Virginia, Maryland, or Washington DC.
                  </p>
                  <Link href="/calculators/title-quote" className="btn-primary mt-4">
                    Estimate Title Costs →
                  </Link>
                </div>
              )}

              {isViennaTitleCompanyPost && (
                <div className="mb-10 border-l-4 border-brand-brass bg-brand-gray-bg p-6">
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
                              className="text-brand-navy underline decoration-brand-brass decoration-2 underline-offset-[3px] transition-colors hover:text-brand-ink"
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
                        h1: ({ children, value }: any) => <h2 id={slugifyBlogHeading(portableBlockText(value))} className="font-display font-medium tracking-[-0.015em] text-brand-navy mt-14 mb-5 text-[1.875rem] leading-[1.15] md:text-[2.5rem]">{children}</h2>,
                        h2: ({ children, value }: any) => <h2 id={slugifyBlogHeading(portableBlockText(value))} className="font-display font-medium tracking-[-0.015em] text-brand-navy mt-14 mb-5 text-[1.75rem] leading-[1.15] md:text-[2.25rem]">{children}</h2>,
                        h3: ({ children, value }: any) => <h3 id={slugifyBlogHeading(portableBlockText(value))} className="font-display font-medium tracking-[-0.015em] text-brand-navy mt-10 mb-3 text-[1.375rem] leading-[1.25] md:text-[1.625rem]">{children}</h3>,
                        h4: ({ children }: any) => <h4 className="mt-8 mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-navy">{children}</h4>,
                      },
                    }}
                  />
                ) : bodyContent ? (
                  <BlogArticle content={bodyContent} />
                ) : (
                  <div className="bg-brand-gray-bg border border-brand-blue-100 rounded-xl p-6 text-center">
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
              <div className="mt-16 bg-brand-navy px-7 py-9 md:px-10 md:py-11">
                <h2 className="font-display text-[1.875rem] font-medium leading-[1.12] tracking-[-0.015em] text-white md:text-[2.25rem]">
                  Ready to get a title quote?
                </h2>
                <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#C9D6E0]">
                  Send your transaction details through DMV Title Guy. Will can answer initial questions and, when eligible, refer the request to Pruitt Title LLC for review.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/calculators/title-quote" className="btn-brass">
                    Estimate Title Costs →
                  </Link>
                  <Link
                    href="/title-insurance"
                    className="inline-flex min-h-12 items-center justify-center border border-white/40 px-6 text-[15px] font-semibold text-white transition-colors hover:border-white"
                  >
                    Learn About Title Insurance
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-brand-ink-light">
                <span className="text-xs font-bold uppercase tracking-[0.14em]">Share</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-navy">Facebook</a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-navy">X</a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-navy">LinkedIn</a>
                <a href={`mailto:?subject=${shareTitle}&body=Check out this article: ${canonicalUrl}`} className="hover:text-brand-navy">Email</a>
              </div>
            </article>

            {/* ─── Sidebar ─── */}
            <aside className="h-fit min-w-0 space-y-10 lg:sticky lg:top-28 lg:pt-1.5">
              {toc.length > 0 && (
                <nav aria-label="On this page" className="hidden border-t-2 border-brand-navy pt-[18px] lg:block">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-navy">On this page</p>
                  <ul className="mt-4 space-y-3">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="block text-[15px] leading-snug text-brand-ink-light transition-colors hover:text-brand-navy">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {!isViennaTitleCompanyPost && (
                <div className="hidden bg-brand-navy p-7 lg:block">
                  <p className="font-display text-[1.625rem] font-medium leading-[1.2] text-white">
                    Know your closing costs before you sign.
                  </p>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-[#C9D6E0]">
                    Title insurance, recordation, and transfer taxes for DC, Maryland, and Virginia.
                  </p>
                  <Link href="/calculators/title-quote" className="btn-brass mt-5">
                    Open the calculator →
                  </Link>
                </div>
              )}

              {/* Lead Capture Form */}
              <LeadCaptureForm
                compact
                title={leadContext?.title ?? "Get a Free Quote"}
                subtitle={leadContext?.subtitle}
                context={leadContext?.context}
                location={`blog-${post.slug}`}
              />

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="border-t-2 border-brand-navy pt-[18px]">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-navy">More guides</p>
                  <ul className="mt-4 space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/blog/${r.slug}`} className="block font-display text-lg font-medium leading-snug text-brand-navy hover:underline">
                          {postDisplayTitle(r.slug, r.title)}
                        </Link>
                        <span className="mt-1 block text-[13px] text-brand-ink-light">{r.date} · {r.readTime}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author */}
              <div className="border-t border-brand-line pt-6">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-gray-bg">
                    <Image src="/will-rapuano-headshot.jpg" alt="" fill className="scale-[1.28] object-cover object-[50%_22%]" sizes="48px" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-brand-navy">
                      <Link href={WILL.url.replace("https://dmvtitleguy.io", "")} className="hover:underline">
                        {WILL.name}
                      </Link>
                    </p>
                    <p className="text-[13px] text-brand-ink-light">{WILL.jobTitle}, Pruitt Title LLC</p>
                  </div>
                </div>
                <p className="mt-3.5 text-sm leading-relaxed text-brand-ink-light">
                  Will creates educational resources for buyers, sellers, agents, and lenders across the DMV and connects
                  transaction questions with the appropriate Pruitt Title team member. Read more about{" "}
                  <Link href="/about-will-rapuano" className="font-semibold text-brand-navy underline decoration-brand-brass underline-offset-2">
                    his role and this website
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ─── Related Posts Section ─── */}
      {related.length > 0 && (
        <section className="border-t border-brand-line bg-brand-gray-bg py-16 md:py-20">
          <div className="mx-auto max-w-[1296px] px-6">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.015em] text-brand-navy md:text-[2.5rem]">
                Keep reading
              </h2>
              <Link href="/blog" className="shrink-0 text-[15px] font-bold text-brand-navy underline decoration-brand-brass decoration-2 underline-offset-4">
                All guides →
              </Link>
            </div>
            <div className="mt-9 grid gap-10 md:grid-cols-3 md:gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-brand-navy">
                    <Image
                      src={resolvePostImage(r.slug, r.image) ?? r.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-light">{r.category}</p>
                  <h3 className="mt-2 font-display text-[1.375rem] font-medium leading-snug text-brand-navy group-hover:underline">
                    {postDisplayTitle(r.slug, r.title)}
                  </h3>
                  <p className="mt-2 text-[13px] text-brand-ink-light">{r.date} · {r.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
