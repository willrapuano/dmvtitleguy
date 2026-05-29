import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Search,
  FileCheck,
  Gavel,
  Clock,
  ChevronDown,
  Phone,
  Scale,
  CircleDollarSign,
  FileWarning,
  Building2,
  Home,
  UserCheck,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Foreclosure Title Review in DC, MD & VA | DMV Title Guy",
  description:
    "Foreclosure title review for DMV investors. We identify surviving liens, judgment debts, and chain-of-title defects unique to foreclosed properties. Call (703) 859-1467.",
  alternates: {
    canonical: "https://dmvtitleguy.io/foreclosure-title-review",
  },
};

const foreclosureRisks = [
  {
    icon: AlertTriangle,
    title: "Surviving Liens",
    desc: "Not all junior liens are extinguished by foreclosure. HOA super-liens, federal tax liens, and certain municipal liens survive the sale and transfer to the new owner.",
  },
  {
    icon: Scale,
    title: "Prior Owner Judgments",
    desc: "Judgment liens recorded against the previous owner may attach to the property. Some judgments survive foreclosure and can follow the property through multiple transfers.",
  },
  {
    icon: Building2,
    title: "HOA Super-Liens",
    desc: "In Virginia, HOA assessment liens for up to 6 months can survive a non-judicial foreclosure. Maryland and DC have their own HOA lien provisions. We check all three.",
  },
  {
    icon: FileWarning,
    title: "Incomplete Recording Chain",
    desc: "Distressed properties often have gaps in the chain of title — missing assignments, unrecorded transfers, and probate issues that don't appear in a basic search.",
  },
  {
    icon: RotateCcw,
    title: "Redemption Period Issues",
    desc: "Some jurisdictions allow the former owner a redemption window after foreclosure. We verify whether the redemption period has expired and your ownership is secure.",
  },
  {
    icon: CircleDollarSign,
    title: "Federal Tax Liens",
    desc: "IRS tax liens have a 120-day right of redemption after foreclosure sale. If a federal tax lien exists, the IRS can reclaim the property during this window.",
  },
];

const reviewCovers = [
  {
    icon: Search,
    title: "Priority Lien Analysis",
    desc: "We identify which liens were extinguished by the foreclosure and which survive — so you know exactly what you're responsible for.",
  },
  {
    icon: Scale,
    title: "Judgment Search",
    desc: "Full judgment search against all prior owners in the chain of title, including district court and circuit court records.",
  },
  {
    icon: CircleDollarSign,
    title: "Tax Lien Verification",
    desc: "Federal, state, and local tax lien status with redemption period analysis and priority determination.",
  },
  {
    icon: Building2,
    title: "HOA Assessment Check",
    desc: "HOA and condo association assessment status, pending liens, and super-lien provisions specific to the jurisdiction.",
  },
  {
    icon: FileCheck,
    title: "Chain of Title Reconstruction",
    desc: "Complete reconstruction of the ownership chain, identifying gaps, missing assignments, and recording defects.",
  },
  {
    icon: RotateCcw,
    title: "Redemption Rights Review",
    desc: "Analysis of applicable redemption periods — including federal tax lien redemption rights — and confirmation of secure ownership.",
  },
];

const whenYouNeed = [
  {
    icon: Gavel,
    title: "After Winning at Auction",
    desc: "You won the bid — now confirm what you actually bought. Our post-auction review identifies surviving liens and clears title for resale or refinance.",
  },
  {
    icon: Home,
    title: "Before Making an Offer on REO",
    desc: "Bank-owned (REO) properties can still carry title defects from the foreclosure. A review before your offer protects your due diligence period.",
  },
  {
    icon: UserCheck,
    title: "Buying from a Wholesaler",
    desc: "If the property was sourced from foreclosure and wholesaled to you, you need to verify the title was properly cleared through the assignment chain.",
  },
  {
    icon: FileCheck,
    title: "Inherited Foreclosure Properties",
    desc: "Inheriting a property that went through foreclosure requires a full title review to confirm the foreclosure was properly conducted and all liens resolved.",
  },
];

const dmvRules = [
  {
    state: "Virginia",
    rule: "Non-judicial foreclosure state. Trustee sales extinguish most junior liens, but HOA super-liens (6 months), federal tax liens, and certain municipal liens survive. No statutory right of redemption for borrowers.",
  },
  {
    state: "Maryland",
    rule: "Judicial foreclosure state. All foreclosures go through the court system, providing more protection but longer timelines. HOA liens follow specific statutory provisions. Federal tax lien redemption rights apply.",
  },
  {
    state: "Washington DC",
    rule: "DC has its own foreclosure process with specific notice requirements and mediation provisions. The city also has unique tenant protection laws that can affect foreclosure properties.",
  },
];

const faqs = [
  {
    q: "What's the difference between a foreclosure title review and a standard title search?",
    a: "A standard title search identifies current liens and encumbrances. A foreclosure title review goes further — it analyzes which liens were extinguished by the foreclosure, which survived, and what you're legally responsible for as the new owner. It's specifically designed for the elevated risks of distressed properties.",
  },
  {
    q: "Can I get title insurance on a foreclosed property?",
    a: "Yes, but the title insurance company will require a clean title search first. Our foreclosure title review identifies exactly what needs to be resolved so you can get insured. Some insurers have specific requirements for post-foreclosure properties — we work with them to satisfy those requirements.",
  },
  {
    q: "What happens if you find surviving liens after I bought at auction?",
    a: "We provide a detailed report of all surviving liens with priority rankings and estimated payoff amounts. You'll know exactly what needs to be cleared and the cost. In some cases, surviving liens can be negotiated down. We advise on the best path forward for each situation.",
  },
  {
    q: "How do foreclosure rules differ between VA, MD, and DC?",
    a: "Virginia uses non-judicial foreclosure (trustee sales), Maryland uses judicial foreclosure (court-supervised), and DC has its own hybrid process with mediation requirements. Each has different lien survival rules, redemption periods, and borrower protections. We're licensed and experienced in all three jurisdictions.",
  },
  {
    q: "Do I need a foreclosure review if the bank already did a title search?",
    a: "The bank's title search protects the bank's interest — not yours. Their search may not flag issues that affect you as the buyer, like HOA super-liens, municipal encumbrances, or redemption period complications. A foreclosure title review is buyer-focused and identifies risks specific to your position.",
  },
];

const relatedPages = [
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/investor-friendly-title-company", label: "Investor-Friendly Title Company" },
  { href: "/investor-due-diligence", label: "Investor Due Diligence" },
  { href: "/upload-contract", label: "Upload Contract" },
  { href: "/request-title-review", label: "Request Title Review" },
];

export default function ForeclosureTitleReviewPage() {
  return (
    <>
      <ServiceSchema
        name="Foreclosure Title Review in DC, MD & VA"
        description="Foreclosure title review for DMV investors. We identify surviving liens, judgment debts, and chain-of-title defects unique to foreclosed properties."
        serviceType="Foreclosure Title Review"
      />
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
            <span className="text-gray-200">Foreclosure Title Review</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Foreclosure Title Review — DMV
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Foreclosed properties carry unique title risks — surviving liens,
            judgment debts, and chain-of-title defects that standard searches
            often miss. Our foreclosure-specific review protects your
            investment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/request-title-review"
              className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2"
            >
              Request Foreclosure Review
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

      {/* FORECLOSURE TITLE RISKS */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            Foreclosure Title Risks
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Foreclosure doesn&apos;t wipe the slate clean. Many liens survive
            the sale — and they become your responsibility the moment you take
            ownership.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foreclosureRisks.map((r) => (
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

      {/* WHAT OUR FORECLOSURE REVIEW COVERS */}
      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            What Our Foreclosure Review Covers
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Our foreclosure title review is specifically designed for the risks
            of distressed properties — going beyond a standard search to identify
            what survived the foreclosure.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewCovers.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <s.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {s.title}
                </h3>
                <p className="text-brand-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHEN YOU NEED A FORECLOSURE REVIEW */}
      <section className="py-16 bg-brand-gray-bg">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            When You Need a Foreclosure Review
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Any transaction involving a foreclosed property — whether you bought
            at auction, from a bank, or through a wholesaler — needs a
            foreclosure-specific title review.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whenYouNeed.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-lg p-6 shadow-sm flex gap-4"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <w.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {w.title}
                  </h3>
                  <p className="text-brand-muted text-sm">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DMV-SPECIFIC FORECLOSURE RULES */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-4xl">
          <h2 className="prose-title text-center mb-4">
            DMV-Specific Foreclosure Rules
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Each jurisdiction in the DMV handles foreclosure differently. We
            know the rules in all three — and we check for the specific risks
            each one creates.
          </p>
          <div className="space-y-6">
            {dmvRules.map((r) => (
              <div
                key={r.state}
                className="bg-brand-gray-bg rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-5 w-5 text-brand-blue" />
                  <h3 className="text-lg font-bold text-brand-navy">
                    {r.state}
                  </h3>
                </div>
                <p className="text-brand-muted text-sm">{r.rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light py-16">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-10">
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
            Don&apos;t Guess on Foreclosure Title
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Start your due diligence, upload a contract, or request a title
            review. We&apos;ll identify the surviving liens and title defects
            before they cost you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/request-title-review"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Request Foreclosure Review
            </Link>
            <Link
              href="/investor-due-diligence"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Start Due Diligence
            </Link>
            <Link
              href="/upload-contract"
              className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10"
            >
              Upload Contract
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
