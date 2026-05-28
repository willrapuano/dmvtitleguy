import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Search,
  FileCheck,
  Gavel,
  Home,
  Building2,
  Clock,
  ChevronDown,
  Phone,
  Scale,
  Landmark,
  FileWarning,
  FileSearch,
  Ban,
  LinkIcon,
  CircleDollarSign,
  LayoutGrid,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Auction Property Title Search | DMV Title Guy",
  description:
    "Protect your auction bid with a comprehensive title search. We uncover hidden liens, judgment debts, and recording defects before you close. Serving DC, Maryland & Virginia.",
  alternates: {
    canonical: "https://dmvtitleguy.io/auction-property-title-search",
  },
};

const auctionRisks = [
  {
    icon: AlertTriangle,
    title: "Surviving Liens",
    desc: "Not all liens are wiped at foreclosure. Junior liens, HOA super-liens, and federal tax liens can survive the auction and become your responsibility.",
  },
  {
    icon: Scale,
    title: "Judgment Liens",
    desc: "Outstanding judgments against the prior owner may attach to the property and survive the sale — costing you thousands to clear.",
  },
  {
    icon: CircleDollarSign,
    title: "Tax Liens",
    desc: "Federal and state tax liens have priority and often survive foreclosure sales. The IRS has a redemption window that can affect your ownership.",
  },
  {
    icon: FileWarning,
    title: "Recording Defects",
    desc: "Gaps in the chain of title, improperly recorded deeds, and missing assignments are common in distressed properties.",
  },
  {
    icon: LinkIcon,
    title: "Incomplete Chain of Title",
    desc: "Auction properties frequently have missing links in ownership history — unrecorded transfers, estate gaps, and probate issues.",
  },
  {
    icon: Ban,
    title: "HOA & Municipal Liens",
    desc: "HOA super-liens can survive foreclosure in Virginia. Municipal liens for code violations, water bills, and assessments also persist.",
  },
];

const searchIncludes = [
  {
    icon: FileSearch,
    title: "Full Chain of Title",
    desc: "Complete ownership history verified from the current deed back through every transfer, assignment, and conveyance.",
  },
  {
    icon: Search,
    title: "Lien & Judgment Search",
    desc: "All recorded liens, judgments, and encumbrances — including those that may survive the foreclosure sale.",
  },
  {
    icon: CircleDollarSign,
    title: "Tax Status Verification",
    desc: "Property tax status, outstanding tax bills, and any federal or state tax lien recordings.",
  },
  {
    icon: Building2,
    title: "HOA / Condo Review",
    desc: "Assessment status, pending liens, CC&R restrictions, and any super-lien provisions that apply.",
  },
  {
    icon: FileCheck,
    title: "Easement & Restriction Check",
    desc: "Recorded easements, deed restrictions, rights-of-way, and use limitations that affect property value.",
  },
  {
    icon: Landmark,
    title: "Municipal Lien Check",
    desc: "Water/sewer balances, code violation liens, special assessments, and other municipal encumbrances.",
  },
];

const auctionTypes = [
  {
    icon: Gavel,
    title: "Foreclosure Auctions",
    desc: "Trustee sales and judicial foreclosure auctions across DC, Maryland, and Virginia.",
  },
  {
    icon: CircleDollarSign,
    title: "Tax Sales",
    desc: "Tax lien certificate sales and tax deed auctions — with full tax status verification.",
  },
  {
    icon: Home,
    title: "Estate Sales",
    desc: "Properties sold through probate and estate proceedings, with chain-of-title verification through the estate.",
  },
  {
    icon: Building2,
    title: "HUD / REO Properties",
    desc: "Government-owned and bank-owned properties from HUD, Fannie Mae, and private lenders.",
  },
  {
    icon: LayoutGrid,
    title: "Online Auction Platforms",
    desc: "Properties listed on Auction.com, Hubzu, X5, and other online auction platforms.",
  },
];

const faqs = [
  {
    q: "Why do auction properties need a special title search?",
    a: "Auction properties carry elevated title risk because distressed properties often have unresolved liens, judgments, and recording gaps that don't appear in a standard search. Many liens survive the foreclosure sale — meaning you inherit the debt. A specialized auction title search identifies these risks before you bid.",
  },
  {
    q: "Should I get a title search before or after the auction?",
    a: "Ideally, both. A pre-auction search helps you decide whether to bid and at what price. A post-auction search confirms what you're dealing with and what needs to be cleared before you can sell or refinance. If you can only do one, pre-auction is more valuable — it can save you from a bad purchase.",
  },
  {
    q: "What liens survive a foreclosure sale in Virginia?",
    a: "In Virginia (a non-judicial foreclosure state), federal tax liens, HOA super-liens (up to 6 months of assessments), and certain municipal liens can survive the trustee's sale. This is different from Maryland's judicial foreclosure process. We check for all surviving liens specific to the jurisdiction.",
  },
  {
    q: "How fast can you complete an auction title search?",
    a: "Pre-auction searches are typically completed in 3–5 business days. Rush service is available for 1–2 day turnaround when auction deadlines are tight. Post-auction due diligence follows our standard 5–7 day timeline.",
  },
  {
    q: "Can I still get title insurance on an auction property?",
    a: "In most cases, yes — once title is cleared of defects. Title insurance companies require a clean title search before issuing a policy. Our search identifies exactly what needs to be resolved so you can get insured and protect your investment.",
  },
];

const relatedPages = [
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/investor-friendly-title-company", label: "Investor-Friendly Title Company" },
  { href: "/investor-due-diligence", label: "Investor Due Diligence" },
  { href: "/upload-contract", label: "Upload Contract" },
  { href: "/request-title-review", label: "Request Title Review" },
  { href: "/title-company/arlington-va", label: "Arlington, VA" },
  { href: "/title-company/fairfax-va", label: "Fairfax, VA" },
  { href: "/title-company/alexandria-va", label: "Alexandria, VA" },
  { href: "/title_company/falls-church-va", label: "Falls Church, VA" },
  { href: "/title-company/bethesda-md", label: "Bethesda, MD" },
  { href: "/title-company/silver-spring-md", label: "Silver Spring, MD" },
];

export default function AuctionPropertyTitleSearchPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Auction Property Title Search</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Auction Property Title Search — DMV
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Hidden liens, judgment debts, and recording defects are common in
            auction properties. Our specialized title search uncovers the risks
            before they become your problem — protecting your bid and your
            margin.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/investor-due-diligence"
              className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2"
            >
              Get Auction Title Search
            </Link>
            <a
              href="tel:+17038591467"
              className="btn-outline px-6 py-3 text-base font-semibold inline-flex items-center gap-2 text-white border-white/40 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      {/* WHY AUCTION PROPERTIES NEED SPECIAL TITLE WORK */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            Why Auction Properties Need Special Title Work
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Buying at auction means buying &quot;as-is&quot; — and that includes
            title problems. Many liens survive foreclosure sales. Recording gaps
            are common. The risks are real, and they&apos;re expensive.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionRisks.map((r) => (
              <div key={r.title} className="flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
                  <r.icon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {r.title}
                  </h3>
                  <p className="text-brand-muted text-sm">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT OUR AUCTION TITLE SEARCH INCLUDES */}
      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What Our Auction Title Search Includes
          </h2>
          <p className="text-gray-300 text-center text-lg mb-12 max-w-2xl mx-auto">
            Every auction title search is comprehensive — designed to catch the
            issues that standard searches miss on distressed properties.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchIncludes.map((s) => (
              <div
                key={s.title}
                className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
              >
                <s.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUCTION TYPES WE HANDLE */}
      <section className="py-16 bg-brand-gray-bg">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            Auction Types We Handle
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Every auction type carries different title risks. We know the
            specific issues for each — and we check for all of them.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionTypes.map((t) => (
              <div
                key={t.title}
                className="bg-white rounded-lg p-6 shadow-sm flex gap-4"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <t.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {t.title}
                  </h3>
                  <p className="text-brand-muted text-sm">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE YOU BID */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl text-center">
          <h2 className="prose-title mb-4">Before You Bid</h2>
          <p className="text-brand-muted text-lg mb-6">
            Getting title checked before bidding can save you tens of thousands
            of dollars. Surviving liens, unresolved judgments, and recording
            defects are common on auction properties — and they all become your
            problem the moment you win the bid.
          </p>
          <p className="text-brand-muted mb-8">
            Our pre-auction title search gives you a clear picture of what
            you&apos;re buying — so you can bid with confidence, or walk away
            from a bad deal.
          </p>
          <Link
            href="/investor-due-diligence"
            className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2"
          >
            Get Pre-Auction Title Search
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light py-16">
        <div className="container-xl max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg shadow-sm group"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-brand-navy">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-brand-muted shrink-0 ml-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-brand-muted text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-brand-navy text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Protect Your Auction Bid
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Start your due diligence, upload a contract, or request a title
            review. We&apos;ll identify the risks before they become your
            problem.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/investor-due-diligence"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Start Due Diligence
            </Link>
            <Link
              href="/upload-contract"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Upload Contract
            </Link>
            <Link
              href="/request-title-review"
              className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10"
            >
              Request Title Review
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Prefer to talk? Call us at{" "}
            <a
              href="tel:+17038591467"
              className="text-white font-semibold hover:underline"
            >
              (703) 859-1467
            </a>
          </p>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="py-12 bg-brand-gray-bg">
        <div className="container-xl">
          <h3 className="text-lg font-bold text-brand-navy mb-6">
            Related Pages
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-brand-navy"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
