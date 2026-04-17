import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Falls Church VA | Settlement & Title Services",
  description: "Pruitt Title LLC provides expert title and settlement services in Falls Church, VA. Fast closings, competitive rates, and local expertise since 2007.",
  alternates: { canonical: "/title-company/falls-church-va" },
};

const faqs = [
  {
    question: "What makes Falls Church different from other Northern Virginia markets?",
    answer: "Falls Church is an independent city, separate from Fairfax County, with its own municipal government and recording system. The city has a small-town feel with excellent schools and a median home price around $650,000, making it highly desirable for families.",
  },
  {
    question: "How much are closing costs in Falls Church?",
    answer: "Closing costs in Falls Church follow Virginia's standard structure. Buyers can expect to pay 2-5% of the purchase price, including recordation taxes and title insurance. Sellers pay the grantor tax ($0.50 per $500 of sales price) and any outstanding liens.",
  },
  {
    question: "Does Falls Church have additional local transfer taxes?",
    answer: "Falls Church has a relatively low additional tax burden compared to neighboring jurisdictions. The primary costs are the state grantor tax (seller) and state recordation tax (buyer), with minimal local add-ons.",
  },
  {
    question: "How long does it take to close in Falls Church?",
    answer: "Standard residential closings in Falls Church typically complete within 30-45 days. The city's smaller, more manageable volume often allows for smoother, faster transactions compared to larger jurisdictions.",
  },
  {
    question: "What title issues are common in Falls Church?",
    answer: "Falls Church's mix of mid-century homes and newer construction means title issues vary. Older homes may have boundary disputes or easement agreements, while newer properties typically have cleaner titles.",
  },
  {
    question: "Can I use RON for my Falls Church closing?",
    answer: "Yes, Remote Online Notarization is available for all Falls Church transactions. This is especially convenient for busy families who struggle to find time for traditional in-person closings.",
  },
];

export default function FallsChurchTitlePage() {
  return (
    <>
      <LocationSchema 
        city="Falls Church" 
        state="VA" 
        county="Falls Church City" 
        slug="title-company/falls-church-va"
        description="Pruitt Title LLC provides expert title and settlement services in Falls Church, VA. Fast closings, competitive rates, and local expertise since 2007."
      />

      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/virginia" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Falls Church</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Title Company Falls Church VA | Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC is proud to serve the Falls Church community. Our local expertise and personalized service make us the trusted choice for homeowners and real estate professionals in this unique Northern Virginia city.
          </p>
        </div>
      </section>

      <ClosingCostCalculator state="VA" />

      {/* LOCAL INSIGHT */}
      <section className="py-8 bg-brand-blue text-white">
        <div className="container-xl max-w-3xl">
          <p className="text-lg font-medium">
            <span className="text-brand-light-blue">💡 Local Insight:</span> Falls Church City is one of the DC area's best-kept secrets for families—top-rated schools and a small-town vibe with median prices around $650K. Our local team's direct access to city records means faster turn times than the larger counties.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Why Falls Church Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Falls Church City is one of Virginia's smallest independent cities, but it packs a punch. With highly-rated schools, a charming downtown, and excellent location between Arlington and Fairfax, Falls Church attracts families seeking quality education and community atmosphere.
            </p>
            <p>
              The median home price in Falls Church exceeds $600,000, with a mix of charming mid-century homes, new construction, and duplexes. The city's smaller size often means faster title searches and smoother closings, but properties can still have unique title considerations—particularly older homes that may have been through multiple owners or estate transfers.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Title Services in Falls Church</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600">Efficient title searches through Falls Church city records.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600">Comprehensive owner's title insurance to protect your investment.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600">ALTA policies for all major lenders in Northern Virginia.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600">Full-service closings from contract to recorded deed delivery.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Refinance Closings</h3>
              <p className="text-gray-600">Streamlined refinance settlements with quick turn times.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600">RON available for flexible signing options.</p>
            </div>
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
            <Link href="/title-company/alexandria-va" className="text-brand-blue hover:underline">
              Alexandria Title Services →
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
          <h2 className="text-3xl font-bold text-white mb-4">Get Your Falls Church Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Falls Church property.
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