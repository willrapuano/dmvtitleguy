"use client";

import { Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "@/components/SectionHead";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

/**
 * Emoji were doing the work of icons here — they render differently on every OS,
 * ignore the palette, and sat oddly beside the serif headings. lucide-react was
 * already a dependency.
 */
const ROLE_ICONS = { Home, Handshake, Landmark, Hammer, Building2 } as const;

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  Icon: Instagram },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      Icon: Linkedin },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   Icon: Youtube },
];

const AUDIENCE_CARDS = [
  { role: "For Buyers & Sellers", desc: "Clear title work, responsive communication, and smoother purchase, sale, and refinance closings across the DMV.", icon: "Home", href: "/title-quote" },
  { role: "For Realtors", desc: "Faster communication, fewer closing surprises, and a better client experience from contract to settlement.", icon: "Handshake", href: "/title-company-for-realtors" },
  { role: "For Lenders", desc: "Reliable coordination, cleaner files, and dependable settlement support for your active pipeline.", icon: "Landmark", href: "/title-company-for-lenders" },
  { role: "For Builders", desc: "Repeatable closing support for new construction, buyer coordination, and pipeline-ready settlement execution.", icon: "Hammer", href: "/title-company-for-builders" },
  { role: "For Banks & Credit Unions", desc: "Institutional-grade title and escrow support with the reliability and responsiveness your teams expect.", icon: "Building2", href: "/title-company-for-credit-unions" },
];

const MONEY_PAGES = [
  { label: "Title Quote", href: "/title-quote", detail: "Start with a fast closing cost estimate." },
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
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background — cherry blossom DC */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-brand-navy/75" />

        <div className="container-xl relative z-10 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center py-20">
          <div>
            <div className="mb-6 flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-brand-action flex items-center justify-center text-white transition-all duration-200"
                >
                  <s.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-300 mb-3">Pruitt Title LLC • DMV Title Guy</p>
            {/**
             * The heading ran 20 words and needed six lines at the display size,
             * because it was carrying the audience list as well as the service and
             * the geography. The audiences moved down into the lede, where they are
             * still on the page and still indexed but no longer set in 60px serif.
             */}
            {/* Steps down from the t-display rung at lg, because that is exactly
                where the hero splits into 1.25fr/0.75fr and the heading loses a
                third of its measure — 60px in a 725px column wraps to four lines. */}
            <h1 className="t-display lg:text-5xl text-white mb-5 text-balance">
              Title &amp; settlement services across Virginia, Maryland, and DC
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mb-4">
              Fast closings. Local expertise. No surprises. Independent title and escrow
              support for buyers, realtors, lenders, and builders — residential, refinance,
              and builder transactions across the DMV.
            </p>
            <p className="text-base text-gray-300 max-w-2xl mb-8">
              Whether you are buying, selling, refinancing, or coordinating a builder or lender-side closing, DMV Title Guy helps keep transactions moving with responsive communication, clear title work, and settlement support across Virginia, Maryland, and DC.
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link
                href="/calculators/title-quote"
                className="btn-primary text-base px-8 py-3.5"
              >
                Get a Title Quote →
              </Link>
              {/* "Open Title" and "Start Your Closing" were two buttons, worded
                  differently, pointing at the same page. */}
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-8 py-3.5">
                Start Your Closing
              </Link>
            </div>
            <p className="text-sm text-gray-300">
              Trusted local operator: <strong className="text-white">Will Rapuano / DMV Title Guy</strong> with Pruitt Title LLC.
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-200 mb-3 max-w-[68ch] leading-relaxed">Service Area &amp; Core Services</p>
            <h2 className="t-h4 text-white mb-4">Title company, escrow, and settlement support across the DMV.</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-100">
              <div>
                <p className="font-semibold text-white mb-2 max-w-[68ch] leading-relaxed">Geography</p>
                <ul className="space-y-1 text-gray-200">
                  <li>• Virginia</li>
                  <li>• Maryland</li>
                  <li>• Washington DC</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-2 max-w-[68ch] leading-relaxed">Transactions</p>
                <ul className="space-y-1 text-gray-200">
                  <li>• Purchase closings</li>
                  <li>• Refinance closings</li>
                  <li>• Builder transactions</li>
                </ul>
              </div>
            </div>
          </div>
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
                    className="shrink-0 text-brand-blue-deep transition-transform group-hover:translate-x-1"
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
                      className="hidden text-brand-blue-deep transition-transform group-hover:translate-x-1 sm:col-span-1 sm:block sm:justify-self-end"
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
            <Link href="/calculators/title-quote" className="inline-block bg-white text-brand-action font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
              Get a Title Quote →
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
              businesses through better marketing, better education, and better title services.
              When my partners succeed, everybody wins.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
              Will Rapuano
              <span className="ml-2 font-medium normal-case tracking-normal text-brand-muted">
                DMV Title Guy, Pruitt Title LLC
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
            title="Title insurance and closing services across the DMV"
            lede="Pruitt Title LLC provides professional title and settlement services throughout Washington DC, Northern Virginia, and Maryland."
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
                            <Link
                              href={link.href}
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
                Your local title partner in VA, MD &amp; DC · Pruitt Title LLC
              </p>
              <div className="mt-6 space-y-5 leading-relaxed text-brand-muted">
                <p className="max-w-[68ch] text-[17px]">
                  Will Rapuano is the driving force behind DMV Title Guy, bringing a personal touch to every transaction. As your go-to title partner in Virginia, Maryland, and Washington DC, Will focuses on building relationships—not just processing paperwork. Whether you&apos;re a real estate agent or a lender, you&apos;ll appreciate his straightforward approach and commitment to making closings seamless.
                </p>
                <p className="max-w-[68ch]">
                  Need a title partner you can count on? Reach out directly for a quote or to open a title.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/calculators/title-quote" className="btn-primary px-8">
                  Get a Title Quote
                </Link>
                <Link href="/contact" className="btn-outline px-8">
                  Contact the Team
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
                  { k: "Email", v: <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue-deep hover:underline">wrapuano@pruitt-title.com</a> },
                  { k: "Phone", v: <a href="tel:+17038591467" className="text-brand-blue-deep hover:underline">(703) 859-1467</a> },
                  { k: "Office", v: <span className="text-brand-muted">1900 Gallows Rd Suite 230, Vienna, VA 22182</span> },
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
