import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Alexandria VA | Settlement & Title Services",
  description: "Pruitt Title LLC provides expert title and settlement services in Alexandria, VA. Fast closings, competitive rates, and local expertise since 2007.",
  alternates: { canonical: "/title-company-alexandria-va" },
};

const faqs = [
  {
    question: "What are the closing costs for Alexandria, VA?",
    answer: "Alexandria follows Virginia's standard closing cost structure. Buyers pay approximately 2-5% of the purchase price in closing costs, including recordation taxes ($0.25 per $100 state rate). Sellers pay the grantor tax ($0.50 per $500) plus any outstanding liens and pro-rated property taxes.",
  },
  {
    question: "How is Alexandria different from other Northern Virginia markets?",
    answer: "Alexandria is an independent city with its own real estate recording system, separate from Fairfax County. Many historic properties in Old Town and surrounding neighborhoods may have older title issues, easements, or historic covenants that require specialized title research.",
  },
  {
    question: "Can I get same-day closing in Alexandria?",
    answer: "Same-day closings are possible in Alexandria for cash purchases or transactions with minimal contingencies. We recommend at least 48 hours for most transactions to ensure all documents are properly prepared and reviewed.",
  },
  {
    question: "What documents do I need for an Alexandria closing?",
    answer: "Required documents include government-issued photo ID, proof of homeowners insurance, mortgage commitment letter, and any addenda to the contract. For historic properties, additional documentation may be required regarding permits or renovations.",
  },
  {
    question: "How do historic covenants affect Alexandria title?",
    answer: "Many Old Town properties have historic covenants and preservation restrictions that run with the land. Our title search specifically identifies these to ensure buyers understand any use restrictions before closing.",
  },
  {
    question: "Are RON closings available in Alexandria?",
    answer: "Yes, Remote Online Notarization is available for Alexandria transactions. This is particularly popular for out-of-state buyers and investors who cannot attend the closing in person.",
  },
];

export default function AlexandriaTitlePage() {
  return (
    <>
      <LocationSchema 
        city="Alexandria" 
        state="VA" 
        county="Alexandria City" 
        slug="title-company/alexandria-va"
        description="Pruitt Title LLC provides expert title and settlement services in Alexandria, VA. Fast closings, competitive rates, and local expertise since 2007."
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/virginia-closing-cost-calculator" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Alexandria</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Title Company Alexandria VA &mdash; Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC has been serving Alexandria homeowners and real estate professionals for years. From historic Old Town townhouses to new construction in West End, we understand Alexandria's unique real estate landscape.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed title="Get an Alexandria TitleCapture Quote" />

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
            Alexandria's 270-year history means properties here can have complex, centuries-old title issues. Our team has specific expertise in historic covenants common in Old Town and surrounding neighborhoods.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Alexandria Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Alexandria is a unique market in Northern Virginia—an independent city with its own character, separate from Fairfax County. With a median home price around $550,000 and a mix of historic properties, condos, and new construction, Alexandria offers something for every buyer.
            </p>
            <p className="max-w-[68ch]">
              The city's historic district, dating back to the 1700s, presents unique title considerations. Properties may have historic easements, preservation covenants, or older title issues that require careful research. Meanwhile, the West End andhybla Valley areas offer newer construction with more straightforward titles. Our team handles both with equal expertise.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Alexandria</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Thorough title research through Alexandria city records and Fairfax County when applicable.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive owner's title insurance to protect your Alexandria home investment.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">ALTA policies for all major lenders in the Alexandria market.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Complete closing services from contract to recorded deed delivery.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Historic Property Expertise</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized title services for historic homes and properties with older titles.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">RON available for convenient remote signing options.</p>
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
            <Link href="/title-company-arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-search-fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
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
          <h2 className="t-h3 text-white mb-4">Get Your Alexandria Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Alexandria property.
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
