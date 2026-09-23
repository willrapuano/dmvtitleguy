"use client";

import Link from "next/link";
import Image from "next/image";

const AUDIENCE_CARDS = [
  { role: "For Buyers & Sellers", desc: "Clear title work, responsive communication, and smoother purchase, sale, and refinance closings across the DMV.", icon: "Home", href: "/calculators/title-quote" },
  { role: "For Realtors", desc: "Faster communication, fewer closing surprises, and a better client experience from contract to settlement.", icon: "Handshake", href: "/title-company-for-realtors" },
  { role: "For Lenders", desc: "Reliable coordination, cleaner files, and dependable settlement support for your active pipeline.", icon: "Landmark", href: "/title-company-for-lenders" },
  { role: "For Builders", desc: "Repeatable closing support for new construction, buyer coordination, and pipeline-ready settlement execution.", icon: "Hammer", href: "/title-company-for-builders" },
  { role: "For Banks & Credit Unions", desc: "Educational title and closing resources plus a path to request an independent provider introduction.", icon: "Building2", href: "/title-company-for-credit-unions" },
];

const MONEY_PAGES = [
  { label: "Title Quote", href: "/calculators/title-quote", detail: "Start with a fast closing cost estimate." },
  { label: "Title Company in Bethesda, MD", href: "/title-company-bethesda-md", detail: "Montgomery County title and settlement support." },
  { label: "Closing Costs in Maryland", href: "/maryland-closing-cost-calculator", detail: "Estimate what buyers and sellers should expect." },
  { label: "Title Company for Realtors", href: "/title-company-for-realtors", detail: "Routing for agent-focused closing support." },
  { label: "Title Company for Builders", href: "/title-company-for-builders", detail: "New construction and builder pipeline support." },
  { label: "Washington DC Title Company", href: "/title-company-washington-dc", detail: "Title, escrow, and settlement support in DC." },
];

type ServiceAreaGroup = {
  heading: string;
  links: { label: string; href: string }[];
};

type ServiceAreaColumn = {
  title: string;
  description: string;
  groups: ServiceAreaGroup[];
};

const SERVICE_AREAS: ServiceAreaColumn[] = [
  {
    title: "Virginia Title & Escrow Services",
    description: "Professional title insurance, escrow, and closing services throughout Northern Virginia.",
    groups: [
      {
        heading: "Arlington County, VA",
        links: [
          { label: "Arlington, VA", href: "/title-company-arlington-va" },
          { label: "Ballston, VA", href: "/title-company-ballston-va" },
          { label: "Clarendon, VA", href: "/title-company-clarendon-va" },
          { label: "Rosslyn, VA", href: "/title-company-rosslyn-va" },
          { label: "Crystal City, VA", href: "/title-company-crystal-city-va" },
          { label: "Pentagon City, VA", href: "/title-company-pentagon-city-va" },
          { label: "Courthouse, VA", href: "/title-company-courthouse-va" },
          { label: "Shirlington, VA", href: "/title-company-shirlington-va" },
          { label: "Virginia Square, VA", href: "/title-company-virginia-square-va" },
        ],
      },
      {
        heading: "City of Alexandria, VA",
        links: [
          { label: "Alexandria, VA", href: "/title-company-alexandria-va" },
          { label: "Old Town, VA", href: "/title-company-old-town-alexandria-va" },
          { label: "Del Ray, VA", href: "/title-company-del-ray-alexandria-va" },
          { label: "Carlyle, VA", href: "/title-company-carlyle-alexandria-va" },
          { label: "Eisenhower, VA", href: "/title-company-eisenhower-alexandria-va" },
        ],
      },
      {
        heading: "Fairfax County, VA",
        links: [
          { label: "Fairfax, VA", href: "/title-search-fairfax-va" },
          { label: "Falls Church, VA", href: "/title-company-falls-church-va" },
          { label: "McLean, VA", href: "/title-company-mclean-va" },
          { label: "Vienna, VA", href: "/title-search-vienna-va" },
          { label: "Reston, VA", href: "/title-company-reston-va" },
          { label: "Herndon, VA", href: "/title-company-herndon-va" },
          { label: "Great Falls, VA", href: "/title-company-great-falls-va" },
          { label: "Centreville, VA", href: "/title-company-centreville-va" },
          { label: "Chantilly, VA", href: "/title-company-chantilly-va" },
          { label: "Burke, VA", href: "/title-company-burke-va" },
          { label: "Springfield, VA", href: "/title-company-springfield-va" },
          { label: "Annandale, VA", href: "/title-company-annandale-va" },
        ],
      },
      {
        heading: "Loudoun County, VA",
        links: [
          { label: "Ashburn, VA", href: "/title-company-ashburn-va" },
          { label: "Leesburg, VA", href: "/title-company-leesburg-va" },
          { label: "Sterling, VA", href: "/title-company-sterling-va" },
          { label: "South Riding, VA", href: "/title-company-south-riding-va" },
          { label: "Brambleton, VA", href: "/title-company-brambleton-va" },
          { label: "Purcellville, VA", href: "/title-company-purcellville-va" },
          { label: "Middleburg, VA", href: "/title-company-middleburg-va" },
          { label: "Aldie, VA", href: "/title-company-middleburg-va" },
        ],
      },
      {
        heading: "Prince William County, VA",
        links: [
          { label: "Woodbridge, VA", href: "/title-company-woodbridge-va" },
          { label: "Dale City, VA", href: "/title-company-woodbridge-va" },
          { label: "Lake Ridge, VA", href: "/title-company-woodbridge-va" },
          { label: "Dumfries, VA", href: "/title-company-woodbridge-va" },
          { label: "Gainesville, VA", href: "/title-company-gainesville-va" },
          { label: "Haymarket, VA", href: "/title-company-haymarket-va" },
          { label: "Bristow, VA", href: "/title-company-bristow-va" },
          { label: "Occoquan, VA", href: "/title-company-woodbridge-va" },
        ],
      },
      {
        heading: "Stafford County & Fredericksburg Area",
        links: [
          { label: "Stafford, VA", href: "/title-company-stafford-va" },
          { label: "Fredericksburg, VA", href: "/title-company-fredericksburg-va" },
          { label: "Spotsylvania, VA", href: "/title-company-spotsylvania-va" },
        ],
      },
    ],
  },
  {
    title: "Maryland Title & Escrow Services",
    description: "Settlement and title support throughout Montgomery County and Prince George's County.",
    groups: [
      {
        heading: "Montgomery County, MD",
        links: [
          { label: "Bethesda, MD", href: "/title-company-bethesda-md" },
          { label: "Rockville, MD", href: "/title-company-rockville-md" },
          { label: "Silver Spring, MD", href: "/title-company-silver-spring-md" },
          { label: "Gaithersburg, MD", href: "/title-company-gaithersburg-md" },
          { label: "Germantown, MD", href: "/title-company-germantown-md" },
          { label: "Potomac, MD", href: "/title-company-potomac-md" },
          { label: "Chevy Chase, MD", href: "/title-company-bethesda-md" },
          { label: "Kensington, MD", href: "/title-company-silver-spring-md" },
          { label: "Olney, MD", href: "/title-company-gaithersburg-md" },
          { label: "North Potomac, MD", href: "/title-company-potomac-md" },
        ],
      },
      {
        heading: "Prince George's County, MD",
        links: [
          { label: "Bowie, MD", href: "/title-company-bowie-md" },
          { label: "College Park, MD", href: "/title-company-college-park-md" },
          { label: "Greenbelt, MD", href: "/title-company-hyattsville-md" },
          { label: "Hyattsville, MD", href: "/title-company-hyattsville-md" },
          { label: "Laurel, MD", href: "/title-company-laurel-md" },
          { label: "Upper Marlboro, MD", href: "/title-company-upper-marlboro-md" },
          { label: "Fort Washington, MD", href: "/title-company-bowie-md" },
          { label: "Clinton, MD", href: "/title-company-bowie-md" },
        ],
      },
    ],
  },
  {
    title: "Washington DC Title & Escrow Services",
    description: "Title insurance, escrow, and settlement services throughout Washington DC.",
    groups: [
      {
        heading: "Washington DC",
        links: [
          { label: "Washington DC", href: "/title-company-washington-dc" },
          { label: "Georgetown, DC", href: "/title-company-washington-dc" },
          { label: "Capitol Hill, DC", href: "/title-company-washington-dc" },
          { label: "Navy Yard, DC", href: "/title-company-washington-dc" },
          { label: "Dupont Circle, DC", href: "/title-company-washington-dc" },
          { label: "Logan Circle, DC", href: "/title-company-washington-dc" },
          { label: "Adams Morgan, DC", href: "/title-company-washington-dc" },
          { label: "Shaw, DC", href: "/title-company-washington-dc" },
          { label: "Columbia Heights, DC", href: "/title-company-washington-dc" },
          { label: "Brookland, DC", href: "/title-company-washington-dc" },
        ],
      },
    ],
  },
];

export interface HomeGuide {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
}

/* Capital Standard homepage (Paper: "DMV Title Guy — Website Design Options",
   page "Sep 2026 — Live vs Refresh"). Hero, a navy "what do you need" band,
   the latest guides, Will, and a closing call to action. The H1 wording is held
   until the SEO freeze's September 30 decision. The service, role and area
   links stay at the foot of the page as an index: they are internal links to
   pages that rank, and removing them is a separate SEO decision. */
export function HomePageClient({ latestGuides = [] }: { latestGuides?: HomeGuide[] }) {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-brand-line bg-white">
        <div className="grid lg:min-h-[680px] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div className="flex flex-col justify-center px-5 py-14 sm:px-8 lg:py-20 lg:pl-[max(2rem,calc((100vw-1296px)/2+1.5rem))] lg:pr-16">
            <p className="mb-7 flex items-center gap-3.5 text-[13px] font-bold uppercase tracking-[0.14em] text-brand-ink">
              <span aria-hidden="true" className="h-0.5 w-9 shrink-0 bg-brand-brass" />
              DC · Maryland · Virginia
            </p>
            <h1 className="max-w-[15ch] font-display text-[2.75rem] font-medium leading-[1.03] tracking-[-0.025em] text-brand-navy sm:text-6xl lg:text-[4.75rem]">
              Practical title guidance for DC, Maryland, and Virginia real estate.
            </h1>
            <p className="mt-7 max-w-[56ch] text-lg leading-[1.65] text-brand-ink md:text-[19px]">
              Independent educational guidance from Will Rapuano. Use local guides and calculators to understand the next step. When you need a provider, ask Will for an introduction; the provider independently confirms acceptance, scope, and terms.
            </p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Link href="/calculators/title-quote" className="btn-primary px-7 py-4 text-base">
                Estimate Title Costs <span aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-outline px-7 py-4 text-base">
                Request an Introduction
              </Link>
            </div>
          </div>

          <div className="relative min-h-[340px] sm:min-h-[460px] lg:min-h-0">
            <Image
              src="/home-dc-rowhouses.jpg"
              alt="Porch-front rowhouses in Washington, DC, with a District of Columbia flag hanging on the front"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 bg-brand-navy px-6 py-[18px]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-brass">Photographed in</p>
              <p className="mt-1 font-display text-[22px] font-medium text-white">Washington, DC</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT DO YOU NEED ─────────────────────────────────────── */}
      <section className="bg-brand-navy text-white">
        <div className="mx-auto grid max-w-[1296px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[300px_1fr_1fr_1fr] lg:gap-0 lg:px-6">
          <div className="lg:pr-10">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-brass">Start here</p>
            <h2 className="mt-2.5 font-display text-4xl font-medium leading-[1.1] tracking-[-0.015em] text-white lg:text-[40px]">
              What do you need today?
            </h2>
          </div>
          {[
            { h: "A number", d: "Title premium, transfer and recordation taxes, and settlement fees for your price and county.", cta: "Open the calculator", href: "/calculators/title-quote" },
            { h: "An explanation", d: "Contracts, title insurance and closing costs, explained state by state with the statute cited.", cta: "Browse the guides", href: "/blog" },
            { h: "A person", d: "Ask Will about a specific transaction, or request an introduction to a provider.", cta: "Contact Will", href: "/contact" },
          ].map((item) => (
            <Link key={item.h} href={item.href} className="group flex flex-col gap-3 border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:px-9 lg:pt-0">
              <span className="font-display text-[26px] font-medium text-white">{item.h}</span>
              <span className="text-base leading-relaxed text-brand-blue-100">{item.d}</span>
              <span className="pt-1.5 text-[15px] font-bold text-brand-brass group-hover:underline">{item.cta} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LATEST GUIDES ────────────────────────────────────────── */}
      {latestGuides.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1296px] px-5 py-20 sm:px-8 lg:px-6 lg:py-24">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-medium tracking-[-0.02em] text-brand-navy md:text-[52px] md:leading-[1.08]">Latest guides</h2>
              <Link href="/blog" className="shrink-0 border-b-2 border-brand-brass pb-1 text-[15px] font-bold text-brand-navy">
                All guides <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-11 grid gap-10 md:grid-cols-3 md:gap-8">
              {latestGuides.map((guide) => (
                <Link key={guide.slug} href={`/blog/${guide.slug}`} className="group flex flex-col gap-4">
                  <div className="relative aspect-[3/2] overflow-hidden bg-brand-gray-bg">
                    <Image src={guide.image} alt="" fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-muted">{guide.category}</span>
                  <span className="font-display text-[26px] font-medium leading-[1.2] tracking-[-0.01em] text-brand-navy group-hover:underline group-hover:decoration-brand-brass group-hover:decoration-2 group-hover:underline-offset-4">{guide.title}</span>
                  <span className="text-[15px] text-brand-muted">{guide.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MEET WILL ────────────────────────────────────────────── */}
      <section className="border-t border-brand-line bg-white">
        <div className="mx-auto grid max-w-[1296px] items-end gap-10 px-5 pt-16 sm:px-8 lg:grid-cols-[1fr_480px] lg:gap-14 lg:px-6">
          <div className="pb-4 lg:pb-20 lg:pt-8">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-muted">Who writes these</p>
            <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-brand-navy md:text-[56px]">
              Hi, I&apos;m Will. I&apos;d rather you ask now than find out at the closing table.
            </h2>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-brand-ink">
              Founder of DMV Title Guy · Marketing and Business Development Officer at Pruitt Title LLC
            </p>
            <p className="mt-5 max-w-[62ch] text-lg leading-[1.65] text-brand-ink">
              Will Rapuano created and operates DMV Title Guy to publish useful title resources and build direct relationships with real estate professionals and consumers. Eligible transaction requests may be referred to Pruitt Title LLC for independent review; Pruitt confirms whether it accepts the request and the applicable scope, pricing, terms, and disclosures.
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">Call</p>
                <a href="tel:+17038591467" className="mt-1 block font-display text-2xl font-medium text-brand-navy hover:underline">(703) 859-1467</a>
              </div>
              <Link href="/about-will-rapuano" className="border-b-2 border-brand-brass pb-1 text-[15px] font-bold text-brand-navy">
                About Will &amp; DMV Title Guy <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto h-[520px] w-full max-w-[440px] overflow-hidden lg:h-[600px] lg:max-w-none">
            <Image
              src="/will-rapuano-headshot.jpg"
              alt="Will Rapuano, Pruitt Title LLC"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover object-[50%_58%] [transform:scale(1.28)] [transform-origin:50%_62%]"
            />
          </div>
        </div>
      </section>

      {/* ── PAGE INDEX (internal links kept for SEO) ─────────────── */}
      <section className="border-t border-brand-line bg-brand-gray-bg">
        <div className="mx-auto grid max-w-[1296px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr_2fr] lg:px-6">
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-navy">Title quotes and services</h2>
            <ul className="mt-5 space-y-3">
              {MONEY_PAGES.map((item) => (
                <li key={item.href + item.label}><Link href={item.href} className="text-[15px] text-brand-ink hover:text-brand-navy hover:underline">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-navy">By role</h2>
            <ul className="mt-5 space-y-3">
              {AUDIENCE_CARDS.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-[15px] text-brand-ink hover:text-brand-navy hover:underline">{item.role}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-navy">By area</h2>
            <div className="mt-5 space-y-5">
              {SERVICE_AREAS.map((area) => (
                <div key={area.title}>
                  {area.groups.map((group) => (
                    <p key={group.heading} className="text-[15px] leading-7 text-brand-ink">
                      <span className="font-bold text-brand-navy">{group.heading}: </span>
                      {group.links.map((link, i) => (
                        <span key={link.label}>
                          <Link href={link.href} className="hover:text-brand-navy hover:underline">{link.label}</Link>
                          {i < group.links.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
