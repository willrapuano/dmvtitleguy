"use client";

import { Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "@/components/SectionHead";

/**
 * Emoji were doing the work of icons here — they render differently on every OS,
 * ignore the palette, and sat oddly beside the serif headings. lucide-react was
 * already a dependency.
 */
const ROLE_ICONS = { Home, Handshake, Landmark, Hammer, Building2 } as const;

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

export function HomePageClient() {
  return (
    <>
      {/* ── SECTION 1: HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(145deg,#fbfcfd_0%,#f3f7fa_62%,#eef5f8_100%)]">
        <div aria-hidden="true" className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-brand-blush/80 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-blue-100/70 blur-3xl" />

        <div className="container-xl relative grid items-center gap-10 py-12 sm:py-16 lg:min-h-[660px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue-deep">
              Independent educational guidance from Will Rapuano for DC, Maryland, and Virginia
            </p>
            <h1 className="t-display max-w-[15ch] text-brand-navy">
              Practical title guidance for DC, Maryland, and Virginia real estate.
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-brand-ink md:text-xl">
              Use local guides and calculators to understand the next step. When you need a provider, ask Will for an introduction; the provider independently confirms acceptance, scope, and terms.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/calculators/title-quote" className="btn-primary px-8 text-center text-base">
                Estimate Title Costs <span aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-outline px-8 text-center text-base">
                Request an Introduction
              </Link>
            </div>
            <ul className="mt-8 hidden flex-wrap gap-2.5 lg:flex" aria-label="Service assurances">
              {["DMV-focused education", "Calculators and local guides", "Direct access to Will"].map((item) => (
                <li key={item} className="trust-chip">
                  <CheckCircle2 size={14} strokeWidth={2} className="text-brand-blue-deep" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/80 bg-brand-blue-50 shadow-[0_36px_90px_-48px_rgba(11,29,58,0.65)] sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[560px] lg:w-[500px]">
              <Image
                src="/hero-bg.jpg"
                alt="Washington Monument framed by cherry blossoms along the Tidal Basin"
                fill
                priority
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="object-cover object-[58%_center]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-brand-navy/80 p-5 text-white shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[285px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-200">Local coverage</p>
                <p className="mt-2 font-display text-xl font-semibold leading-snug">
                  Virginia · Maryland · Washington DC
                </p>
              </div>
            </div>
          </div>

          <ul className="flex flex-wrap gap-2.5 lg:hidden" aria-label="Service assurances">
            {["DMV-focused education", "Calculators and local guides", "Direct access to Will"].map((item) => (
              <li key={item} className="trust-chip">
                <CheckCircle2 size={14} strokeWidth={2} className="text-brand-blue-deep" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SECTION 2: MONEY PAGE ROUTING ──────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <SectionHead
            index="01"
            label="Start here"
            title="Title quotes, closings, and service pages"
            lede="Route directly into the pages that matter most for quotes, closing support, and local title service coverage across Virginia, Maryland, and Washington DC."
          />
          {/* An index, not a card wall: hairline rules and a hanging arrow read as
              a directory, and drop the shadowed-box repetition entirely. */}
          <ul className="mt-12 grid gap-x-12 border-t border-gray-200 sm:grid-cols-2">
            {MONEY_PAGES.map((item) => (
              <li key={item.href} className="border-b border-gray-200">
                <Link href={item.href} className="group flex items-baseline gap-4 py-5">
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold leading-snug text-brand-navy">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block max-w-[58ch] text-sm leading-relaxed text-brand-muted">
                      {item.detail}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-brand-blue-deep"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ─────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          {/* Left-aligned to share an edge with the list below it; a centred
              heading over a left-aligned list was the leftover inconsistency. */}
          <SectionHead
            index="02"
            label="By role"
            title="Routing by transaction partner"
            lede="Choose the closing path that matches your role. These pages route buyers, realtors, lenders, builders, and institutions into the right title, escrow, and settlement support."
          />
          {/**
           * Was five 205px cards of centred text. At that width the descriptions
           * wrapped at 23 characters per line into 5-7 ragged lines each — no
           * icon or typeface choice survives a column that narrow.
           *
           * A ruled list gives the copy the full container width (~60-70 chars)
           * and lets the eye scan role names down a single edge. Rows stack on
           * mobile, where a 5-up grid was collapsing anyway.
           */}
          <ul className="mt-12 border-t border-gray-200">
            {AUDIENCE_CARDS.map((item) => {
              const Icon = ROLE_ICONS[item.icon as keyof typeof ROLE_ICONS];
              const inner = (
                <>
                  <span className="flex items-start gap-3 sm:col-span-4">
                    <Icon
                      size={18}
                      strokeWidth={1.75}
                      className="mt-0.5 shrink-0 text-brand-blue-deep"
                      aria-hidden="true"
                    />
                    <span className="t-h6 text-brand-navy">{item.role}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-brand-muted sm:col-span-7">
                    {item.desc}
                  </span>
                  {item.href && (
                    <span
                      aria-hidden="true"
                      className="hidden text-brand-blue-deep sm:col-span-1 sm:block sm:justify-self-end"
                    >
                      →
                    </span>
                  )}
                </>
              );
              const rowClass =
                "group grid gap-x-8 gap-y-2 border-b border-gray-200 py-5 sm:grid-cols-12 sm:items-baseline";
              return (
                <li key={item.role}>
                  {item.href ? (
                    <Link href={item.href} className={`${rowClass} transition-colors hover:bg-white`}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={rowClass}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── SECTION 3: QUICK START CTA ───────────────────────────── */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="t-h2 text-white mb-4">
            Need to start a closing or get numbers fast?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Start with a title quote, open title for an active transaction, or contact the team for purchase, refinance, and builder closings across the DMV.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/calculators/title-quote" className="btn-light px-8 py-3.5">
              Estimate Title Costs →
            </Link>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy px-8 py-3.5">
              Open Title
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHAT YOU GET ─────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <SectionHead
            index="03"
            label="Why it moves faster"
            title="Title, escrow, and settlement — built for real transactions"
            lede="Communication and problem-solving first, not paperwork thrown over a wall."
          />

          {/* Numbered columns under a heavy rule instead of icons in pastel
              circles — that pattern is the single most generic thing on a
              marketing page, and a rule plus a numeral carries the same
              hierarchy with none of the decoration. */}
          <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-3">
            {[
              {
                Icon: Clock,
                title: "Title & escrow that doesn't slow you down",
                body: "Fast, reliable title work and settlement coordination for purchase, refinance, resale, and builder transactions across DC, Maryland, and Virginia.",
              },
              {
                Icon: MessageSquare,
                title: "Responsive communication from contract to closing",
                body: "Buyers, agents, lenders, and builders get proactive updates, cleaner coordination, and fewer last-minute surprises at settlement.",
              },
              {
                Icon: MapPin,
                title: "Local DMV expertise for complex closings",
                body: "From Montgomery County and Bethesda to Washington DC and Northern Virginia, the team understands local taxes, title issues, and settlement workflows that affect real transactions.",
              },
            ].map((d, i) => (
              <div key={d.title} className="border-t-2 border-brand-navy pt-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-semibold text-brand-blue-deep tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <d.Icon size={17} strokeWidth={1.75} className="text-brand-blue-deep" aria-hidden="true" />
                </div>
                <h3 className="t-h5 mt-4 text-brand-navy">{d.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-brand-muted">{d.body}</p>
              </div>
            ))}
          </div>

          {/* Pull-quote as a real editorial moment: display serif at scale, no
              box, hanging off the same left edge as everything above it. */}
          <blockquote className="mt-20 max-w-4xl border-t border-gray-200 pt-10">
            <p className="font-display text-2xl leading-[1.4] text-brand-navy md:text-[1.75rem]">
              &ldquo;My goal is simple: help real estate professionals in the DMV grow their
              businesses through better marketing, better education, and better title decisions.
              When my partners succeed, everybody wins.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
              Will Rapuano
              <span className="ml-2 font-medium normal-case tracking-normal text-brand-muted">
                DMV Title Guy
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── SERVICE AREA SECTION ────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <SectionHead
            index="04"
            label="Coverage"
            title="Local title and closing education across the DMV"
            lede="Explore DMV-focused guides, calculators, and transaction-introduction resources for Washington DC, Northern Virginia, and Maryland."
          />
          {/* Location links were 73 fixed-width pills centred inside three cards,
              which produced a ragged grid of half-empty rows. As a left-aligned
              inline set they read as an index and set their own rhythm. */}
          <div className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-3">
            {SERVICE_AREAS.map((area) => (
              <div key={area.title} className="border-t border-gray-300 pt-6">
                <h3 className="t-h5 text-brand-navy">{area.title}</h3>
                <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-brand-muted">
                  {area.description}
                </p>
                <div className="mt-6 space-y-5">
                  {area.groups.map((group) => (
                    <div key={group.heading}>
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy/70">
                        {group.heading}
                      </h4>
                      {/* Separator trails its own link rather than leading the next
                          one, so a wrap can never start a line with a stray dot. */}
                      <ul className="mt-2 flex flex-wrap text-sm leading-relaxed">
                        {group.links.map((link, i) => (
                          <li key={`${group.heading}-${link.label}`}>
                            {/* Same reason as the footer's area list: 78 links here,
                                each pulling ~25 KB of RSC payload on viewport entry,
                                was 1.44 MB of speculative download on the homepage.
                                Hover still prefetches. */}
                            <Link
                              href={link.href}
                              prefetch={false}
                              className="text-brand-blue-deep decoration-brand-blue-deep/30 underline-offset-4 transition hover:underline"
                            >
                              {link.label}
                            </Link>
                            {i < group.links.length - 1 && (
                              <span aria-hidden="true" className="mx-1.5 text-gray-400">
                                ·
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SECTION 9: WILL / TRUST BUILDER ─────────────────────── */}
      {/* Was a centred wall of text in a 3xl column with the headshot nowhere on
          the page. An asymmetric 7/5 split gives the person a face and turns the
          contact details into a proper colophon instead of a stack of centred
          lines. */}
      <section className="section-light">
        <div className="container-xl">
          <SectionHead index="05" label="Who you'll deal with" title="Meet Will Rapuano" />
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-blue-deep">
                Founder of DMV Title Guy · Marketing and Business Development Officer at Pruitt Title LLC
              </p>
              <div className="mt-6 space-y-5 leading-relaxed text-brand-muted">
                <p className="max-w-[68ch] text-[17px]">
                  Will Rapuano created and operates DMV Title Guy to publish useful title resources and build direct relationships with real estate professionals and consumers. Will serves as Marketing and Business Development Officer at Pruitt Title LLC. Eligible transaction requests may be referred to Pruitt for independent review; Pruitt confirms whether it accepts the request and the applicable scope, pricing, terms, and disclosures.
                </p>
                <p className="max-w-[68ch]">
                  Need help finding the right next step? Reach out to Will with your transaction question or request an introduction.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/calculators/title-quote" className="btn-primary px-8">
                  Estimate Closing Costs
                </Link>
                <Link href="/contact" className="btn-outline px-8">
                  Contact Will
                </Link>
                <Link href="/about-will-rapuano" className="inline-flex min-h-11 items-center px-2 font-semibold text-brand-blue-deep underline decoration-brand-blue-deep/30 underline-offset-4 hover:decoration-brand-blue-deep">
                  About Will &amp; DMV Title Guy
                </Link>
              </div>
            </div>

            <aside className="md:col-span-5">
              {/* The file is a 1638x2048 cutout with a pure-white ground, so on a
                  white section it floated with no edge. A tinted panel plus
                  multiply drops the white and gives the portrait a frame; the
                  source is already 4:5, so nothing is cropped. */}
              <div className="overflow-hidden rounded-sm bg-brand-blue-50">
                <Image
                  src="/will-rapuano-headshot.jpg"
                  alt="Will Rapuano, Pruitt Title LLC"
                  width={1638}
                  height={2048}
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="h-auto w-full [mix-blend-mode:multiply]"
                />
              </div>
              <dl className="mt-6 border-t border-gray-200 pt-5 text-sm">
                {[
                  { k: "Phone", v: <a href="tel:+17038591467" className="text-brand-blue-deep hover:underline">(703) 859-1467</a> },
                ].map((row) => (
                  <div key={row.k} className="flex gap-4 border-b border-gray-100 py-2.5 last:border-0">
                    <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/70">
                      {row.k}
                    </dt>
                    <dd className="min-w-0 flex-1">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
