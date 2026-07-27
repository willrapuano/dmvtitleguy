import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blog";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { BlogArticle } from "@/components/BlogArticle";
import { fetchBlogPostBySlug, fetchAllBlogSlugs, fetchAllBlogPosts } from "@/lib/blog-data";
import { splitBodyAndFAQ } from "@/lib/blog-content";
import { PortableText } from "@portabletext/react";
import { Callout } from "@/components/portable-text/Callout";
import { Table } from "@/components/portable-text/Table";
import { Accordion } from "@/components/portable-text/Accordion";
import { FAQSection } from "@/components/FAQSection";

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
  "/title-company/arlington-va",
  "/title-search-fairfax-va",
  "/title-company-bethesda-md",
  "/title-company/alexandria-va",
  "/title-company/falls-church-va",
  "/title-company/loudoun-county-va",
  "/title-company/prince-william-county-va",
  "/title-company/silver-spring-md",
  "/closing-costs/maryland",
  "/closing-costs/dc",
]);

const VALID_INTERNAL_PATHS = new Set([
  ...Array.from(STATIC_VALID_PATHS),
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
]);

const INTERNAL_LINKS: Record<string, { label: string; href: string }[]> = {
  "lenders-title-insurance-vs-owners-title-insurance": [
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "what-is-a-title-settlement-fee": [
    { label: "Get a Title Quote in Falls Church", href: "/title-company/falls-church-va" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "what-does-a-title-company-do": [
    { label: "Get a Title Quote in Alexandria", href: "/title-company/alexandria-va" },
    { label: "Get a Title Quote in Falls Church", href: "/title-company/falls-church-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "standard-vs-enhanced-title-insurance": [
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "closing-costs-in-virginia-2026": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "title-companies-in-northern-virginia": [
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Get a Title Quote in Prince William County", href: "/title-company/prince-william-county-va" },
  ],
  "title-companies-fredericksburg-va": [
    { label: "Get a Title Quote in Alexandria", href: "/title-company/alexandria-va" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "how-to-choose-right-title-company-dmv": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
  ],
  "closing-costs-dmv-buyers-sellers": [
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "title-insurance-requirements-dc-md-va": [
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "title-companies-new-construction": [
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Get a Title Quote in Prince William County", href: "/title-company/prince-william-county-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
  ],
  "title-insurance-real-estate-lenders-dmv": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "first-time-homebuyer-guide-dmv": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "understanding-wire-fraud-real-estate": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "commercial-real-estate-title-insurance": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
  ],
  "property-deeds-types-explained": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "working-with-builders-title-perspective": [
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Get a Title Quote in Prince William County", href: "/title-company/prince-william-county-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
  ],
  "using-zillow-traffic-data-to-close-more-deals": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "real-estate-marketing-strategies-dmv-agents": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "video-marketing-real-estate-agents": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "ai-tools-real-estate-professionals": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "digital-closings-future-title-industry": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "social-media-strategies-realtors-2025": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "building-personal-brand-real-estate-agent": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "networking-tips-real-estate-professionals": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "direct-mail-marketing-real-estate": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "ce-continuing-education-real-estate-agents": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "real-estate-investing-strategies-dmv": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "nova-housing-market-update-2025": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "1031-exchange-guide-investors": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "understanding-subject-to-transactions": [
    { label: "VA Closing Cost Calculator", href: "/virginia-closing-cost-calculator" },
    { label: "MD Closing Cost Calculator", href: "/maryland-closing-cost-calculator" },
  ],
  "closing-costs-maryland": [
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
  ],
  "closing-costs-maryland-2026": [
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "closing-costs-virginia": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "escrow-companies-near-me-dmv": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "what-happens-at-closing": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "what-happens-at-closing-real-estate": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Falls Church", href: "/title-company/falls-church-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "why-is-title-insurance-so-expensive": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "how-much-does-title-insurance-cost": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "homeowner-title-insurance": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "owners-policy-vs-lenders-policy": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "title-search-refinance": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "settlement-closing-fee": [
    { label: "Get a Title Quote in Falls Church", href: "/title-company/falls-church-va" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "title-company-washington-dc": [
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
  ],
  "dc-real-estate-taxes": [
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "firpta-explained-dmv": [
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "net-sheet-calculator-dmv": [
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
  ],
  "closing-protection-letter": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "how-to-choose-a-title-company-in-virginia-maryland-or-dc": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
  ],
  "title-company-northern-virginia": [
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Get a Title Quote in Prince William County", href: "/title-company/prince-william-county-va" },
  ],
  "title-insurance-cost-virginia": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "what-is-lenders-title-insurance": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "title-and-settlement-services": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "real-estate-closing-companies-near-me": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "virginia-real-estate-contract": [
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "title-company-for-realtors": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
  ],
  "title-insurance-enhanced-vs-standard": [
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "what-is-enhanced-title-insurance": [
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Get a Title Quote in Silver Spring", href: "/title-company/silver-spring-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "how-to-read-a-title-commitment": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "seller-net-sheet": [
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
  ],
  "who-chooses-the-title-company-in-virginia": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Get a Title Quote in Loudoun County", href: "/title-company/loudoun-county-va" },
  ],
  "enhanced-title-insurance-vs-standard": [
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
  ],
  "title-search-vs-title-insurance": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Fairfax", href: "/title-search-fairfax-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
  ],
  "title-insurance-claims-process": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Bethesda", href: "/title-company-bethesda-md" },
    { label: "Compare DC Closing Costs", href: "/closing-costs/dc" },
  ],
  "what-is-a-deed-transfer": [
    { label: "Get a Title Quote in Arlington", href: "/title-company/arlington-va" },
    { label: "Get a Title Quote in Prince William County", href: "/title-company/prince-william-county-va" },
    { label: "Compare Maryland Closing Costs", href: "/closing-costs/maryland" },
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

function stripPortableText(blocks: any[] = []): string {
  return blocks
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: any) => child.text || "").join("")
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

const BLOG_SEO_OVERRIDES: Record<string, { title: string; description: string; canonical?: string }> = {
  "what-is-a-title-quote": {
    title: "what is a title quote? DMV Closing Guide | Pruitt Title",
    description:
      "Title quote guide for DMV buyers, sellers, and agents. Learn what a title quote includes and when to request one from Pruitt Title online today.",
  },
  "what-is-a-title-settlement-fee": {
    title: "what is a title settlement fee? DMV Guide | Pruitt Title",
    description:
      "Title settlement fee guide for DMV buyers and sellers. Learn what the fee covers, what is fair locally, and when to request a Pruitt quote today.",
  },
  "title-company-vienna-va": {
    title: "vienna va title closings: How Closings Work | Pruitt Title",
    description:
      "Vienna title company guide explaining how closings work locally, with Pruitt Title insights from 17+ years serving Fairfax County. Call today.",
    canonical: "/title-search-vienna-va",
  },
  "construction-loans-maryland": {
    title: "construction loans maryland Title Review | Pruitt Title",
    description:
      "Construction loans Maryland guide for title, draw, and closing issues. Pruitt Title helps builders and buyers review title early. Call today.",
  },
  "settlement-services-arlington-va": {
    title: "settlement services arlington va Guide | Pruitt Title",
    description:
      "Arlington settlement services guide for residential closings, title work, and escrow. Pruitt Title helps DMV deals close cleanly. Call today.",
  },
};

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
      <h2 className="text-2xl font-bold text-brand-navy mb-3">
        Serving Buyers Across the DMV
      </h2>
      <p className="text-gray-700 leading-relaxed mb-5">
        Need title insurance or settlement services near you? Pruitt Title serves buyers, realtors, and lenders across Virginia, Maryland, and Washington DC.
      </p>
      <ul className="space-y-3 mb-6">
        {dmvTitleServiceLinks.map((link) => (
          <li key={link.href} className="text-gray-700 leading-relaxed">
            <Link href={link.href} className="font-semibold text-brand-blue hover:underline">
              {link.label}
            </Link>
            <span className="text-gray-500"> - {link.description}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/calculators/title-quote"
        className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
      >
        Get a Title Quote →
      </Link>
    </section>
  );
}

function DmvTitleServicesFooterLinks() {
  return (
    <p className="mb-4 leading-relaxed">
      <strong className="font-semibold text-gray-900">DMV title services:</strong>{" "}
      <Link href="/title-search-vienna-va" className="text-brand-blue hover:underline">
        Vienna, VA
      </Link>
      {" | "}
      <Link href="/title-company-springfield-va" className="text-brand-blue hover:underline">
        Springfield, VA
      </Link>
      {" | "}
      <Link href="/title-company-bethesda-md" className="text-brand-blue hover:underline">
        Bethesda, MD
      </Link>
      {" | "}
      <Link href="/title-company-washington-dc" className="text-brand-blue hover:underline">
        Washington, DC
      </Link>
    </p>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { post, portableTextBody } = await fetchBlogPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };

  const seoOverride = BLOG_SEO_OVERRIDES[post.slug];
  const title = seoOverride?.title || post.title || "DMV Title Guy";

  const description =
    seoOverride?.description ||
    (post as any).seo?.description ||
    (post.excerpt && post.excerpt.trim()) ||
    stripPortableText(portableTextBody).slice(0, 155) ||
    "DMV Title Guy shares practical guidance on title, closing, and real estate transactions across DC, Maryland, and Virginia.";

  const canonical =
    seoOverride?.canonical ||
    (post.slug === "title-search-vienna-va"
      ? "/title-search-vienna-va"
      : `/blog/${post.slug}`);

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
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  const isViennaTitleCompanyPost = post.slug === "title-search-vienna-va";
  const showDmvTitleServices = post.slug === DMV_TITLE_SERVICES_POST_SLUG;
  const canonicalPath = isViennaTitleCompanyPost
    ? "/title-search-vienna-va"
    : `/blog/${post.slug}`;
  const canonicalUrl = `https://dmvtitleguy.io${canonicalPath}`;
  // Build share URLs
  const shareTitle = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(canonicalUrl);

  const articleSchemaDesc =
    (post as any)?.seo?.description ||
    (post.excerpt && post.excerpt.trim()) ||
    stripPortableText(portableTextBody).slice(0, 155) ||
    "DMV Title Guy shares practical guidance on title, closing, and real estate transactions across DC, Maryland, and Virginia.";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: articleSchemaDesc,
    image: post.image.startsWith("http") ? post.image : `https://dmvtitleguy.io${post.image}`,
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
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  // INTERNAL_LINKS injection disabled 2026-04-24 — Sanity body links are the curated source
  const relatedLinks: { label: string; href: string }[] = [];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            style={{ opacity: 0.85 }}
            priority
            sizes="100vw"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Article */}
            <article className="lg:col-span-2 min-w-0">
              {/* Excerpt lead */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-brand-blue pl-5">
                {post.excerpt}
              </p>

              {isViennaTitleCompanyPost && (
                <div className="mb-8 rounded-xl border border-brand-blue/20 bg-blue-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue mb-2">
                    Vienna title search services
                  </p>
                  <h2 className="text-2xl font-bold text-brand-navy mb-3">
                    Looking for title search services in Vienna?
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-5">
                    This article explains how title companies work in Vienna, but if you need a property-specific title review, start with our dedicated Vienna title search service page.
                  </p>
                  <Link
                    href="/title-search-vienna-va"
                    className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    Order your Vienna VA title search
                  </Link>
                </div>
              )}

              {/* Article body */}
              <div className="blog-content">
                {portableTextBody ? (
                  <PortableText
                    value={(() => {
                      // Strip leading h1/h2 block if it duplicates the post title
                      const blocks = portableTextBody as any[];
                      if (blocks.length === 0) return blocks;
                      const first = blocks[0];
                      const firstText = first?.children?.map((c: any) => c.text).join("").trim() ?? "";
                      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                      if (
                        (first?.style === "h1" || first?.style === "h2") &&
                        normalize(firstText) === normalize(post.title)
                      ) {
                        return blocks.slice(1);
                      }
                      // Transform Sanity's nested { _type: "list" } format to PortableText Toolkit format
                      // Sanity: { _type: "list", listItem: "bullet", children: [{ _type: "listItem", children: [{ _type: "block", ... }] }] }
                      // PortableText Toolkit: [{ _type: "block", listItem: "bullet", ... }, ...]
                      const transformBody = (body: any[]): any[] => {
                        console.log("[DEBUG] transformBody called, body length:", body.length);
                        // Find list blocks
                        const listIndices = body.map((b, i) => b._type === 'list' ? i : -1).filter(i => i >= 0);
                        console.log("[DEBUG] list block indices:", listIndices);
                        if (listIndices.length > 0) {
                          console.log("[DEBUG] first list block:", JSON.stringify(body[listIndices[0]], null, 2));
                        }
                        const hasList = body.some(b => b._type === 'list');
                        console.log("[DEBUG] body has list blocks:", hasList);
                        // If no list blocks found, force-check with a filter
                        const listBlocks = body.filter(b => b._type === 'list');
                        console.log("[DEBUG] filter found listBlocks:", listBlocks.length);
                        
                        // DEBUG: Check block types
                        const types = new Set(body.map(b => b._type));
                        console.log("[DEBUG] All types in body:", Array.from(types));
                        
                        return body.flatMap((block) => {
                          if (block._type === "list") {
                            console.log("[DEBUG] Found list block, listItem:", block.listItem);
                            // Flatten: extract listItem blocks as flat blocks
                            return block.children.flatMap((li: any) =>
                              (li.children || []).map((childBlock: any) => ({
                                ...childBlock,
                                _type: "block",
                                listItem: block.listItem,
                              }))
                            );
                          }
                          return [block];
                        });
                      };
                      return transformBody(blocks);
                    })()}
                    components={{
                      types: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        callout: ({ value }: any) => <Callout value={value} />,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        table: ({ value }: any) => <Table value={value} />,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        accordion: ({ value }: any) => <Accordion value={value} />,
                        // Custom type: 'list' (standard PortableText list)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        list: ({ children, value }: any) => {
                          if (value?.listItem === "bullet" || value?.listItem === "ul") {
                            return <ul className="list-disc list-outside ml-5 my-4 space-y-2">{children}</ul>;
                          }
                          return <ol className="list-decimal list-outside ml-5 my-4 space-y-2">{children}</ol>;
                        },
                      },
                      // Top-level list/listItem: @portabletext/react renderList uses components.list
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      list: ({ children, value }: any) => {
                        // DEBUG: log list rendering
                        console.log("[LIST] Rendering list, listItem:", value?.listItem, "children:", children?.length);
                        if (value?.listItem === "bullet" || value?.listItem === "ul") {
                          return <ul className="list-disc list-outside ml-5 my-4 space-y-2">{children}</ul>;
                        }
                        return <ol className="list-decimal list-outside ml-5 my-4 space-y-2">{children}</ol>;
                      },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      listItem: ({ children }: any) => <li className="leading-relaxed text-gray-700 mb-2">{children}</li>,
                      marks: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        em: ({ children }: any) => <em className="italic">{children}</em>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        underline: ({ children }: any) => <span className="underline">{children}</span>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        link: ({ value, children }: any) => {
                          const href = value?.href || '';
                          const isExternal = href.startsWith('http');
                          return (
                            <a
                              href={href}
                              className="text-brand-blue underline hover:text-brand-blue-dark transition-colors"
                              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                              {children}
                            </a>
                          );
                        },
                      },
                      block: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            return <p className="text-center text-sm italic font-semibold text-gray-500 mt-10">{clean}</p>;
                          }
                          // Pruitt Title boilerplate footer (starts with * and contains Pruitt Title)
                          if (/^\*Pruitt Title/i.test(text)) {
                            const clean = text.replace(/^\*+|\*+$/g, "").trim();
                            return <p className="text-sm italic text-gray-500 mt-6 mb-2">{clean}</p>;
                          }
                          // FAQ question detection: ends with ?, short, starts uppercase
                          if (
                            text.endsWith("?") &&
                            text.length < 150 &&
                            /^[A-Z]/.test(text)
                          ) {
                            return <p className="font-bold text-brand-blue mt-10 mb-1 text-base border-l-4 border-brand-blue pl-3">{children}</p>;
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
                                <Link key={key++} href={m[2]} className="text-brand-blue hover:underline">
                                  {m[1]}
                                </Link>
                              );
                              lastIdx = m.index + m[0].length;
                            }
                            if (lastIdx < text.length) {
                              parts.push(<span key={key++}>{text.slice(lastIdx)}</span>);
                            }
                            return <p className="mb-4 leading-relaxed">{parts}</p>;
                          }
                          return <p className="mb-4 leading-relaxed">{children}</p>;
                        },
                        h1: ({ children }: any) => <h1 className="text-3xl font-bold text-brand-navy mt-10 mb-4">{children}</h1>,
                        h2: ({ children }: any) => <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{children}</h2>,
                        h3: ({ children }: any) => <h3 className="text-xl font-bold text-brand-navy mt-8 mb-3">{children}</h3>,
                        h4: ({ children }: any) => <h4 className="text-lg font-semibold text-brand-navy mt-8 mb-3">{children}</h4>,
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
                <FAQSection faqs={faqs} includeSchema={false} />
              )}

              {showDmvTitleServices && <RelatedLocalTitleServices />}

              {/* ─── CTA Section ─── */}
              <div className="mt-14 bg-brand-navy rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ready to Get a Title Quote?
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Pruitt Title serves buyers, sellers, and lenders across Virginia, Maryland, and Washington DC. We make closing simple.
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
                      <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
