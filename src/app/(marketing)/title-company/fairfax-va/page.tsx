import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Fairfax VA Title & Settlement Services | DMV Title Guy",
  description: "Pruitt Title LLC provides expert title and settlement services in Fairfax, VA. Fast closings, competitive rates, and local expertise since 2007.",
  alternates: { canonical: "/title-company/fairfax-va" },
};

const faqs = [
  {
    question: "What are the title insurance rates in Fairfax County?",
    answer: "Fairfax County follows Virginia's state-regulated title insurance rates. For a $600,000 home, owner's title insurance costs approximately $1,800-2,400. Virginia's simultaneous issue discount saves buyers money when purchasing both lender's and owner's coverage together.",
  },
  {
    question: "Who pays transfer taxes in Fairfax?",
    answer: "In Fairfax County, the grantor tax is paid by the seller ($0.50 per $500 of sales price). The buyer typically pays the state recordation tax ($0.25 per $100) and any applicable local recordation taxes.",
  },
  {
    question: "Can I schedule a weekend closing in Fairfax?",
    answer: "Yes! Pruitt Title offers flexible closing times including evenings and weekends to accommodate busy schedules. We work around your availability to ensure a smooth closing experience.",
  },
  {
    question: "What is the average time to close in Fairfax?",
    answer: "Standard residential closings in Fairfax County typically take 30-45 days. Cash purchases can close faster (7-14 days), while financed purchases depend on lender timelines. We expedite whenever possible.",
  },
  {
    question: "What makes Fairfax title searches unique?",
    answer: "Fairfax County has extensive land records with both current and historical properties. Older homes may have complex title histories including easements, covenants, and prior estate transfers that require thorough research.",
  },
  {
    question: "Does Fairfax County have additional transfer taxes?",
    answer: "Fairfax County adds a local recordation tax to the state rate. The combined state and local recordation tax is approximately $0.35 per $100 of the sales price for buyers, making it important to budget accordingly.",
  },
];

export default function FairfaxTitlePage() {
  return (
    <>
      <LocationSchema 
        city="Fairfax" 
        state="VA" 
        county="Fairfax County" 
        slug="title-company/fairfax-va"
        description="Pruitt Title LLC provides expert title and settlement services in Fairfax, VA. Fast closings, competitive rates, and local expertise since 2007."
      />

      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/virginia" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Fairfax</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Reliable Title &amp; Settlement Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC is Fairfax County's trusted name in title services. With deep roots in the community and extensive experience with Fairfax County's unique requirements, we ensure your closing is efficient and stress-free.
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
            Fairfax is Virginia's most populous county—with 1.1M residents, delays here mean bigger risks. Our local team has direct access to Fairfax County land records for 48-hour title turnarounds.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Fairfax Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Fairfax County is the most populous jurisdiction in Virginia and one of the wealthiest counties in America. With a median home price around $650,000 and top-rated schools, Fairfax attracts families and professionals seeking quality of life near Washington DC.
            </p>
            <p className="max-w-[68ch]">
              The Fairfax real estate market is diverse, from starter homes in established neighborhoods to luxury estates in Great Falls and McLean. This variety means title issues can be complex—older properties may have easements, covenants, or heirship concerns that require careful research. Pruitt Title's local expertise catches these issues early, keeping your transaction on track.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Fairfax</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Thorough title research covering Fairfax County land records and court filings.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Protect your investment with comprehensive owner's title insurance coverage.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">ALTA policies for all major lenders operating in Fairfax County.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Full-service closings from contract to recorded deed and title policy delivery.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">New Construction Closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized title services for new construction purchases and builder transactions.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
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
            <Link href="/investor-title-services" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/investor-due-diligence" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
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
            <Link href="/closing-costs/virginia" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs Guide →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Cost Calculator →
            </Link>
            <Link href="/title-company/arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/vienna-va" className="text-brand-blue-deep hover:underline">
              Vienna Title Services →
            </Link>
            <Link href="/title-company/mclean-va" className="text-brand-blue-deep hover:underline">
              McLean Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue-deep hover:underline">
              Alexandria Title Services →
            </Link>
            <Link href="/title-company/falls-church-va" className="text-brand-blue-deep hover:underline">
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
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Fairfax Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Fairfax property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virginia-closing-cost-calculator" className="inline-block bg-brand-action text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
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
