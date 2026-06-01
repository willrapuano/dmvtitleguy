import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Alexandria VA | Settlement & Title Services",
  description: "Pruitt Title LLC provides expert title and settlement services in Alexandria, VA. Fast closings, competitive rates, and local expertise since 2007.",
  alternates: { canonical: "/title-company/alexandria-va" },
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
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/virginia" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Alexandria</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Title Company Alexandria VA | Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC has been serving Alexandria homeowners and real estate professionals for years. From historic Old Town townhouses to new construction in West End, we understand Alexandria's unique real estate landscape.
          </p>
        </div>
      </section>

      <ClosingCostCalculator state="VA" />

      {/* LOCAL INSIGHT */}
      <section className="py-8 bg-brand-blue text-white">
        <div className="container-xl max-w-3xl">
          <p className="text-lg font-medium">
            <span className="text-brand-light-blue">💡 Local Insight:</span> Alexandria's 270-year history means properties here can have complex, centuries-old title issues. Our team has specific expertise in historic covenants common in Old Town and surrounding neighborhoods.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Why Alexandria Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Alexandria is a unique market in Northern Virginia—an independent city with its own character, separate from Fairfax County. With a median home price around $550,000 and a mix of historic properties, condos, and new construction, Alexandria offers something for every buyer.
            </p>
            <p>
              The city's historic district, dating back to the 1700s, presents unique title considerations. Properties may have historic easements, preservation covenants, or older title issues that require careful research. Meanwhile, the West End andhybla Valley areas offer newer construction with more straightforward titles. Our team handles both with equal expertise.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Title Services in Alexandria</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600">Thorough title research through Alexandria city records and Fairfax County when applicable.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600">Comprehensive owner's title insurance to protect your Alexandria home investment.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600">ALTA policies for all major lenders in the Alexandria market.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600">Complete closing services from contract to recorded deed delivery.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Historic Property Expertise</h3>
              <p className="text-gray-600">Specialized title services for historic homes and properties with older titles.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600">RON available for convenient remote signing options.</p>
            </div>
          </div>
        </div>
      </section>


      {/* INVESTOR SERVICES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Investor Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/investor-title-services" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/investor-due-diligence" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted">Submit property info & start your title search.</p>
            </Link>
          </div>
        </div>
      </section>
      {/* INTERNAL LINKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/closing-costs/virginia" className="text-brand-blue hover:underline">
              Virginia Closing Costs Guide →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue hover:underline">
              Virginia Closing Cost Calculator →
            </Link>
            <Link href="/title-company/arlington-va" className="text-brand-blue hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/fairfax-va" className="text-brand-blue hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/title-company/falls-church-va" className="text-brand-blue hover:underline">
              Falls Church Title Services →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue hover:underline">
              DC Closing Costs →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get Your Alexandria Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Alexandria property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virginia-closing-cost-calculator" className="inline-block bg-brand-blue text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
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
