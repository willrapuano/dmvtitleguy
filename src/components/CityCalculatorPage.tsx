import Link from "next/link";

import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import type { CityOverrides } from "@/components/ClosingCostCalculator";
import { CityCalculatorSchema } from "@/components/SchemaMarkup";
import {
  CITY_CALCULATOR_DATA,
  getStateCalcSlug,
  getStateFullName,
  getLocationSlug,
  type CityClosingCostData,
} from "@/data/closingCostData";
import { ALL_LOCATIONS, getNearbyCities } from "@/data/locations";

interface Props {
  data: CityClosingCostData;
}

export default function CityCalculatorPage({ data }: Props) {
  const stateLabel = data.state === "DC" ? "DC" : data.state;
  const cityLabel = data.state === "DC" ? "Washington, DC" : `${data.city}, ${stateLabel}`;
  const stateCalcSlug = getStateCalcSlug(data.state);
  const stateFullName = getStateFullName(data.state);
  const locationSlug = getLocationSlug(data.city, data.state);

  // Find matching location for nearby cities
  const matchedLocation = ALL_LOCATIONS.find(
    (l) => l.city === data.city && l.state === data.state
  );
  const nearbyCities = matchedLocation ? getNearbyCities(matchedLocation, 4) : [];

  // Build calculator overrides
  const cityOverrides: CityOverrides = {
    localRecordationTaxRate: data.localRecordationTaxRate,
    countyTransferTaxRate: data.countyTransferTaxRate,
    localTransferTaxRate: data.localTransferTaxRate,
    defaultPrice: data.medianHomePrice,
    defaultLoanAmount: Math.round(data.medianHomePrice * (1 - data.defaultDownPaymentPct / 100)),
    localTaxNote: data.localTaxNote,
  };

  // Get other city calculator pages for cross-linking (same state, max 4)
  const relatedCalcPages = CITY_CALCULATOR_DATA.filter(
    (c) => c.state === data.state && c.slug !== data.slug
  ).slice(0, 4);

  return (
    <>
      <CityCalculatorSchema
        city={data.city}
        state={stateLabel}
        county={data.county}
        slug={data.slug}
        faqs={data.faqs}
      />

      {/* ── HERO ── */}
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${stateCalcSlug}`} className="hover:text-brand-blue">
              {stateFullName} Closing Costs
            </Link>
            <span className="mx-2">/</span>
            <span>{cityLabel}</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
            Free Local Calculator
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Closing Costs in {cityLabel}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">{data.intro}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-brand-blue/20 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              Median Price: ${data.medianHomePrice.toLocaleString()}
            </span>
            <span className="bg-brand-blue/20 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              Est. Range: {data.costRangeText}
            </span>
            <span className="bg-brand-blue/20 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              {data.county}
            </span>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <section className="section-light">
        <div className="container-xl">
          <ClosingCostCalculator state={data.state} cityOverrides={cityOverrides} />
        </div>
      </section>

      {/* ── LOCAL TAX EXPLAINER ── */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">
            Local Taxes &amp; Fees in {cityLabel}
          </h2>
          <div className="text-brand-muted text-sm leading-relaxed space-y-4">
            <p>{data.localTaxExplainer}</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {data.faqs.length > 0 && (
        <section className="section-light">
          <div className="container-xl max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">
              Frequently Asked Questions — {cityLabel} Closing Costs
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-5">
                  <h3 className="font-bold text-brand-dark-text mb-2">{faq.question}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INTERNAL LINKS ── */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Related Resources</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Location page */}
            <Link
              href={`/${locationSlug}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <p className="text-xs text-brand-blue font-semibold uppercase tracking-wide mb-1">Title Services</p>
              <p className="font-bold text-brand-navy text-sm">
                Title Company in {cityLabel}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Full-service title &amp; settlement in {data.city}
              </p>
            </Link>

            {/* State calculator */}
            <Link
              href={`/${stateCalcSlug}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <p className="text-xs text-brand-blue font-semibold uppercase tracking-wide mb-1">Calculator</p>
              <p className="font-bold text-brand-navy text-sm">
                {stateFullName} Closing Cost Calculator
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Statewide rates &amp; fee breakdown
              </p>
            </Link>

            {/* Title insurance guide */}
            <Link
              href="/title-insurance"
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <p className="text-xs text-brand-blue font-semibold uppercase tracking-wide mb-1">Guide</p>
              <p className="font-bold text-brand-navy text-sm">
                Title Insurance Explained
              </p>
              <p className="text-xs text-brand-muted mt-1">
                What it covers, costs, and why you need it
              </p>
            </Link>
          </div>

          {/* Nearby city calculators */}
          {relatedCalcPages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                Closing Costs in Nearby {stateFullName} Cities
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {relatedCalcPages.map((c) => {
                  const label = c.state === "DC" ? "Washington, DC" : `${c.city}, ${c.state}`;
                  return (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      className="text-sm text-brand-blue hover:underline border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors"
                    >
                      Closing Costs: {label} →
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby location pages */}
          {nearbyCities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                Title Services in Nearby Cities
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {nearbyCities.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${loc.slug}`}
                    className="text-sm text-brand-blue hover:underline border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors"
                  >
                    {loc.city}, {loc.state} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-navy text-white py-10">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Need a Precise Closing Cost Estimate?</h2>
            <p className="text-gray-300 text-sm max-w-xl">
              These are estimates based on standard {data.county} rates. Every transaction is different —
              contact Will Rapuano at Pruitt Title LLC for an accurate, line-by-line closing cost
              breakdown for your {cityLabel} property.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/calculators/title-quote" className="btn-primary whitespace-nowrap">
              Get a Real Quote
            </Link>
            <a
              href="tel:+17038591467"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy whitespace-nowrap"
            >
              (703) 859-1467
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
