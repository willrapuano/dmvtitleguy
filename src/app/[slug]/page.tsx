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
import {
  ALL_LOCATIONS,
  COUNTIES,
  findBySlug,
  getNearbyCities,
  getLocationsInCounty,
  getCountyPage,
  CALCULATOR_SLUGS,
  type Location,
  type County,
  type FaqItem,
} from "@/data/locations";
import {
  CITY_CALCULATOR_DATA,
  getCityCalcData,
  getStateFullName,
} from "@/data/closingCostData";

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
    const stateLabel = cityCalcData.state === "DC" ? "DC" : cityCalcData.state;
    const cityLabel = cityCalcData.state === "DC" ? "Washington, DC" : `${cityCalcData.city}, ${stateLabel}`;
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

    // ─── CTR-optimized overrides for high-impression pages ───
    const seoOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDescription?: string }> = {
      "title-company-herndon-va": {
        title: "Herndon Title Company Since 2007 | Pruitt Title — DMV Title Guy",
        description: "Trusted title & settlement services in Herndon, VA. 17+ years serving Fairfax County buyers, sellers & investors. Fast, reliable closings. Free quote: (703) 859-1467.",
        ogTitle: "Herndon Title Company | Pruitt Title — DMV Title Guy",
        ogDescription: "Expert title search, insurance & closing services in Herndon, VA. Residential, commercial & investor transactions. Since 2007.",
      },
      "title-company-vienna-va": {
        title: "Vienna VA Title Company — Trusted Closings Since 2007 | DMV Title Guy",
        description: "Vienna, VA's trusted title settlement company for residential & commercial closings. 17+ years serving Fairfax County. Free title quote: (703) 859-1467.",
        ogTitle: "Vienna VA Title Settlement Company | DMV Title Guy",
        ogDescription: "Professional title search, insurance & settlement services in Vienna, VA. Serving Oakton, McLean & all of Fairfax County since 2007.",
      },
      "title-company-bethesda-md": {
        title: "Bethesda MD Title Settlement Company Since 2007 | DMV Title Guy",
        description: "Bethesda's experienced title & settlement company. Serving Montgomery County buyers, sellers & lenders with fast closings. Get a free quote: (703) 859-1467.",
        ogTitle: "Bethesda MD Title Settlement Company | DMV Title Guy",
        ogDescription: "Expert title settlement services in Bethesda, MD. Residential, commercial & refinance closings across Montgomery County since 2007.",
      },
      "title-company-springfield-va": {
        title: "Springfield VA Title Company | Fast Closings & Title Search",
        description: "Springfield, VA title company trusted by buyers, sellers & investors since 2007. Fast closings, thorough title searches. Free quote: (703) 859-1467.",
        ogTitle: "Springfield VA Title Company | DMV Title Guy",
        ogDescription: "Professional title insurance and closing services in Springfield, VA. Residential, commercial & investor closings. Since 2007.",
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

    return {
      title: `${city} Title Company Since 2007 | Pruitt Title — DMV Title Guy`,
      description: `Trusted title & settlement services in ${city}, ${state}. 17+ years serving ${countyLabel} buyers, sellers & investors. Fast, reliable closings. Free quote: (703) 859-1467.`,
      alternates: { canonical: `/${params.slug}` },
      openGraph: {
        title: `${city} Title Company | Pruitt Title — DMV Title Guy`,
        description: `Expert title search, insurance & closing services in ${city}, ${state}. Residential, commercial & investor transactions. Since 2007.`,
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
  const { city, state, county, slug, tier, alsoServing } = location;
  const nearbyCities = getNearbyCities(location, 3);
  const countyPage = getCountyPage(location);
  const calcSlug = CALCULATOR_SLUGS[state];
  const isSecondary = tier === 2;
  const stateFullName = state === "VA" ? "Virginia" : state === "MD" ? "Maryland" : "Washington DC";

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
      <LocationSchema city={city} state={state} county={county} slug={slug} description={`Professional title insurance and closing services in ${city}, ${state} — Pruitt Title LLC.`} />

      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">{city}, {state}</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
              {stateFullName} Title Insurance
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Title Company in {city}, {state}
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              {isSecondary
                ? `Pruitt Title LLC — professional title insurance and closing services in ${city}, ${state}. Residential, commercial, and all transaction types.`
                : `DMV Title Guy is your trusted title and settlement partner in ${city}, ${state}. Fast, reliable closings for agents, lenders, and investors across ${county}.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculators/title-quote" className="btn-primary">Get a Free Quote →</Link>
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
              <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">What We Offer</p>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Title Services in {city}, {state}</h2>
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
              <LeadCaptureForm title={`Get a Quote — ${city}, ${state}`} location={`location-${slug}-form`} />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">How It Works</p>
            <h2 className="prose-title">The Closing Process in {city}</h2>
            <p className="prose-subtitle max-w-2xl mx-auto">
              From contract to keys, here&apos;s what to expect when you work with DMV Title Guy in {city}, {state}.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-brand-navy text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      {location.faqs && location.faqs.length > 0 && (
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
            {countyPage && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">{countyPage.name}</h3>
                <p className="text-sm text-brand-muted mb-3">
                  View all title services across {countyPage.fullName}.
                </p>
                <Link href={`/${countyPage.slug}`} className="text-sm text-brand-blue hover:underline">
                  {countyPage.name} Title Services →
                </Link>
              </div>
            )}
            {nearbyCities.length > 0 && (
              <div>
                <h3 className="font-bold text-brand-navy mb-3">Nearby Markets</h3>
                <ul className="space-y-2">
                  {nearbyCities.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/${n.slug}`} className="text-sm text-brand-blue hover:underline">
                        Title Company in {n.city}, {n.state} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="font-bold text-brand-navy mb-3">Closing Cost Calculator</h3>
              <p className="text-sm text-brand-muted mb-3">
                Estimate your closing costs in {stateFullName} with our free interactive calculator.
              </p>
              <Link href={`/${calcSlug}`} className="text-sm text-brand-blue hover:underline">
                Use the {stateFullName} Calculator →
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-brand-navy mb-3">All Transaction Types</h3>
              <p className="text-sm text-brand-muted mb-3">
                Residential, commercial, refinances, investment properties — we handle every type of closing professionally.
              </p>
              <Link href="/investor-friendly-title-company" className="text-sm text-brand-blue hover:underline">
                Learn More →
              </Link>
            </div>
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
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Service Coverage</p>
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
