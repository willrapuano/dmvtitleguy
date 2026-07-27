/**
 * Root-level catch-all for all location pages and county pages.
 * Static routes (calculators, service pages, blog, etc.) take priority
 * over this dynamic route by Next.js routing rules.
 *
 * Matches: /title-company-{city}-{state} and /title-company-{county}-county-{state}
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { LocationSchema, CountySchema } from "@/components/SchemaMarkup";
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
  getStateFullName,
} from "@/data/closingCostData";

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
    answer: "Escrow is the neutral handling of money and documents during the closing. Pruitt Title receives and safeguards funds, follows written settlement instructions, disburses money only when closing conditions are satisfied, and coordinates recording so the Bethesda transaction is completed properly.",
  },
  {
    question: "How long does a title search take in Montgomery County?",
    answer: "Many Montgomery County title searches can be completed in a few business days, but older homes, estate transfers, trusts, unreleased deeds of trust, judgments, or missing releases can extend the timeline. Pruitt Title flags those issues early so the parties can clear them before settlement.",
  },
  {
    question: "Can Pruitt Title handle commercial real estate closings in Bethesda?",
    answer: "Yes. Pruitt Title handles Bethesda commercial title and settlement work for office, medical, retail, mixed-use, investor, and lender-financed transactions, including title search, survey and easement review coordination, entity authority checks, escrow, endorsements, and settlement.",
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
    answer: "Pruitt Title provides title searches, title insurance, escrow coordination, settlement services, refinance closings, commercial closings, and curative support for Tysons, Tysons Corner, McLean, and Fairfax County real estate transactions.",
  },
  {
    question: "Do you handle commercial real estate closings in Tysons?",
    answer: "Yes. Tysons has a large office, retail, mixed-use, and investor property market, and Pruitt Title supports commercial real estate closings that require entity review, lender coordination, title endorsements, escrow, and settlement.",
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
    answer: "Yes. Pruitt Title can issue owner's and lender's title insurance policies for eligible Tysons purchases and refinances, including residential, commercial, investor, and lender-financed transactions.",
  },
  {
    question: "How do I order a Tysons title search?",
    answer: "Use the Order Title Search button to submit the property details or upload your contract. The team will review the file, confirm what is needed, and begin the title search and settlement process.",
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
        "@type": ["LocalBusiness", "LegalService"],
        "@id": "https://dmvtitleguy.io/title-company-tysons-va#business",
        name: "DMV Title Guy — Pruitt Title LLC — Tysons VA Title Company",
        url: "https://dmvtitleguy.io/title-company-tysons-va",
        telephone: "(703) 859-1467",
        email: "wrapuano@pruitt-title.com",
        image: "https://dmvtitleguy.io/logo.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Suite 230",
          addressLocality: "Vienna",
          addressRegion: "VA",
          postalCode: "22182",
          addressCountry: "US",
        },
        areaServed: [
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
  const sectionHeadingClass = "text-2xl md:text-3xl font-bold text-brand-navy mb-4";
  const bodyClass = "text-brand-muted leading-relaxed";
  const cardClass = "rounded-lg border border-gray-200 bg-white p-5";

  return (
    <>
      <section className="section-light border-t border-gray-100">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Overview</p>
          <h2 className={sectionHeadingClass}>Tysons VA Title Company for Residential and Commercial Closings</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              Pruitt Title provides title search, title insurance, escrow, and settlement services for Tysons and Tysons Corner real estate transactions. Our office is nearby in Vienna, and our team regularly handles Fairfax County closings for buyers, sellers, agents, lenders, builders, and investors.
            </p>
            <p className={bodyClass}>
              Tysons sits at the center of Northern Virginia's business corridor, with high-value condominiums, office properties, mixed-use redevelopment, retail assets, and nearby McLean and Vienna residential neighborhoods. That mix makes careful title work and clear settlement coordination especially important.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-5xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Services</p>
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
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Why Pruitt Title</p>
          <h2 className={sectionHeadingClass}>Why Choose Pruitt Title for Tysons?</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              Pruitt Title has served the DMV region since 2007, combining local settlement experience with practical communication for busy agents, lenders, and clients. Tysons transactions often involve tight lender timelines, entity ownership, high-value collateral, or commercial requirements, so we focus on identifying title issues early and keeping the parties aligned.
            </p>
            <p className={bodyClass}>
              If you need title search support before a Tysons offer, closing, refinance, or commercial acquisition, start with our{" "}
              <Link href="/title-search-vienna-va" className="font-semibold text-brand-blue-deep hover:underline">
                Vienna VA title search
              </Link>{" "}
              team or order a title review online.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Local Expertise</p>
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
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Tysons Title Company FAQs</h2>
          <div className="space-y-6">
            {TYSONS_FAQS.map((faq, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-brand-navy mb-2">{faq.question}</h3>
                <p className="text-brand-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start a Tysons Title Search or Closing</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Send us the property address, contract, or deal details and we will help you start the title review process.
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
  const sectionHeadingClass = "text-2xl md:text-3xl font-bold text-brand-navy mb-4";
  const bodyClass = "text-brand-muted leading-relaxed";
  const linkClass = "font-semibold text-brand-blue-deep hover:underline";

  return (
    <>
      <section className="section-light border-t border-gray-100">
        <div className="container-xl max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Bethesda-Chevy Chase Closings</p>
          <h2 className={sectionHeadingClass}>Bethesda-Chevy Chase Title &amp; Escrow Services</h2>
          <div className="space-y-4">
            <p className={bodyClass}>
              Pruitt Title handles the title search, lien review, escrow coordination, lender communication, settlement statement review, deed recording, and final title policy issuance for Bethesda-Chevy Chase real estate transactions. The work starts with public-record research and continues through funding, recording, and post-closing delivery.
            </p>
            <p className={bodyClass}>
              Our team supports residential purchases, refinances, commercial closings, investor acquisitions, estate and trust transfers, and transactions where out-of-area buyers or lenders need a settlement team that understands Montgomery County procedures.
            </p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className={sectionHeadingClass}>Settlement Issues We Watch For in Bethesda</h2>
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
            ⚠️ Rates shown are approximate and for illustration only. Verify with current Maryland/county official sources before relying on these estimates.
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
              <p className="text-sm text-brand-muted">Approximately 0.5%, subject to Maryland rules, exemptions, and current official rate verification.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Recordation Tax</h3>
              <p className="text-sm text-brand-muted">Montgomery County recordation tax may apply based on the recorded instrument and transaction details.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">County Transfer Tax</h3>
              <p className="text-sm text-brand-muted">Approximately 1.0% for improved residential property, subject to official verification and transaction-specific rules.</p>
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
              <p className="text-sm text-brand-muted">Title support for acquisitions, assignments, refinances, and portfolio decisions.</p>
            </Link>
            <Link href="/auction-property-title-search" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand-blue transition-colors">
              <h3 className="font-bold text-brand-navy mb-2">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted">Review title issues before auction deposits or nonrefundable bidding decisions.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand-blue transition-colors">
              <h3 className="font-bold text-brand-navy mb-2">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted">Check surviving liens, ownership history, and foreclosure-related title concerns.</p>
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
              <p className="text-sm text-brand-muted">A Bethesda buyer at an illustrative $950,000 price may need to budget for lender charges, title insurance, escrow, recording, transfer and recordation taxes, and prepaid items.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Seller</h3>
              <p className="text-sm text-brand-muted">A seller example may include payoff handling, release tracking, owner policy custom, transfer charges allocated by contract, commissions, prorations, and settlement fees.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-brand-navy mb-2">Investor</h3>
              <p className="text-sm text-brand-muted">An investor example may add pre-purchase title search costs, entity review, assignment timing, auction requirements, payoff risk, and any curative work discovered before settlement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Bethesda FAQs</h2>
          <div className="space-y-6">
            {BETHESDA_FAQS.map((faq, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-brand-navy mb-2">{faq.question}</h3>
                <p className="text-brand-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Bethesda &amp; Montgomery County Resources</h2>
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
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Check city calculator pages first
  const cityCalcData = getCityCalcData(params.slug);
  if (cityCalcData) {
    const cityLabel = formatLocationName(cityCalcData.city, cityCalcData.state);
    return {
      title: `${cityLabel} Closing Cost Calculator | DMV Title Guy`,
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
    const { city, state, county } = result.data;
    const countyLabel = county.endsWith(" County") ? county : county;
    const locationName = getLocationDisplayName(result.data);

    // ─── CTR-optimized overrides for high-impression pages ───
    const seoOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDescription?: string }> = {
      "title-company-herndon-va": {
        title: "Herndon VA Title Company | Fast Closings & Online Quotes | Pruitt Title",
        description: "Need a title company in Herndon, VA? We offer fast, reliable settlement services and title insurance for buyers, sellers, and realtors. Get your free title quote online in minutes.",
        ogTitle: "Herndon VA Title Company | Fast Closings & Online Quotes | Pruitt Title",
        ogDescription: "Fast, reliable settlement services and title insurance for Herndon buyers, sellers, and realtors. Get your free title quote online in minutes.",
      },
      "title-search-vienna-va": {
        title: "Vienna VA Title Company — Trusted Closings Since 2007 | DMV Title Guy",
        description: "Vienna, VA's trusted title settlement company for residential & commercial closings. 17+ years serving Fairfax County. Free title quote: (703) 859-1467.",
        ogTitle: "Vienna VA Title Settlement Company | DMV Title Guy",
        ogDescription: "Professional title search, insurance & settlement services in Vienna, VA. Serving Oakton, McLean & all of Fairfax County since 2007.",
      },
      "title-company-tysons-va": {
        title: "Tysons VA Title Company & Title Insurance | Pruitt Title",
        description: "Tysons VA title company and title insurance services for Tysons Corner, McLean, and Fairfax County. Pruitt Title handles title searches, escrow, closings, and settlement services.",
        ogTitle: "Tysons VA Title Company & Title Insurance | Pruitt Title",
        ogDescription: "Title search, escrow, title insurance, and settlement services for Tysons Corner, McLean, and Fairfax County transactions.",
      },
      "title-company-bethesda-md": {
        title: "Bethesda MD Title Company | Settlement & Escrow Services | Pruitt Title",
        description: "Need a title company in Bethesda, MD? We offer fast, reliable settlement, escrow, and title insurance services for buyers, sellers, and realtors. Get your free title quote online in minutes.",
        ogTitle: "Bethesda MD Title Company | Settlement & Escrow Services | Pruitt Title",
        ogDescription: "Fast, reliable settlement, escrow, and title insurance services across Bethesda-Chevy Chase and Montgomery County. Free title quote in minutes.",
      },
      "title-company-reston-va": {
        title: "title company reston va Closing Services | Pruitt Title",
        description: "Reston title company for title insurance, escrow, and closings, with 17+ years serving Fairfax County. Request a fast Pruitt Title quote today.",
        ogTitle: "Reston VA Title Company & Closing Services | Pruitt Title",
        ogDescription: "Title insurance, escrow, and closing services in Reston and Fairfax County.",
      },
      "title-company-mclean-va": {
        title: "title company mclean va Closing Services | Pruitt Title",
        description: "McLean title company for title insurance, escrow, and closings, with 17+ years serving Fairfax County. Request a fast Pruitt Title quote today.",
        ogTitle: "McLean VA Title Company & Closing Services | Pruitt Title",
        ogDescription: "Title insurance, escrow, and closing services in McLean and Fairfax County.",
      },
      "title-company-springfield-va": {
        title: "title company springfield va Closings | Pruitt Title",
        description: "Springfield title company for title insurance, escrow, and closings, with 17+ years serving Fairfax County. Request a fast Pruitt Title quote.",
        ogTitle: "Springfield VA Title Company | DMV Title Guy",
        ogDescription: "Professional title insurance and closing services in Springfield, VA. Residential, commercial & investor closings. Since 2007.",
      },
      "title-company-falls-church-va": {
        title: "title company falls church va Closings | Pruitt Title",
        description: "Falls Church title company for title insurance, escrow, and closings, backed by 17+ years serving Fairfax County. Request a fast quote today.",
        ogTitle: "Falls Church VA Title Company & Closings | Pruitt Title",
        ogDescription: "Title insurance, escrow, and closing services in Falls Church and nearby Fairfax County.",
      },
      "title-company-stafford-va": {
        title: "title and escrow stafford va Closings | Pruitt Title",
        description: "Stafford title and escrow services for buyers, sellers, agents, and investors. Local closing support from Pruitt Title. Request a quote today.",
        ogTitle: "Stafford VA Title and Escrow Closings | Pruitt Title",
        ogDescription: "Title and escrow services for Stafford buyers, sellers, agents, and investors.",
      },
      "title-company-woodbridge-va": {
        title: "title company woodbridge va Closings | Pruitt Title",
        description: "Woodbridge title company for title insurance, escrow, and closings across Prince William County. Pruitt Title makes settlement simple. Call today.",
        ogTitle: "Woodbridge VA Title Company & Closings | Pruitt Title",
        ogDescription: "Title insurance, escrow, and closing services in Woodbridge and Prince William County.",
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
          description: `Local title and settlement services in ${locationName}. Order a title search or start your closing with Pruitt Title LLC.`,
        },
      };
    }

    return {
      title: `Title & Closing Services in ${locationName} | DMV Title Guy`,
      description: `Trusted title & settlement services in ${locationName}. 17+ years serving ${countyLabel} buyers, sellers & investors. Fast, reliable closings. Free quote: (703) 859-1467.`,
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
    description: `DMV Title Guy — Pruitt Title LLC provides title insurance and closing services throughout ${fullName}. Call (703) 859-1467.`,
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
  const stateFullName = state === "VA" ? "Virginia" : state === "MD" ? "Maryland" : "Washington DC";
  const locationName = getLocationDisplayName(location);
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
    "Remote Online Notarization (RON)",
  ];

  const PROCESS_STEPS = [
    { step: "1", title: "Open Order", desc: "Submit your purchase contract or refinance details. We'll confirm receipt within hours." },
    { step: "2", title: "Title Search", desc: "We examine public records going back 50+ years to ensure clear, marketable title." },
    { step: "3", title: "Title Commitment", desc: "You receive a full title commitment with all conditions and coverage details." },
    { step: "4", title: "Clear to Close", desc: "We coordinate lender, buyer, seller, and agent schedules for a smooth settlement." },
    { step: "5", title: "Settlement", desc: "Documents signed, funds disbursed, deed recorded. Keys delivered." },
  ];

  return (
    <>
      <LocationSchema city={city} state={state} county={county} slug={slug} description={`Professional title insurance and closing services in ${locationName} — Pruitt Title LLC.`} />
      {isBethesda && <BethesdaStructuredData />}
      {isTysons && <TysonsStructuredData />}
      {slug === "title-company-herndon-va" && <HerndonStructuredData />}

      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">{locationName}</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
              {stateFullName} Title Insurance
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {slug === "title-company-herndon-va"
                ? "Herndon VA Title Closings"
                : isTysons
                ? "Tysons VA Title Closings & Settlement Services"
                : slug === "title-company-bethesda-md"
                ? "Bethesda-Chevy Chase MD Title Company & Escrow Services"
                : isNeighborhood
                ? `Title Company in ${locationName}`
                : "Reliable Title & Settlement Services"}
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              {slug === "title-company-herndon-va"
                ? "Need title closings in Herndon? Pruitt Title handles Herndon title services, title insurance, escrow, settlement, and online title search orders for buyers, sellers, agents, lenders, and investors across Fairfax County."
                : isNeighborhood && parentLocation
                ? `Pruitt Title LLC provides title search, title insurance, escrow, and settlement services for ${city} and nearby ${parentLocation.city} neighborhoods.`
                : isSecondary
                ? `Pruitt Title LLC — professional title insurance and closing services in ${locationName}. Residential, commercial, and all transaction types.`
                : `DMV Title Guy is your trusted title and settlement partner in ${locationName}. Fast, reliable closings for agents, lenders, and investors across ${county}.`}
            </p>
            <div className="flex flex-wrap gap-3">
              {hasCheckoutCta ? (
                <TitleSearchOrderButton className="btn-primary" />
              ) : (
                <Link href="/calculators/title-quote" className="btn-primary">Get a Free Quote →</Link>
              )}
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">
                📞 (703) 859-1467
              </a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact location={`location-${slug}`} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">What We Offer</p>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Title Services in {locationName}</h2>
              <p className="text-brand-muted mb-6">
                Pruitt Title LLC has been serving the {stateFullName} real estate market since 2007. Our team handles every aspect of the title and settlement process — from search to closing — so your transaction closes on time, every time.
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {SERVICES_LIST.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-brand-dark-text">
                    <span className="text-brand-blue mt-0.5 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div id="quote">
              <LeadCaptureForm title={`Get a Quote — ${locationName}`} location={`location-${slug}-form`} />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue-deep-deep font-semibold mb-2">How It Works</p>
            <h2 className="prose-title">The Closing Process in {city}</h2>
            <p className="prose-subtitle max-w-2xl mx-auto">
              From contract to keys, here&apos;s what to expect when you work with DMV Title Guy in {locationName}.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-brand-action text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-brand-navy text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isBethesda && <BethesdaExpansionSections />}
      {isTysons && <TysonsExpansionSections />}

      {/* ALSO SERVING */}
      {alsoServing && alsoServing.length > 0 && (
        <section className="section-light border-t border-gray-100">
          <div className="container-xl">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Also Serving Communities Near {city}</h2>
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
              <h2 className="text-2xl font-bold text-brand-navy mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {location.faqs.map((faq: FaqItem, i: number) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-brand-navy mb-2">{faq.question}</h3>
                    <p className="text-brand-muted leading-relaxed">{faq.answer}</p>
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
                <p className="text-sm text-brand-muted mb-3">
                  View the parent market page for title services across {parentLocation.city}.
                </p>
                <Link href={`/${parentLocation.slug}`} className="text-sm text-brand-blue-deep hover:underline">
                  {parentLocation.city} Title Services →
                </Link>
              </div>
            ) : countyPage && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">{countyPage.name}</h3>
                <p className="text-sm text-brand-muted mb-3">
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
              <p className="text-sm text-brand-muted mb-3">
                {calculatorCopy}
              </p>
              <Link href={`/${calcSlug}`} className="text-sm text-brand-blue-deep hover:underline">
                {calculatorLinkLabel} →
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-brand-navy mb-3">All Transaction Types</h3>
              <p className="text-sm text-brand-muted mb-3">
                Residential, commercial, refinances, investment properties — we handle every type of closing professionally.
              </p>
              <Link href="/investor-friendly-title-company" className="text-sm text-brand-blue-deep hover:underline">
                Learn More →
              </Link>
            </div>
            {FAIRFAX_TITLE_SEARCH_LINK_SLUGS.has(slug) && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">Fairfax Title Search</h3>
                <p className="text-sm text-brand-muted mb-3">
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
                <p className="text-sm text-brand-muted mb-3">
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
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">{fullName}</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">{stateFullName} Title Insurance</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">Title Company in {fullName}</h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Pruitt Title LLC serves every city and community in {fullName}. Professional title search, title insurance, and settlement services — residential, commercial, and all transaction types.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculators/title-quote" className="btn-primary">Get a Free Quote →</Link>
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">📞 (703) 859-1467</a>
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
            <p className="text-sm uppercase tracking-widest text-brand-blue-deep font-semibold mb-2">Service Coverage</p>
            <h2 className="prose-title">Cities &amp; Communities in {name}</h2>
            <p className="prose-subtitle max-w-xl mx-auto">We provide full-service title and closing services to every community in {fullName}.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {citiesInCounty.map((loc) => (
              <Link key={loc.slug} href={`/${loc.slug}`} className="bg-brand-gray-bg hover:bg-brand-blue hover:text-white border border-gray-200 rounded-lg p-4 text-center transition-colors group">
                <p className="font-semibold text-brand-navy group-hover:text-white">{loc.city}</p>
                <p className="text-xs text-brand-muted group-hover:text-blue-100 mt-1">{loc.tier === 1 ? "Primary Market" : "Service Area"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {state === "VA" && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container-xl max-w-3xl">
            <h2 className="text-xl font-bold text-brand-navy mb-3">Fairfax County Title Support</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
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
            <h2 className="text-3xl font-bold text-white mb-4">Start Your Order in {name}</h2>
            <p className="text-gray-300 mb-4">Contact Will Rapuano at Pruitt Title LLC to open your title order or get a quote for your next transaction in {fullName}.</p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 <a href="tel:+17038591467" className="text-brand-blue">(703) 859-1467</a></p>
              <p>✉️ <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">wrapuano@pruitt-title.com</a></p>
              <p>📍 1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
            </div>
          </div>
          <LeadCaptureForm location={`county-${slug}-form`} />
        </div>
      </section>
    </>
  );
}

// ─── Main Route Handler ────────────────────────────────────────────────────────
export default function SlugPage({ params }: { params: { slug: string } }) {
  // City calculator pages: /closing-costs-arlington-va, etc.
  const cityCalcData = getCityCalcData(params.slug);
  if (cityCalcData) return <CityCalculatorPage data={cityCalcData} />;

  // Location & county pages
  const result = findBySlug(params.slug);
  if (!result) notFound();
  if (result.type === "location") return <LocationPage location={result.data} />;
  return <CountyPage county={result.data} />;
}
