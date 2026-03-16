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
} from "@/data/locations";

// ─── Static Params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const locationSlugs = ALL_LOCATIONS.map((l) => ({ slug: l.slug }));
  const countySlugs = COUNTIES.map((c) => ({ slug: c.slug }));
  return [...locationSlugs, ...countySlugs];
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = findBySlug(params.slug);
  if (!result) return { title: "Not Found" };

  if (result.type === "location") {
    const { city, state } = result.data;
    return {
      title: `Title Company in ${city}, ${state} | DMV Title Guy`,
      description: `Pruitt Title LLC provides professional title insurance and closing services in ${city}, ${state}. Fast turnarounds, underwritten by First American Title. Call (703) 859-1467.`,
      alternates: { canonical: `/${params.slug}` },
      openGraph: {
        title: `Title Company in ${city}, ${state} | DMV Title Guy`,
        description: `Professional title & closing services in ${city}, ${state} — residential, commercial, and all transaction types.`,
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
    "Owner's Title Insurance (First American)",
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
                ? `Pruitt Title LLC — professional title insurance and closing services in ${city}, ${state}. Residential, commercial, and all transaction types. Underwritten by First American Title.`
                : `DMV Title Guy is your trusted title and settlement partner in ${city}, ${state}. Fast, reliable closings for agents, lenders, and investors across ${county}. Underwritten by First American Title Insurance Company.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${slug}#quote`} className="btn-primary">Get a Free Quote →</Link>
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
              <Link href={`/${slug}#quote`} className="btn-primary">Get a Free Quote →</Link>
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
  const result = findBySlug(params.slug);
  if (!result) notFound();
  if (result.type === "location") return <LocationPage location={result.data} />;
  return <CountyPage county={result.data} />;
}
