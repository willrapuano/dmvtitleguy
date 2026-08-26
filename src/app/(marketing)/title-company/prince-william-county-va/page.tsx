import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Prince William County VA | Settlement & Title Services",
  description: "Practical Prince William County title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review.",
  alternates: { canonical: "/title-company/prince-william-county-va" },
};

const faqs = [
  {
    question: "What are the title insurance rates in Prince William County, VA?",
    answer: "Virginia regulates title insurance premiums statewide, including Prince William County. For a $525,000 home—the current median in Prince William—owner's title insurance typically costs $1,500-2,000. The simultaneous issue discount applies when both lender's and owner's policies are purchased together.",
  },
  {
    question: "Who pays transfer taxes in Prince William County?",
    answer: "In Prince William County, sellers pay the Virginia grantor tax ($0.50 per $500 of sales price). Buyers pay the state recordation tax ($0.25 per $100 of the loan or sales price). There is no additional local recordation tax in Prince William County, which helps keep closing costs manageable.",
  },
  {
    question: "How long does it take to close in Prince William County?",
    answer: "Standard residential closings in Prince William County take 30-45 days. Cash transactions can close in 7-14 days. The county's well-organized Circuit Court Clerk's office helps ensure efficient recording once documents are submitted.",
  },
  {
    question: "What documents do I need for a Prince William County closing?",
    answer: "Required documents include government-issued photo ID, proof of homeowners insurance, mortgage commitment letter, and any contract addenda. For properties in HOA communities like Lake Ridge or Braemar, you'll also need HOA resale documents and estoppel letters.",
  },
  {
    question: "What makes Prince William County title work unique?",
    answer: "Prince William County has a mix of older established communities and newer developments, each with different title considerations. Properties near Quantico may have military-related easements, while communities with community development authorities (CDAs) have special tax assessments that must be cleared at closing.",
  },
  {
    question: "Are RON closings available in Prince William County?",
    answer: "Yes, Remote Online Notarization is available for Prince William County transactions. This is convenient for military families affiliated with Quantico who may be relocating or deployed during the closing process.",
  },
];

export default function PrinceWilliamCountyTitlePage() {
  return (
    <>
      <LocationSchema
        city="Prince William County"
        state="VA"
        county="Prince William County"
        slug="title-company/prince-william-county-va"
        description="Practical Prince William County title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review."
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/virginia-closing-cost-calculator" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Prince William County</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Title Company Prince William County VA &mdash; Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC proudly serves Prince William County homeowners and real estate professionals. From Woodbridge to Gainesville, we deliver reliable title and settlement services tailored to this dynamic Northern Virginia market.
          </p>
        </div>
      </section>

      <ClosingCostCalculator state="VA" />

      {/* LOCAL INSIGHT */}
      <section className="bg-brand-action py-10 text-white">
        <div className="container-xl max-w-3xl">
          {/* The label previously used an undefined brand colour utility, so it
              inherited the band's white and carried no emphasis at all. Now an
              eyebrow with a real icon, matching the homepage pattern. */}
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-100">
            <Lightbulb size={14} strokeWidth={2} aria-hidden="true" />
            Local insight
          </p>
          <p className="mt-3 max-w-[68ch] text-lg leading-relaxed">
            Prince William County offers some of the best value in Northern Virginia with a median home price around $525K. But with 15 average days on market, buyers still need a title partner who can move fast. We keep Prince William closings on schedule.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Prince William County Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Prince William County is Northern Virginia's most populous county and one of its most affordable major jurisdictions. With a median home price around $525,000 and homes typically selling in about 15 days, Prince William attracts first-time buyers, growing families, and military personnel stationed at Quantico.
            </p>
            <p className="max-w-[68ch]">
              The county's real estate market is incredibly diverse. Woodbridge and Dale City offer established neighborhoods with mature trees and community amenities. Gainesville and Bristow feature newer construction with modern floor plans. Manassas and Manassas Park provide historic charm with urban conveniences. Each area presents unique title considerations, from HOA covenants in planned communities to historic easements in older districts. Our team's deep knowledge of Prince William County ensures smooth closings no matter the property type.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Prince William County</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Thorough title research through Prince William County Circuit Court records and land records.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive owner's title insurance to protect your Prince William County home investment.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">ALTA policies for all major lenders in the Prince William County market.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Complete closing services from contract to recorded deed and title policy delivery.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">HOA & CDA Expertise</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized handling of HOA and Community Development Authority properties common in Prince William County.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">RON available for military families, remote buyers, and busy professionals.</p>
            </div>
          </div>
        </div>
      </section>


      {/* INVESTOR SERVICES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Investor Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/investor-title-services" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/investor-due-diligence" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Submit property info & start your title search.</p>
            </Link>
          </div>
        </div>
      </section>
      {/* INTERNAL LINKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue-deep hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue-deep hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs Guide →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Cost Calculator →
            </Link>
            <Link href="/title-company/fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/title-company/loudoun-county-va" className="text-brand-blue-deep hover:underline">
              Loudoun County Title Services →
            </Link>
            <Link href="/title-company/arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue-deep hover:underline">
              Alexandria Title Services →
            </Link>
            <Link href="/title-company-falls-church-va" className="text-brand-blue-deep hover:underline">
              Falls Church Title Services →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Prince William County Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Prince William County property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virginia-closing-cost-calculator" className="btn-primary px-8">
              Get a Quote →
            </Link>
            <a href="tel:+15714744000" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Call (571) 474-4000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
