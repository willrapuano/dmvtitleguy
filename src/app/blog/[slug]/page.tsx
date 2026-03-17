import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS, getBlogPost } from "@/data/blog";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

/** Internal linking map — cross-links between related blog posts and site pages */
const INTERNAL_LINKS: Record<string, { label: string; href: string }[]> = {
  "lenders-title-insurance-vs-owners-title-insurance": [
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
    { label: "Standard vs Enhanced Title Insurance", href: "/blog/standard-vs-enhanced-title-insurance" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "what-is-a-title-settlement-fee": [
    { label: "Closing Costs in the DMV", href: "/blog/closing-costs-dmv-buyers-sellers" },
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "what-does-a-title-company-do": [
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "What Is a Title Settlement Fee?", href: "/blog/what-is-a-title-settlement-fee" },
    { label: "How to Choose the Right Title Company", href: "/blog/how-to-choose-right-title-company-dmv" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "standard-vs-enhanced-title-insurance": [
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Title Insurance Resources", href: "/title-insurance" },
    { label: "Title Insurance Requirements: DC, MD, VA", href: "/blog/title-insurance-requirements-dc-md-va" },
    { label: "Why Pruitt Title?", href: "/why-choose-us" },
  ],
  "closing-costs-dmv-buyers-sellers": [
    { label: "What Is a Title Settlement Fee?", href: "/blog/what-is-a-title-settlement-fee" },
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
  ],
  "how-to-choose-right-title-company-dmv": [
    { label: "What Is a Title Settlement Fee?", href: "/blog/what-is-a-title-settlement-fee" },
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
  ],
  "title-insurance-requirements-dc-md-va": [
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Standard vs Enhanced Title Insurance", href: "/blog/standard-vs-enhanced-title-insurance" },
  ],
  "title-companies-new-construction": [
    { label: "What Does a Title Company Do?", href: "/blog/what-does-a-title-company-do" },
  ],
  "title-insurance-real-estate-lenders-dmv": [
    { label: "Lender's vs Owner's Title Insurance", href: "/blog/lenders-title-insurance-vs-owners-title-insurance" },
    { label: "Standard vs Enhanced Title Insurance", href: "/blog/standard-vs-enhanced-title-insurance" },
  ],
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.dateISO, images: [{ url: post.image, width: 1024, height: 576 }] },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

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
      "@id": `https://www.dmvtitleguy.io/blog/${post.slug}`,
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

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Hero */}
      <section className="relative bg-brand-navy text-white py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-brand-navy/75" />
        </div>
        <div className="container-xl max-w-3xl relative z-10">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/my-blog" className="hover:text-brand-blue">My Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300 truncate">{post.title.substring(0, 40)}…</span>
          </nav>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span className="bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded">{post.category}</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{post.title}</h1>
          <p className="text-gray-300 mt-4 text-lg">{post.excerpt}</p>
          <p className="text-xs text-gray-500 mt-4">By Will Rapuano — Business Development, Pruitt Title LLC</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-light">
        <div className="container-xl grid md:grid-cols-3 gap-12 max-w-6xl">
          <article className="md:col-span-2 prose max-w-none">
            <div className="bg-brand-gray-bg border border-gray-200 rounded-lg p-6 text-center text-brand-muted">
              <p className="font-medium text-brand-navy mb-2">📝 Full Article Coming Soon</p>
              <p className="text-sm">
                Full content is being written for this article. This placeholder preserves the URL routing and metadata for SEO.
              </p>
              <p className="text-sm mt-3 italic">&ldquo;{post.excerpt}&rdquo;</p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="font-bold text-brand-navy mb-4">Related Resources</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {(INTERNAL_LINKS[post.slug] || [
                  { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
                  { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
                  { label: "Title Insurance", href: "/title-insurance" },
                ]).slice(0, 6).map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-brand-blue hover:underline border border-gray-100 rounded p-3 block">
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <LeadCaptureForm compact title="Get a Free Quote" location={`blog-${post.slug}`} />
            <div>
              <h3 className="font-bold text-brand-navy mb-3 text-sm">Recent Posts</h3>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="text-xs text-brand-blue hover:underline leading-snug block">{r.title}</Link>
                    <span className="text-xs text-brand-muted">{r.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
