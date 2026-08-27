/**
 * Root-level catch-all for all location pages and county pages.
 * Static routes (calculators, service pages, blog, etc.) take priority
 * over this dynamic route by Next.js routing rules.
 *
 * Matches: /title-company-{city}-{state} and /title-company-{county}-county-{state}
 */

import { Phone, Check, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CompactTitleQuote } from "@/components/CompactTitleQuote";
import { Footer } from "@/components/Footer";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { LocationSchema, CountySchema } from "@/components/SchemaMarkup";
import { NavBar } from "@/components/NavBar";
import CityCalculatorPage from "@/components/CityCalculatorPage";
import { TitleSearchOrderButton } from "@/components/TitleSearchCheckout";
import {
  ALL_LOCATIONS,
  COUNTIES,
  findBySlug,
  getNearbyCities,
  getLocationsInCounty,
  getCountyPage,
  CALCULATOR_SLUGS,
  formatLocationName,
  getLocationDisplayName,
  type Location,
  type County,
  type FaqItem,
} from "@/data/locations";
import {
  CITY_CALCULATOR_DATA,
  getCityCalcData,
  regionalTransportationFeeRate,
  regionalFeeParagraph,
  recordationCaveat,
  countyTransferTaxParagraph,
} from "@/data/closingCostData";

/** A statutory note, or nothing at all where the helper has none for this state. */
function TaxStatutePara({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-4 max-w-[68ch] leading-relaxed text-brand-muted">{text}</p>;
}

/**
 * Verified local cost data for a location page, and how we came by it.
 *
 * The location pages measured 301 words at 30% unique on average — the same
 * template with a city name swapped in — while closingCostData.ts already held
 * written, jurisdiction-specific figures that only the /closing-costs-* pages
 * ever rendered. This resolves the nearest data a page may honestly claim:
 *
 *   "city"   the city's own entry
 *   "parent" the parent market, for neighborhood pages that declare a parentSlug
 *   "county" another city in the same county, valid only because the levies these
 *            entries describe are themselves county-level
 *
 * The county fallback deliberately refuses anything ambiguous. Virginia's
 * independent cities set their own rates, and a county string naming two counties
 * cannot resolve to one — publishing a neighboring jurisdiction's transfer tax as
 * if it were local would be worse than saying nothing.
 */
type CostBasis = "city" | "parent" | "county";

/** 0.01 -> "1%", 0.001 -> "0.1%" — no trailing zeros on a tax rate. */
function formatRate(rate: number): string {
  return `${Number((rate * 100).toFixed(3))}%`;
}

function resolveLocalCostData(
  location: Location,
  parentLocation?: Location
): { data: (typeof CITY_CALCULATOR_DATA)[number]; basis: CostBasis } | undefined {
  const byCity = (name?: string) =>
    name
      ? CITY_CALCULATOR_DATA.find((c) => c.city.toLowerCase() === name.toLowerCase())
      : undefined;

  const own = byCity(location.city);
  if (own) return { data: own, basis: "city" };

  const parent = byCity(parentLocation?.city);
  if (parent) return { data: parent, basis: "parent" };

  const ambiguous = /independent city|\//.test(location.county);
  if (!ambiguous) {
    const sameCounty = CITY_CALCULATOR_DATA.find((c) => c.county === location.county);
    if (sameCounty) return { data: sameCounty, basis: "county" };
  }

  // DC has no counties — the district is the jurisdiction, and there is exactly
  // one DC record. Matching on state is only sound because of that; doing the
  // same for VA or MD would hand one city another city's figures.
  if (location.state === "DC") {
    const dc = CITY_CALCULATOR_DATA.find((c) => c.state === "DC");
    // Its own jurisdiction's data, so the median belongs on the page.
    if (dc) return { data: dc, basis: "city" };
  }

  return undefined;
}

const BETHESDA_FAQS: FaqItem[] = [
  {
    question: "What does a title company do in Bethesda MD?",
    answer: "A Bethesda title company searches Montgomery County land records, reviews liens and ownership history, coordinates with the lender and agents, manages escrow funds, conducts settlement, records the deed, and issues title insurance policies after closing.",
  },
  {
    question: "How much are closing costs in Bethesda?",
    answer: "Bethesda closing costs depend on the purchase price, loan terms, title insurance, lender fees, recording charges, and Maryland and Montgomery County transfer and recordation taxes. Use the Maryland closing cost calculator for a personalized estimate, and treat all tax and rate examples as approximate until verified against current official sources.",
  },
  {
    question: "Do I need title insurance in Bethesda-Chevy Chase?",
    answer: "A lender's title insurance policy is usually required when you finance a Bethesda-Chevy Chase purchase. An owner's title insurance policy is optional but strongly recommended because it protects your ownership interest against covered title defects, liens, fraud, and recording issues that may surface after closing.",
  },
  {
    question: "What is escrow and how does it work in a Bethesda closing?",
    answer: "Escrow is the neutral handling of money and documents during a closing. If a provider accepts the transaction, its written instructions and disclosures should identify who receives funds, the conditions for disbursement, and who coordinates recording.",
  },
  {
    question: "How long does a title search take in Montgomery County?",
    answer: "Timing varies with the property history, record availability, estates or trusts, unreleased deeds of trust, judgments, missing releases, and any curative work. The accepted provider should confirm its own timeline after reviewing the file.",
  },
  {
    question: "Can Pruitt Title handle commercial real estate closings in Bethesda?",
    answer: "Pruitt Title's official public information describes commercial title and settlement work. Eligibility, capacity, underwriting requirements, scope, and acceptance must be confirmed directly by Pruitt for the specific Bethesda transaction.",
  },
  {
    question: "What settlement issues are common in Bethesda older homes?",
    answer: "Older Bethesda homes can involve long chain-of-title histories, prior unreleased deeds of trust, estate or trust ownership, boundary or easement questions, judgments, tax liens, and teardown or rebuild history. A detailed title review helps identify those issues before closing day.",
  },
  {
    question: "How do Montgomery County transfer taxes work for Bethesda buyers?",
    answer: "Montgomery County and Maryland taxes can include state transfer tax, county transfer tax, and recordation tax, with responsibility sometimes affected by contract terms and local custom. Any sample rates should be treated as approximate and verified with current Maryland and Montgomery County official sources before relying on them.",
  },
];

const TYSONS_FAQS: FaqItem[] = [
  {
    question: "What title services does Pruitt Title provide in Tysons VA?",
    answer: "Pruitt Title's official public information describes title, escrow, settlement, refinance, commercial, and curative work in the DMV. Pruitt must confirm whether it accepts a specific Tysons transaction and what services apply.",
  },
  {
    question: "Do you handle commercial real estate closings in Tysons?",
    answer: "Tysons has a large office, retail, mixed-use, and investor market. Commercial files may require entity review, lender coordination, title endorsements, escrow, and settlement; the selected provider must confirm its eligibility and scope.",
  },
  {
    question: "How long does a title search take for a Tysons property?",
    answer: "Many Fairfax County title searches can be completed in a few business days, but timing depends on the property history, lender requirements, estate or entity ownership, prior liens, and any curative work needed before closing.",
  },
  {
    question: "Is Tysons the same as Tysons Corner for title and settlement purposes?",
    answer: "Tysons and Tysons Corner commonly refer to the same Fairfax County market near McLean, Vienna, and the Capital Beltway. The title and settlement process generally runs through Fairfax County land records and transaction-specific lender or contract requirements.",
  },
  {
    question: "Can Pruitt Title help with title insurance for a Tysons purchase?",
    answer: "If Pruitt accepts an eligible Tysons transaction, it will confirm the available owner's or lender's policy, underwriting requirements, endorsements, exceptions, terms, and pricing directly.",
  },
  {
    question: "How do I order a Tysons title search?",
    answer: "Use Request Title Review to send the property details to Will. If you request transaction services, an eligible matter may be referred to a provider for independent review. The provider—not DMV Title Guy—confirms acceptance, document-transfer instructions, scope, pricing, timing, and terms.",
  },
];

const FAIRFAX_TITLE_SEARCH_LINK_SLUGS = new Set([
  "title-company-herndon-va",
  "title-search-vienna-va",
  "title-company-stafford-va",
  "title-company-woodbridge-va",
]);

function HerndonStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://dmvtitleguy.io/title-company-herndon-va#breadcrumb",
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
            name: "Herndon VA Title Company",
            item: "https://dmvtitleguy.io/title-company-herndon-va",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function TysonsStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://dmvtitleguy.io/title-company-tysons-va#guide",
        headline: "Title and Closing Guide for Tysons, VA",
        url: "https://dmvtitleguy.io/title-company-tysons-va",
        about: { "@type": "Thing", name: "Title Insurance and Settlement" },
        spatialCoverage: [
          { "@type": "City", name: "Tysons", addressRegion: "VA" },
          { "@type": "Place", name: "Tysons Corner" },
          { "@type": "City", name: "McLean", addressRegion: "VA" },
          { "@type": "AdministrativeArea", name: "Fairfax County", addressRegion: "VA" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://dmvtitleguy.io/title-company-tysons-va#breadcrumb",
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
            name: "Tysons VA Title Company",
            item: "https://dmvtitleguy.io/title-company-tysons-va",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://dmvtitleguy.io/title-company-tysons-va#faq",
        mainEntity: TYSONS_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function TysonsExpansionSections() {
  const sectionHeadingClass = "t-h3 text-brand-navy mb-4";
  const bodyClass = "text-brand-muted leading-relaxed max-w-[68ch]";
  const cardClass = "rounded-lg border border-gray-200 bg-white p-5";

  return (
    <>
      <section className="section-light border-t border-gray-100">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Overview</p>
          <h2 className={sectionHeadingClass}>Tysons VA Title Company for Residential and Commercial Closings</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              DMV Title Guy publishes educational guidance for Tysons and Tysons Corner transactions. If you request transaction services, an eligible matter may be introduced to Pruitt Title for independent review; Pruitt confirms whether it accepts the file and what services apply.
            </p>
            <p className={bodyClass}>
              Tysons sits at the center of Northern Virginia's business corridor, with high-value condominiums, office properties, mixed-use redevelopment, retail assets, and nearby McLean and Vienna residential neighborhoods. That mix makes careful title work and clear settlement coordination especially important.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-5xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Services</p>
          <h2 className={sectionHeadingClass}>Title and Settlement Services in Tysons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Residential purchase and refinance closings",
              "Owner's and lender's title insurance",
              "Pre-purchase and investor title searches",
              "Commercial real estate closings",
              "Escrow and settlement coordination",
              "Title curative work and release tracking",
            ].map((item) => (
              <div key={item} className={cardClass}>
                <h3 className="font-bold text-brand-navy">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Why Pruitt Title</p>
          <h2 className={sectionHeadingClass}>Why Choose Pruitt Title for Tysons?</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              Tysons transactions can involve tight lender timelines, entity ownership, high-value collateral, or commercial requirements. Ask any prospective provider how it identifies issues, communicates milestones, and confirms responsibilities for the particular file.
            </p>
            <p className={bodyClass}>
              If you need title search support before a Tysons offer, closing, refinance, or commercial acquisition, start with our{" "}
              <Link href="/title-search-vienna-va" className="font-semibold text-brand-blue-deep hover:underline">
                Vienna VA title search
              </Link>{" "}
              guide or send Will a request for a possible provider introduction.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Local Expertise</p>
          <h2 className={sectionHeadingClass}>Local Expertise Across Tysons Corner, McLean, and Fairfax County</h2>
          <p className={`${bodyClass} mb-5`}>
            Tysons closings can touch Fairfax County land records, HOA and condo documents, commercial leases, easements, access rights, prior releases, entity authority, and lender-specific title endorsements. Our nearby team understands the local market and coordinates with parties across Tysons Corner, McLean, Vienna, Merrifield, Dunn Loring, and the broader Fairfax County corridor.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/title-company-mclean-va" className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-brand-blue-deep hover:border-brand-blue-deep transition-colors">
              McLean Title Company →
            </Link>
            <Link href="/commercial-real-estate-closings" className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-brand-blue-deep hover:border-brand-blue-deep transition-colors">
              Commercial Real Estate Closings →
            </Link>
            <Link href="/title-search-vienna-va" className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-brand-blue-deep hover:border-brand-blue-deep transition-colors">
              Vienna Title Search →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-6">Tysons Title Company FAQs</h2>
          <div className="space-y-6">
            {TYSONS_FAQS.map((faq, i) => (
              <div key={i}>
                <h3 className="t-h6 font-semibold text-brand-navy mb-2">{faq.question}</h3>
                <p className="text-brand-muted leading-relaxed max-w-[68ch]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Ask About a Tysons Transaction</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Share the property address and transaction context with Will. Any provider independently confirms acceptance, scope, pricing, timing, and terms.
          </p>
          <TitleSearchOrderButton className="btn-primary" />
        </div>
      </section>
    </>
  );
}

function BethesdaStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://dmvtitleguy.io/title-company-bethesda-md#faq",
        mainEntity: BETHESDA_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://dmvtitleguy.io/title-company-bethesda-md#breadcrumb",
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
            name: "Bethesda MD Title Company",
            item: "https://dmvtitleguy.io/title-company-bethesda-md",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BethesdaExpansionSections() {
  const sectionHeadingClass = "t-h3 text-brand-navy mb-4";
  const bodyClass = "text-brand-muted leading-relaxed max-w-[68ch]";
  const linkClass = "font-semibold text-brand-blue-deep hover:underline";

  return (
    <>
      <section className="section-light border-t border-gray-100">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Bethesda-Chevy Chase Closings</p>
          <h2 className={sectionHeadingClass}>Bethesda-Chevy Chase Title &amp; Escrow Services</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              A Bethesda-Chevy Chase closing can involve title search, lien review, escrow coordination, lender communication, settlement-statement review, recording, and final policy issuance. The selected provider should identify which steps it accepts responsibility for in writing.
            </p>
            <p className={bodyClass}>
              Residential purchases, refinances, commercial closings, investor acquisitions, estates, and trust transfers can require different experience. Ask the selected provider to confirm its transaction fit and Montgomery County process.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Settlement Issues to Watch For in Bethesda</h2>
          <p className={`${bodyClass} mb-5`}>
            Bethesda files often deserve extra attention because property values are high, ownership history can be long, and many transactions involve trusts, estates, inherited property, condominiums, or redevelopment plans.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "High-value purchase and refinance transactions",
              "Trust, estate, inherited-property, and entity ownership issues",
              "Older chain-of-title histories and unreleased deeds of trust",
              "Condo and HOA resale package coordination",
              "New construction, teardown, and rebuild title questions",
              "Judgments, tax liens, and payoff or release requirements",
              "Cross-border lender expectations for DC and Virginia buyers",
              "Easement, survey, and access questions before settlement",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-brand-dark-text">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Montgomery County Closing Cost Context</h2>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 mb-5">
            <AlertTriangle size={14} strokeWidth={2.25} className="mr-1.5 inline-block align-[-2px]" aria-hidden="true" />Rates shown are approximate and for illustration only. Verify with current Maryland/county official sources before relying on these estimates.
          </div>
          <p className={`${bodyClass} mb-4`}>
            Bethesda buyers and sellers should plan around Maryland state charges and Montgomery County charges in addition to lender fees, title insurance, escrow, recording, prorations, and settlement fees. For personalized numbers, start with the{" "}
            <Link href="/maryland-closing-cost-calculator" className={linkClass}>
              Maryland closing cost calculator
            </Link>
            .
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">State Transfer Tax</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Approximately 0.5%, subject to Maryland rules, exemptions, and current official rate verification.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Recordation Tax</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Montgomery County recordation tax may apply based on the recorded instrument and transaction details.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">County Transfer Tax</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Approximately 1.0% for improved residential property, subject to official verification and transaction-specific rules.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Commercial Real Estate Closings in Bethesda</h2>
          <p className={`${bodyClass} mb-5`}>
            Bethesda commercial deals may involve office, medical, retail, and mixed-use assets where the title work must account for entity authority, leases, easements, surveys, lender requirements, endorsements, and timing-sensitive escrow instructions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/commercial-real-estate-closings" className="btn-primary">
              Commercial Real Estate Closings
            </Link>
            <Link href="/commercial-property-title-search" className="btn-outline">
              Commercial Property Title Search
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Investor &amp; Pre-Purchase Title Search Support</h2>
          <p className={`${bodyClass} mb-5`}>
            Investors evaluating Bethesda, Chevy Chase, and broader Montgomery County opportunities should understand title risk before putting large earnest money at risk, waiving contingencies, or bidding at auction. A pre-purchase title search can identify liens, ownership gaps, foreclosure issues, and title exceptions before the deal becomes harder to unwind.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/investor-title-services" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand-blue transition-colors">
              <h3 className="font-bold text-brand-navy mb-2">Investor Title Services</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Title support for acquisitions, assignments, refinances, and portfolio decisions.</p>
            </Link>
            <Link href="/auction-property-title-search" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand-blue transition-colors">
              <h3 className="font-bold text-brand-navy mb-2">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Review title issues before auction deposits or nonrefundable bidding decisions.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand-blue transition-colors">
              <h3 className="font-bold text-brand-navy mb-2">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Check surviving liens, ownership history, and foreclosure-related title concerns.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Bethesda Closing Cost Examples</h2>
          <p className={`${bodyClass} mb-5`}>
            These examples are approximate and illustrative only. Use the{" "}
            <Link href="/maryland-closing-cost-calculator" className={linkClass}>
              Maryland closing cost calculator
            </Link>{" "}
            for personalized numbers and verify rate assumptions before relying on any estimate.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Residential Buyer</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">A Bethesda buyer at an illustrative $950,000 price may need to budget for lender charges, title insurance, escrow, recording, transfer and recordation taxes, and prepaid items.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Seller</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">A seller example may include payoff handling, release tracking, owner policy custom, transfer charges allocated by contract, commissions, prorations, and settlement fees.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Investor</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">An investor example may add pre-purchase title search costs, entity review, assignment timing, auction requirements, payoff risk, and any curative work discovered before settlement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-6">Bethesda FAQs</h2>
          <div className="space-y-6">
            {BETHESDA_FAQS.map((faq, i) => (
              <div key={i}>
                <h3 className="t-h6 font-semibold text-brand-navy mb-2">{faq.question}</h3>
                <p className="text-brand-muted leading-relaxed max-w-[68ch]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className="t-h4 text-brand-navy mb-6">Bethesda &amp; Montgomery County Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/maryland-closing-cost-calculator", label: "Maryland Closing Cost Calculator" },
              { href: "/closing-costs-bethesda-md", label: "Bethesda Closing Cost Calculator" },
              { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
              { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
              { href: "/investor-title-services", label: "Investor Title Services" },
              { href: "/auction-property-title-search", label: "Auction Property Title Search" },
              { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
              { href: "/title-company-rockville-md", label: "Rockville Title Company" },
              { href: "/title-company-silver-spring-md", label: "Silver Spring Title Company" },
              { href: "/title-company-montgomery-county-md", label: "Montgomery County Title Company" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-brand-blue-deep hover:border-brand-blue-deep transition-colors">
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Static Params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const locationSlugs = ALL_LOCATIONS.map((l) => ({ slug: l.slug }));
  const countySlugs = COUNTIES.map((c) => ({ slug: c.slug }));
  const cityCalcSlugs = CITY_CALCULATOR_DATA.map((c) => ({ slug: c.slug }));
  return [...locationSlugs, ...countySlugs, ...cityCalcSlugs];
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  // Check city calculator pages first
  const cityCalcData = getCityCalcData(params.slug);
  if (cityCalcData) {
    const cityLabel = formatLocationName(cityCalcData.city, cityCalcData.state);
    return {
      /* Mirrors this page's own h1 ("Closing Costs in {city}") rather than appending
         "Closing Cost Calculator" to the city label. That suffix made the Washington
         DC entry collide exactly with the /dc-closing-cost-calculator state page's
         title — DC being the one jurisdiction that is both a city and a "state" in
         this data — so two indexable pages competed for one phrase despite sharing
         only 1.8% of their body text. */
      title: `Closing Costs in ${cityLabel} | DMV Title Guy`,
      description: `Free closing cost calculator for ${cityLabel}. Estimate buyer and seller closing costs including title insurance, transfer taxes, and local fees.`,
      alternates: { canonical: `/${cityCalcData.slug}` },
      openGraph: {
        title: `Closing Costs in ${cityLabel} — Free Calculator`,
        description: `Estimate buyer and seller closing costs for ${cityLabel} real estate. Includes local ${cityCalcData.county} tax rates.`,
        url: `https://dmvtitleguy.io/${cityCalcData.slug}`,
        type: "website",
      },
    };
  }

  const result = findBySlug(params.slug);
  if (!result) return { title: "Not Found" };

  if (result.type === "location") {
    const { county } = result.data;
    const countyLabel = county.endsWith(" County") ? county : county;
    const locationName = getLocationDisplayName(result.data);

    // ─── CTR-optimized overrides for high-impression pages ───
    /**
     * Six of these carried a raw lowercase keyword phrase in `title` — "title
     * company mclean va Closing Services" — while the ogTitle beside it held the
     * properly cased version. The <title> is what Google prints in results, so
     * those six pages advertised themselves with an unformatted slug. Promoted
     * the ogTitle wording in each case, which keeps the intended keywords.
     */
    const seoOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDescription?: string }> = {
      "title-company-herndon-va": {
        title: "Herndon VA Title Company Guide | DMV Title Guy",
        description: "Practical Herndon and Fairfax County title and closing guidance. Request a provider introduction for independent review of an eligible transaction.",
        ogTitle: "Herndon VA Title Company Guide | DMV Title Guy",
        ogDescription: "Educational title and closing guidance for Herndon and Fairfax County transactions.",
      },
      "title-search-vienna-va": {
        title: "Vienna VA Title Search Guide | DMV Title Guy",
        description: "Learn how Vienna title searches address ownership, liens, easements, restrictions, and other recorded matters before requesting a provider introduction.",
        ogTitle: "Vienna VA Title Search Guide | DMV Title Guy",
        ogDescription: "Educational guidance on title searches for Vienna properties.",
      },
      "title-company-tysons-va": {
        title: "Tysons VA Title Company Guide | DMV Title Guy",
        description: "Practical title and closing guidance for Tysons, Tysons Corner, and Fairfax County, plus a path to request an independent provider review.",
        ogTitle: "Tysons VA Title Company Guide | DMV Title Guy",
        ogDescription: "Educational title and closing guidance for Tysons and Fairfax County transactions.",
      },
      "title-company-bethesda-md": {
        title: "Title Company in Bethesda, MD | Settlement, Escrow & Title Insurance",
        description: "Bethesda MD title company for buyers, sellers, and agents. Fast settlement, escrow, and title insurance across Chevy Chase and Montgomery County. Free online title quote.",
        ogTitle: "Title Company in Bethesda, MD | Settlement, Escrow & Title Insurance",
        ogDescription: "Bethesda MD title company for buyers, sellers, and agents. Fast settlement, escrow, and title insurance across Chevy Chase and Montgomery County. Free online title quote.",
      },
      "title-company-reston-va": {
        title: "Title Company in Reston, VA | Title Insurance & Settlement",
        description: "Practical Reston and Fairfax County title and closing guidance, with a path to request an independent provider review.",
        ogTitle: "Title Company in Reston, VA | Title Insurance & Settlement",
        ogDescription: "Educational title and closing guidance for Reston and Fairfax County transactions.",
      },
      "title-company-mclean-va": {
        title: "Title Company in McLean, VA | Escrow, Insurance & Local Closings",
        description: "Practical McLean and Fairfax County title and closing guidance, including considerations for residential and complex transactions.",
        ogTitle: "Title Company in McLean, VA | Escrow, Insurance & Local Closings",
        ogDescription: "Educational title and closing guidance for McLean and Fairfax County transactions.",
      },
      "title-company-springfield-va": {
        title: "Springfield VA Title Company | DMV Title Guy",
        description: "Springfield title company for title insurance, escrow, and closings, with 17+ years serving Fairfax County. Request a fast Pruitt Title quote.",
        ogTitle: "Springfield VA Title Company | DMV Title Guy",
        ogDescription: "Professional title insurance and closing services in Springfield, VA. Residential, commercial & investor closings. Since 2007.",
      },
      "title-company-falls-church-va": {
        title: "Falls Church VA Title Company Guide | DMV Title Guy",
        description: "Practical title and closing guidance for Falls Church City and Fairfax County addresses, plus a path to request a provider introduction.",
        ogTitle: "Falls Church VA Title Company Guide | DMV Title Guy",
        ogDescription: "Educational title and closing guidance for Falls Church transactions.",
      },
      "title-company-stafford-va": {
        title: "Stafford VA Title and Escrow Closings | Pruitt Title",
        description: "Stafford title and escrow services for buyers, sellers, agents, and investors. Local closing support from Pruitt Title. Request a quote today.",
        ogTitle: "Stafford VA Title and Escrow Closings | Pruitt Title",
        ogDescription: "Title and escrow services for Stafford buyers, sellers, agents, and investors.",
      },
      "title-company-woodbridge-va": {
        title: "Woodbridge VA Title Company & Closings | Pruitt Title",
        description: "Practical Woodbridge and Prince William County title and closing guidance, with a path to request an independent provider review.",
        ogTitle: "Woodbridge VA Title Company & Closings | Pruitt Title",
        ogDescription: "Title insurance, escrow, and closing services in Woodbridge and Prince William County.",
      },
      "title-company-fairfax-va": {
        title: "Title Company in Fairfax, VA | Settlement & Title Insurance",
        description: "Practical Fairfax title-search and closing guidance, with a path to request an independent provider review.",
        ogTitle: "Title Company in Fairfax, VA | Settlement & Title Insurance",
        ogDescription: "Educational title-search and closing guidance for Fairfax City and Fairfax County.",
      },
      "title-company-silver-spring-md": {
        title: "Silver Spring MD Title Company Guide | DMV Title Guy",
        description: "Practical title and closing guidance for Silver Spring and Montgomery County, plus a path to request a provider introduction.",
        ogTitle: "Silver Spring MD Title Company Guide | DMV Title Guy",
        ogDescription: "Educational title and closing guidance for Silver Spring transactions.",
      },
      "title-search-fairfax-va": {
        title: "Fairfax VA Title Search Guide | DMV Title Guy",
        description: "Learn how Fairfax title searches address ownership, liens, easements, restrictions, and other recorded matters before requesting a provider introduction.",
        ogTitle: "Fairfax VA Title Search Guide | DMV Title Guy",
        ogDescription: "Educational title-search guidance for Fairfax City and Fairfax County.",
      },
    };

    if (result.data.slug && seoOverrides[result.data.slug]) {
      const o = seoOverrides[result.data.slug];
      return {
        title: o.title,
        description: o.description,
        alternates: { canonical: `/${params.slug}` },
        openGraph: {
          title: o.ogTitle ?? o.title,
          description: o.ogDescription ?? o.description,
          url: `https://dmvtitleguy.io/${params.slug}`,
        },
      };
    }

    if (result.data.parentSlug) {
      return {
        title: `Title Company in ${locationName} | DMV Title Guy`,
        description: `Title search, title insurance, escrow, and settlement services in ${locationName}. Serving ${countyLabel} buyers, sellers, investors, agents, and lenders.`,
        alternates: { canonical: `/${params.slug}` },
        openGraph: {
          title: `Title Company in ${locationName} | DMV Title Guy`,
          description: `Local title and closing education for ${locationName}, with a path to request an independent provider review.`,
        },
      };
    }

    return {
      title: `Title & Closing Services in ${locationName} | DMV Title Guy`,
      description: `Practical title and closing guidance for ${locationName}. Eligible service requests may be referred to Pruitt Title for independent review.`,
      alternates: { canonical: `/${params.slug}` },
      openGraph: {
        title: `Title & Closing Services in ${locationName} | DMV Title Guy`,
        description: `Expert title search, insurance & closing services in ${locationName}. Residential, commercial & investor transactions. Since 2007.`,
      },
    };
  }

  const { fullName } = result.data;
  return {
    title: `Title Company in ${fullName} | DMV Title Guy`,
    description: `Get practical title and closing guidance for ${fullName} from Will Rapuano. Eligible service requests may be referred to Pruitt Title LLC for independent review.`,
    alternates: { canonical: `/${params.slug}` },
  };
}

// ─── Location Page ─────────────────────────────────────────────────────────────
function LocationPage({ location }: { location: Location }) {
  const { city, state, county, slug, tier, alsoServing, parentSlug } = location;
  const parentLocation = parentSlug ? ALL_LOCATIONS.find((l) => l.slug === parentSlug) : undefined;
  const nearbyCities = parentSlug
    ? ALL_LOCATIONS
        .filter((l) => l.slug !== slug && l.slug !== parentSlug && l.county === county)
        .slice(0, 3)
    : getNearbyCities(location, 3);
  const countyPage = getCountyPage(location);
  const calcSlug = CALCULATOR_SLUGS[state];
  const isSecondary = tier === 2;
  const isNeighborhood = Boolean(parentLocation);
  const countySuffix = county && !/^[\s—-]+$/.test(county) ? ` across ${county}` : "";
  const stateFullName = state === "VA" ? "Virginia" : state === "MD" ? "Maryland" : "Washington DC";
  const locationName = getLocationDisplayName(location);
  const priorityHero: Record<string, { h1: string; lede: string }> = {
    "title-company-herndon-va": {
      h1: "Herndon, VA Title Company & Closing Services",
      lede: "DMV Title Guy provides practical title and closing education for Herndon transactions. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.",
    },
    "title-company-tysons-va": {
      h1: "Tysons, VA Title Company & Settlement Services",
      lede: "DMV Title Guy provides practical title and closing education for Tysons and Tysons Corner transactions. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.",
    },
    "title-search-vienna-va": {
      h1: "Vienna, VA Title Search Services",
      lede: "DMV Title Guy explains title-search issues for Vienna properties before a purchase, bid, refinance, or closing. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.",
    },
    "title-company-falls-church-va": {
      h1: "Title Company Serving Falls Church, VA",
      lede: "DMV Title Guy provides practical title and closing education for Falls Church City and Falls Church addresses in Fairfax County. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.",
    },
    "title-company-silver-spring-md": {
      h1: "Title Company Serving Silver Spring, MD",
      lede: "DMV Title Guy provides practical title and closing education for Silver Spring and Montgomery County transactions. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.",
    },
  };
  const priorityHeroCopy = priorityHero[slug];
  const parentLocationName = parentLocation ? getLocationDisplayName(parentLocation) : undefined;
  const isTysons = slug === "title-company-tysons-va";
  const hasCheckoutCta = isTysons || slug === "title-company-herndon-va" || isNeighborhood;
  const calculatorLinkLabel =
    state === "MD"
      ? `Estimate ${city} closing costs with the Maryland calculator`
      : `Use the ${stateFullName} Calculator`;
  const calculatorCopy =
    state === "MD"
      ? `Estimate your Maryland closing costs for ${locationName}, including county-sensitive title, transfer, and settlement cost inputs.`
      : `Estimate your closing costs in ${stateFullName} with our free interactive calculator.`;
  const isBethesda = slug === "title-company-bethesda-md";
  // Bethesda already has a hand-written cost section, so it does not need the
  // generated one on top.
  const localCost = isBethesda ? undefined : resolveLocalCostData(location, parentLocation);

  const SERVICES_LIST = [
    "Title Search & Examination",
    "Owner's Title Insurance",
    "Lender's Title Insurance",
    "Settlement & Escrow Services",
    "Title Curative Work",
    "Deed Preparation & Recording",
    "1031 Exchange Closings",
    "Refinance Closings",
    "Commercial Transactions",
    "New Construction Closings",
    "Investor / Wholesale Closings",
    "Remote signing options (when available)",
  ];

  const PROCESS_STEPS = [
    { step: "1", title: "Provider Acceptance", desc: "The selected provider confirms whether it accepts the transaction and supplies its scope, pricing, timing, and terms." },
    { step: "2", title: "Title Search", desc: "The accepted provider reviews relevant records and identifies matters that may need attention before settlement." },
    { step: "3", title: "Title Commitment", desc: "The provider delivers the applicable commitment, requirements, exceptions, and coverage information." },
    { step: "4", title: "Closing Coordination", desc: "The provider coordinates the accepted closing tasks with the lender, parties, and agents." },
    { step: "5", title: "Settlement & Recording", desc: "The provider follows its written instructions for signing, funding, disbursement, recording, and post-closing work." },
  ];

  return (
    <>
      <LocationSchema city={city} state={state} county={county} slug={slug} description={`Educational title and closing guidance for ${locationName} from DMV Title Guy.`} />
      {isBethesda && <BethesdaStructuredData />}
      {isTysons && <TysonsStructuredData />}
      {slug === "title-company-herndon-va" && <HerndonStructuredData />}

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">{locationName}</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">
              {stateFullName} Title Insurance
            </p>
            <h1 className="t-h1 text-white mb-4">
              {priorityHeroCopy
                ? priorityHeroCopy.h1
                : slug === "title-company-bethesda-md"
                ? "Bethesda-Chevy Chase MD Title Company & Escrow Services"
                : isNeighborhood
                ? `Title Company in ${locationName}`
                : "Reliable Title & Settlement Services"}
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              {priorityHeroCopy
                ? priorityHeroCopy.lede
                : isNeighborhood && parentLocation
                ? `DMV Title Guy provides practical title and closing education for ${city} and nearby ${parentLocation.city} neighborhoods. Eligible requests may be referred to Pruitt Title LLC for independent review.`
                : isSecondary
                ? `DMV Title Guy provides local closing education for ${locationName}. Eligible title and settlement requests can be referred to Pruitt Title LLC for review.`
                : `DMV Title Guy provides practical title and closing education for ${locationName}${countySuffix}. Eligible requests may be referred to Pruitt Title LLC for independent review and transaction-specific acceptance.`}
            </p>
            <div className="flex flex-wrap gap-3">
              {hasCheckoutCta ? (
                <TitleSearchOrderButton className="btn-primary" />
              ) : (
                <Link href="/calculators/title-quote" className="btn-primary">Estimate Closing Costs →</Link>
              )}
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">
                <Phone size={15} strokeWidth={2.25} className="mr-2 inline-block align-[-2px]" aria-hidden="true" />(703) 859-1467
              </a>
            </div>
          </div>
          <div>
            {slug === "title-company-herndon-va" ? (
              <CompactTitleQuote />
            ) : (
              <LeadCaptureForm compact location={`location-${slug}`} />
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">What to Understand</p>
              <h2 className="t-h3 text-brand-navy mb-4">Title and Closing Topics in {locationName}</h2>
              <p className="text-brand-muted mb-6 max-w-[68ch] mx-auto leading-relaxed">
                These are common parts of a real estate closing. The provider that accepts the transaction must confirm its responsibilities, availability, pricing, timing, terms, and required disclosures directly.
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {SERVICES_LIST.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-brand-dark-text">
                    <Check size={16} strokeWidth={2.5} className="mt-1 flex-shrink-0 text-brand-blue-deep" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
              {(slug === "title-search-vienna-va" || slug === "title-search-fairfax-va") && (
                <p className="mt-6 text-sm">
                  <Link
                    href="/blog/types-of-property-surveys-dc-md-va"
                    className="font-semibold text-brand-blue-deep hover:underline"
                  >
                    Compare the types of property surveys used in DC, Maryland, and Virginia →
                  </Link>
                </p>
              )}
            </div>
            <div id="quote">
              <LeadCaptureForm title={`Request an Introduction — ${locationName}`} location={`location-${slug}-form`} />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">How It Works</p>
            <h2 className="prose-title">The Closing Process in {city}</h2>
            <p className="prose-subtitle max-w-2xl mx-auto">
              From contract to keys, here&apos;s the typical process after a title company accepts a transaction in {locationName}.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-brand-action text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-brand-navy text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed max-w-[68ch]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isBethesda && <BethesdaExpansionSections />}
      {isTysons && <TysonsExpansionSections />}

      {/* LOCAL COST CONTEXT — real figures, attributed to the jurisdiction that levies them */}
      {localCost && (
        <section className="section-light border-t border-gray-100">
          <div className="container-xl max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue-deep">
              {localCost.data.county} · Recording &amp; transfer taxes
            </p>
            <h2 className="t-h4 mt-3 text-brand-navy">
              What closing actually costs in {locationName}
            </h2>

            {/**
             * Only tax rates and localTaxNote cross city lines. Both describe a
             * county-level levy and read the same anywhere in that county. Everything
             * else in the record is written about one city — medianHomePrice,
             * costRangeText and localTaxExplainer all name it or quote a dollar
             * example against its median — so borrowing them would put a wrong
             * number in front of someone pricing a real transaction.
             */}
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-gray-200 pt-5 sm:grid-cols-3">
              {localCost.basis === "city" && (
                <>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                      Median home price
                    </dt>
                    <dd className="font-display text-2xl tabular-nums text-brand-navy">
                      ${localCost.data.medianHomePrice.toLocaleString("en-US")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                      Typical total
                    </dt>
                    <dd className="text-sm leading-relaxed text-brand-muted">
                      {localCost.data.costRangeText}
                    </dd>
                  </div>
                </>
              )}
              {localCost.data.countyTransferTaxRate > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                    County transfer tax
                  </dt>
                  <dd className="font-display text-2xl tabular-nums text-brand-navy">
                    {formatRate(localCost.data.countyTransferTaxRate)}
                  </dd>
                </div>
              )}
              {/* No current record sets this, but the data model allows a city or town
                  levy separate from the county's — render it rather than drop it
                  silently when one is filled in. */}
              {localCost.data.localTransferTaxRate > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                    Local transfer tax
                  </dt>
                  <dd className="font-display text-2xl tabular-nums text-brand-navy">
                    {formatRate(localCost.data.localTransferTaxRate)}
                  </dd>
                </div>
              )}
              {/* Seller-side and regional, so it is labelled as such rather than
                  folded in with the buyer's recordation figures. Two statutes
                  (§ 58.1-802.3 and § 58.1-802.4) at $0.10 each, shown combined
                  because they are identical in rate, payer and scope. */}
              {regionalTransportationFeeRate(localCost.data.county) > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                    Regional transportation fees{" "}
                    <span className="font-normal normal-case tracking-normal">(seller)</span>
                  </dt>
                  <dd className="font-display text-2xl tabular-nums text-brand-navy">
                    {formatRate(regionalTransportationFeeRate(localCost.data.county))}
                  </dd>
                </div>
              )}
              {localCost.data.localRecordationTaxRate > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                    Local recordation tax
                  </dt>
                  <dd className="font-display text-2xl tabular-nums text-brand-navy">
                    {formatRate(localCost.data.localRecordationTaxRate)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                  Recording office
                </dt>
                <dd className="text-sm leading-relaxed text-brand-muted">{localCost.data.county}</dd>
              </div>
            </dl>

            {localCost.basis === "city" && (
              <p className="mt-6 max-w-[68ch] leading-relaxed text-brand-muted">
                {localCost.data.localTaxExplainer}
              </p>
            )}
            {localCost.data.localTaxNote && (
              <p className="mt-4 max-w-[68ch] leading-relaxed text-brand-muted">
                {localCost.data.localTaxNote}
              </p>
            )}

            {/* The statutory paragraphs come from one helper each rather than being
                pasted into every city's record — which is how the same regional fee
                came to be stated twice in consecutive paragraphs here. A worked
                dollar figure only makes sense when the page is about that city. */}
            <TaxStatutePara
              text={regionalFeeParagraph(
                localCost.data.county,
                localCost.basis === "city" ? localCost.data.medianHomePrice : undefined
              )}
            />
            <TaxStatutePara text={recordationCaveat(localCost.data.state, localCost.data.county)} />
            <TaxStatutePara
              text={countyTransferTaxParagraph(
                localCost.data.state,
                localCost.data.county,
                localCost.data.countyTransferTaxRate,
                localCost.basis === "city" ? localCost.data.medianHomePrice : undefined
              )}
            />

            {localCost.basis !== "city" && (
              <p className="mt-4 max-w-[68ch] text-xs leading-relaxed text-brand-ink-light">
                {city} sits in {localCost.data.county}, so these county rates apply here. For a
                worked example against a specific sale price, use the calculator.
              </p>
            )}

            <p className="mt-6">
              <Link
                href={`/${localCost.data.slug}`}
                className="text-sm font-semibold text-brand-blue-deep hover:underline"
              >
                {localCost.basis === "city"
                  ? `Full ${localCost.data.city} closing cost breakdown and calculator`
                  : `${localCost.data.county} closing cost calculator`}{" "}
                →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* ALSO SERVING */}
      {alsoServing && alsoServing.length > 0 && (
        <section className="section-light border-t border-gray-100">
          <div className="container-xl">
            <h2 className="t-h5 text-brand-navy mb-4">Also Serving Communities Near {city}</h2>
            <div className="flex flex-wrap gap-3">
              {alsoServing.map((community) => (
                <span key={community} className="text-sm bg-brand-gray-bg border border-gray-200 rounded-full px-4 py-1 text-brand-muted">
                  {community}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — Phase 4 keyword expansion */}
      {!isBethesda && location.faqs && location.faqs.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: location.faqs.map((faq: FaqItem) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              }),
            }}
          />
          <section className="section-light border-t border-gray-100">
            <div className="container-xl max-w-3xl">
              <h2 className="t-h4 text-brand-navy mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {location.faqs.map((faq: FaqItem, i: number) => (
                  <div key={i}>
                    <h3 className="t-h6 font-semibold text-brand-navy mb-2">{faq.question}</h3>
                    <p className="text-brand-muted leading-relaxed max-w-[68ch]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* INTERNAL LINKS */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {parentLocation ? (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">{parentLocationName}</h3>
                <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                  View the parent market page for title services across {parentLocation.city}.
                </p>
                <Link href={`/${parentLocation.slug}`} className="text-sm text-brand-blue-deep hover:underline">
                  {parentLocation.city} Title Services →
                </Link>
              </div>
            ) : countyPage && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">{countyPage.name}</h3>
                <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                  View all title services across {countyPage.fullName}.
                </p>
                <Link href={`/${countyPage.slug}`} className="text-sm text-brand-blue-deep hover:underline">
                  {countyPage.name} Title Services →
                </Link>
              </div>
            )}
            {nearbyCities.length > 0 && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">{isNeighborhood ? "Nearby Neighborhoods" : "Nearby Markets"}</h3>
                <ul className="space-y-2">
                  {nearbyCities.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/${n.slug}`} className="text-sm text-brand-blue-deep hover:underline">
                        Title Company in {getLocationDisplayName(n)} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="font-bold text-brand-navy mb-3">Closing Cost Calculator</h3>
              <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                {calculatorCopy}
              </p>
              <Link href={`/${calcSlug}`} className="text-sm text-brand-blue-deep hover:underline">
                {calculatorLinkLabel} →
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-brand-navy mb-3">Common Transaction Scenarios</h3>
              <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                The team reviews residential, commercial, refinance, and investment-property requests and confirms the services and requirements for each transaction.
              </p>
              <Link href="/investor-friendly-title-company" className="text-sm text-brand-blue-deep hover:underline">
                Learn More →
              </Link>
            </div>
            {FAIRFAX_TITLE_SEARCH_LINK_SLUGS.has(slug) && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">Fairfax Title Search</h3>
                <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                  Need title search support in Fairfax County? Review ownership, liens, HOA issues, and recorded title risks before closing.
                </p>
                <Link href="/title-search-fairfax-va" className="text-sm text-brand-blue-deep hover:underline">
                  Fairfax title search →
                </Link>
              </div>
            )}
            {state === "VA" && slug !== "title-company-herndon-va" && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">Herndon Title Services</h3>
                <p className="text-sm text-brand-muted mb-3 max-w-[68ch] leading-relaxed">
                  Need another Fairfax County settlement option? Learn more about working with a title company in Herndon.
                </p>
                <Link href="/title-company-herndon-va" className="text-sm text-brand-blue-deep hover:underline">
                  title company in Herndon →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── County Page ───────────────────────────────────────────────────────────────
function CountyPage({ county }: { county: County }) {
  const { name, state, fullName, slug } = county;
  const citiesInCounty = getLocationsInCounty(name);
  const stateFullName = state === "VA" ? "Virginia" : "Maryland";

  return (
    <>
      <CountySchema countyName={name} state={state} slug={slug} />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">{fullName}</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">{stateFullName} Title Insurance</p>
            <h1 className="t-h1 text-white mb-4">Title Company in {fullName}</h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              DMV Title Guy provides local closing education for communities across {fullName}. Eligible title and settlement requests can be referred to Pruitt Title LLC for review.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculators/title-quote" className="btn-primary">Get a Free Quote →</Link>
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy"><Phone size={15} strokeWidth={2.25} className="mr-2 inline-block align-[-2px]" aria-hidden="true" />(703) 859-1467</a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact location={`county-${slug}`} />
          </div>
        </div>
      </section>

      {/* CITIES IN COUNTY */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2 max-w-[68ch] mx-auto leading-relaxed">Service Coverage</p>
            <h2 className="prose-title">Cities &amp; Communities in {name}</h2>
            <p className="prose-subtitle max-w-xl mx-auto">Explore local closing guidance for communities across {fullName}.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {citiesInCounty.map((loc) => (
              <Link key={loc.slug} href={`/${loc.slug}`} className="bg-brand-gray-bg hover:bg-brand-action hover:text-white border border-gray-200 rounded-lg p-4 text-center transition-colors group">
                <p className="font-semibold text-brand-navy group-hover:text-white max-w-[68ch] leading-relaxed">{loc.city}</p>
                <p className="text-xs text-brand-muted group-hover:text-blue-100 mt-1 max-w-[68ch]">{loc.tier === 1 ? "Primary Market" : "Service Area"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {state === "VA" && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container-xl max-w-3xl">
            <h2 className="t-h5 text-brand-navy mb-3">Fairfax County Title Support</h2>
            <p className="text-sm text-brand-muted leading-relaxed max-w-[68ch]">
              For another Northern Virginia settlement resource, learn more about working with a{" "}
              <Link href="/title-company-herndon-va" className="font-semibold text-brand-blue-deep hover:underline">
                title company in Herndon
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      {/* FULL FORM */}
      <section id="quote" className="section-navy">
        <div className="container-xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="t-h3 text-white mb-4">Request an Introduction in {name}</h2>
            <p className="text-gray-300 mb-4 max-w-[68ch] leading-relaxed">Share your transaction question with Will. If you request a provider introduction, that provider independently confirms whether it accepts the matter and supplies its scope, pricing, and terms.</p>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2"><Phone size={14} strokeWidth={2.25} className="shrink-0 text-brand-navy/60" aria-hidden="true" /><a href="tel:+17038591467" className="text-brand-blue">(703) 859-1467</a></p>
            </div>
          </div>
          <LeadCaptureForm location={`county-${slug}-form`} />
        </div>
      </section>
    </>
  );
}

// ─── Main Route Handler ────────────────────────────────────────────────────────
function DynamicMarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default async function SlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  // City calculator pages: /closing-costs-arlington-va, etc.
  const cityCalcData = getCityCalcData(params.slug);
  let content: ReactNode;
  if (cityCalcData) {
    content = <CityCalculatorPage data={cityCalcData} />;
  } else {
    // Location & county pages
    const result = findBySlug(params.slug);
    if (!result) notFound();
    content = result.type === "location"
      ? <LocationPage location={result.data} />
      : <CountyPage county={result.data} />;
  }

  return <DynamicMarketingShell>{content}</DynamicMarketingShell>;
}
