"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { ALL_LOCATIONS } from "@/data/locations";

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  Icon: Instagram },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      Icon: Linkedin },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   Icon: Youtube },
];

const AUDIENCE_CARDS = [
  { role: "For Buyers & Sellers", desc: "Clear title work, responsive communication, and smoother purchase, sale, and refinance closings across the DMV.", icon: "🏠", href: "/title-quote" },
  { role: "For Realtors", desc: "Faster communication, fewer closing surprises, and a better client experience from contract to settlement.", icon: "🤝", href: "/title-company-for-realtors" },
  { role: "For Lenders", desc: "Reliable coordination, cleaner files, and dependable settlement support for your active pipeline.", icon: "🏦", href: "/title-company-for-lenders" },
  { role: "For Builders", desc: "Repeatable closing support for new construction, buyer coordination, and pipeline-ready settlement execution.", icon: "🔨", href: "/title-company-for-builders" },
  { role: "For Banks & Credit Unions", desc: "Institutional-grade title and escrow support with the reliability and responsiveness your teams expect.", icon: "🏛️", href: "/title-company-for-credit-unions" },
];

const MONEY_PAGES = [
  { label: "Title Quote", href: "/title-quote", detail: "Start with a fast closing cost estimate." },
  { label: "Title Company in Bethesda, MD", href: "/title-company-bethesda-md", detail: "Montgomery County title and settlement support." },
  { label: "Closing Costs in Maryland", href: "/maryland-closing-cost-calculator", detail: "Estimate what buyers and sellers should expect." },
  { label: "Title Company for Realtors", href: "/title-company-for-realtors", detail: "Routing for agent-focused closing support." },
  { label: "Title Company for Builders", href: "/title-company-for-builders", detail: "New construction and builder pipeline support." },
  { label: "Washington DC Title Company", href: "/title-company-washington-dc", detail: "Title, escrow, and settlement support in DC." },
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

        {/* Social sidebar — desktop only */}
        <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-brand-blue flex items-center justify-center text-white transition-all duration-200"
            >
              <s.Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="container-xl relative z-10 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center py-20">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-300 mb-3">Pruitt Title LLC • DMV Title Guy</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Title &amp; Settlement Services for Buyers, Realtors, Lenders, and Builders Across Virginia, Maryland, and Washington DC
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mb-4">
              Fast closings. Local expertise. No surprises. Independent title and escrow support for residential, refinance, and builder transactions across the DMV.
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
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-8 py-3.5">
                Open Title
              </Link>
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-8 py-3.5">
                Start Your Closing
              </Link>
            </div>
            <p className="text-sm text-gray-300">
              Trusted local operator: <strong className="text-white">Will Rapuano / DMV Title Guy</strong> with Pruitt Title LLC.
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-200 mb-3">Service Area &amp; Core Services</p>
            <h2 className="text-2xl font-bold text-white mb-4">Title company, escrow, and settlement support across the DMV.</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-100">
              <div>
                <p className="font-semibold text-white mb-2">Geography</p>
                <ul className="space-y-1 text-gray-200">
                  <li>• Virginia</li>
                  <li>• Maryland</li>
                  <li>• Washington DC</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Transactions</p>
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
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-[42px] font-bold text-brand-navy leading-tight mb-3">
              Start Here: Title Quotes, Closings, and Service Pages
            </h2>
            <div className="accent-divider" />
            <p className="text-brand-muted max-w-3xl mx-auto mt-6">
              Use the homepage to route directly into the pages that matter most for quotes, closing support, and local title service coverage across Virginia, Maryland, and Washington DC.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {MONEY_PAGES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 block"
              >
                <h3 className="font-bold text-brand-navy text-lg mb-2">{item.label}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.detail}</p>
                <p className="mt-3 text-brand-blue text-xs font-semibold">Go to page →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ─────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">Routing by Transaction Partner</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-sm">Choose the closing path that matches your role. These pages route buyers, realtors, lenders, builders, and institutions into the right title, escrow, and settlement support.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {AUDIENCE_CARDS.map((item) => {
              const inner = (
                <>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-brand-navy text-base mb-2">{item.role}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                  {item.href && <p className="mt-3 text-brand-blue text-xs font-semibold">Learn more →</p>}
                </>
              );
              return item.href ? (
                <Link
                  key={item.role}
                  href={item.href}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 block"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={item.role}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: QUICK START CTA ───────────────────────────── */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need to start a closing or get numbers fast?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Start with a title quote, open title for an active transaction, or contact the team for purchase, refinance, and builder closings across the DMV.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/calculators/title-quote" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
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
          <div className="text-center mb-12">
            <h2 className="prose-title">Why Transactions Move Faster With DMV Title Guy</h2>
            <div className="accent-divider" />
            <p className="prose-subtitle max-w-2xl mx-auto">
              Title, escrow, and settlement support first — with communication and problem-solving built for real transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Title &amp; Escrow That Doesn&apos;t Slow You Down</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Fast, reliable title work and settlement coordination for purchase, refinance, resale, and builder transactions across DC, Maryland, and Virginia.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">⏱️</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Responsive Communication From Contract to Closing</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Buyers, agents, lenders, and builders get proactive updates, cleaner coordination, and fewer last-minute surprises at settlement.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">🧭</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Local DMV Expertise for Complex Closings</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                From Montgomery County and Bethesda to Washington DC and Northern Virginia, the team understands local taxes, title issues, and settlement workflows that affect real transactions.
              </p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="mt-12 max-w-2xl mx-auto text-center border-l-4 border-brand-blue pl-6 py-2 italic text-brand-muted">
            &ldquo;My goal is simple: help real estate professionals in the DMV grow their businesses through better marketing, better education, and better title services. When my partners succeed, everybody wins.&rdquo;
            <footer className="mt-2 text-brand-navy font-semibold not-italic text-sm">— Will Rapuano, DMV Title Guy</footer>
          </blockquote>
        </div>
      </section>

      {/* ── SERVICE AREA SECTION ────────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl text-center">
          <h2 className="prose-title">Title Insurance &amp; Closing Services Across the DMV</h2>
          <div className="accent-divider" />
          <p className="prose-subtitle max-w-2xl mx-auto mb-10">
            Pruitt Title LLC provides professional title and settlement services throughout Washington DC, Northern Virginia, and Maryland.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            {/* Virginia */}
            <div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">Virginia Title &amp; Escrow Services</h3>
              <p className="text-sm text-brand-muted mb-3">
                We provide professional title insurance, escrow, and real estate closing services throughout Northern Virginia.
              </p>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Arlington, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-arlington-va" className="text-brand-blue hover:underline text-sm">Title Company in Arlington, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Alexandria, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-alexandria-va" className="text-brand-blue hover:underline text-sm">Title Company in Alexandria, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Falls Church, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-falls-church-va" className="text-brand-blue hover:underline text-sm">Title Company in Falls Church, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Fairfax, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-fairfax-va" className="text-brand-blue hover:underline text-sm">Title Company in Fairfax, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Fairfax County, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-mclean-va" className="text-brand-blue hover:underline text-sm">Title Company in McLean, VA</Link></li>
                <li><Link href="/title-company-vienna-va" className="text-brand-blue hover:underline text-sm">Title Company in Vienna, VA</Link></li>
                <li><Link href="/title-company-reston-va" className="text-brand-blue hover:underline text-sm">Title Company in Reston, VA</Link></li>
                <li><Link href="/title-company-herndon-va" className="text-brand-blue hover:underline text-sm">Title Company in Herndon, VA</Link></li>
                <li><Link href="/title-company-great-falls-va" className="text-brand-blue hover:underline text-sm">Title Company in Great Falls, VA</Link></li>
                <li><Link href="/title-company-centreville-va" className="text-brand-blue hover:underline text-sm">Title Company in Centreville, VA</Link></li>
                <li><Link href="/title-company-chantilly-va" className="text-brand-blue hover:underline text-sm">Title Company in Chantilly, VA</Link></li>
                <li><Link href="/title-company-burke-va" className="text-brand-blue hover:underline text-sm">Title Company in Burke, VA</Link></li>
                <li><Link href="/title-company-springfield-va" className="text-brand-blue hover:underline text-sm">Title Company in Springfield, VA</Link></li>
                <li><Link href="/title-company-annandale-va" className="text-brand-blue hover:underline text-sm">Title Company in Annandale, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Loudoun County, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-ashburn-va" className="text-brand-blue hover:underline text-sm">Title Company in Ashburn, VA</Link></li>
                <li><Link href="/title-company-leesburg-va" className="text-brand-blue hover:underline text-sm">Title Company in Leesburg, VA</Link></li>
                <li><Link href="/title-company-sterling-va" className="text-brand-blue hover:underline text-sm">Title Company in Sterling, VA</Link></li>
                <li><Link href="/title-company-south-riding-va" className="text-brand-blue hover:underline text-sm">Title Company in South Riding, VA</Link></li>
                <li><Link href="/title-company-brambleton-va" className="text-brand-blue hover:underline text-sm">Title Company in Brambleton, VA</Link></li>
                <li><Link href="/title-company-purcellville-va" className="text-brand-blue hover:underline text-sm">Title Company in Purcellville, VA</Link></li>
                <li><Link href="/title-company-middleburg-va" className="text-brand-blue hover:underline text-sm">Title Company in Middleburg, VA</Link></li>
                <li><Link href="/title-company-middleburg-va" className="text-brand-blue hover:underline text-sm">Title Company in Aldie, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Prince William County, VA</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-woodbridge-va" className="text-brand-blue hover:underline text-sm">Title Company in Woodbridge, VA</Link></li>
                <li><Link href="/title-company-woodbridge-va" className="text-brand-blue hover:underline text-sm">Title Company in Dale City, VA</Link></li>
                <li><Link href="/title-company-woodbridge-va" className="text-brand-blue hover:underline text-sm">Title Company in Lake Ridge, VA</Link></li>
                <li><Link href="/title-company-woodbridge-va" className="text-brand-blue hover:underline text-sm">Title Company in Dumfries, VA</Link></li>
                <li><Link href="/title-company-gainesville-va" className="text-brand-blue hover:underline text-sm">Title Company in Gainesville, VA</Link></li>
                <li><Link href="/title-company-haymarket-va" className="text-brand-blue hover:underline text-sm">Title Company in Haymarket, VA</Link></li>
                <li><Link href="/title-company-bristow-va" className="text-brand-blue hover:underline text-sm">Title Company in Bristow, VA</Link></li>
                <li><Link href="/title-company-woodbridge-va" className="text-brand-blue hover:underline text-sm">Title Company in Occoquan, VA</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Stafford County &amp; Fredericksburg Area</h4>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><Link href="/title-company-stafford-va" className="text-brand-blue hover:underline text-sm">Title Company in Stafford, VA</Link></li>
                <li><Link href="/title-company-fredericksburg-va" className="text-brand-blue hover:underline text-sm">Title Company in Fredericksburg, VA</Link></li>
                <li><Link href="/title-company-spotsylvania-va" className="text-brand-blue hover:underline text-sm">Title Company in Spotsylvania, VA</Link></li>
              </ul>
            </div>
            {/* Maryland */}
            <div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">Maryland Title &amp; Escrow Services</h3>
              <p className="text-sm text-brand-muted mb-3">
                We provide professional title insurance, escrow, and real estate closing services throughout Montgomery County and Prince George&apos;s County, including:
              </p>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Montgomery County, MD</h4>
              <ul className="space-y-1.5 list-disc pl-5 mb-4">
                <li><Link href="/title-company-bethesda-md" className="text-brand-blue hover:underline text-sm">Title Company in Bethesda, MD</Link></li>
                <li><Link href="/title-company-rockville-md" className="text-brand-blue hover:underline text-sm">Title Company in Rockville, MD</Link></li>
                <li><Link href="/title-company-silver-spring-md" className="text-brand-blue hover:underline text-sm">Title Company in Silver Spring, MD</Link></li>
                <li><Link href="/title-company-gaithersburg-md" className="text-brand-blue hover:underline text-sm">Title Company in Gaithersburg, MD</Link></li>
                <li><Link href="/title-company-germantown-md" className="text-brand-blue hover:underline text-sm">Title Company in Germantown, MD</Link></li>
                <li><Link href="/title-company-potomac-md" className="text-brand-blue hover:underline text-sm">Title Company in Potomac, MD</Link></li>
                <li><Link href="/title-company-bethesda-md" className="text-brand-blue hover:underline text-sm">Title Company in Chevy Chase, MD</Link></li>
                <li><Link href="/title-company-silver-spring-md" className="text-brand-blue hover:underline text-sm">Title Company in Kensington, MD</Link></li>
                <li><Link href="/title-company-gaithersburg-md" className="text-brand-blue hover:underline text-sm">Title Company in Olney, MD</Link></li>
                <li><Link href="/title-company-potomac-md" className="text-brand-blue hover:underline text-sm">Title Company in North Potomac, MD</Link></li>
              </ul>

              <h4 className="font-semibold text-brand-navy text-sm mb-2">Prince George&apos;s County, MD</h4>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><Link href="/title-company-bowie-md" className="text-brand-blue hover:underline text-sm">Title Company in Bowie, MD</Link></li>
                <li><Link href="/title-company-college-park-md" className="text-brand-blue hover:underline text-sm">Title Company in College Park, MD</Link></li>
                <li><Link href="/title-company-hyattsville-md" className="text-brand-blue hover:underline text-sm">Title Company in Greenbelt, MD</Link></li>
                <li><Link href="/title-company-hyattsville-md" className="text-brand-blue hover:underline text-sm">Title Company in Hyattsville, MD</Link></li>
                <li><Link href="/title-company-laurel-md" className="text-brand-blue hover:underline text-sm">Title Company in Laurel, MD</Link></li>
                <li><Link href="/title-company-upper-marlboro-md" className="text-brand-blue hover:underline text-sm">Title Company in Upper Marlboro, MD</Link></li>
                <li><Link href="/title-company-bowie-md" className="text-brand-blue hover:underline text-sm">Title Company in Fort Washington, MD</Link></li>
                <li><Link href="/title-company-bowie-md" className="text-brand-blue hover:underline text-sm">Title Company in Clinton, MD</Link></li>
              </ul>
            </div>
            {/* Washington DC */}
            <div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">Washington DC Title &amp; Escrow Services</h3>
              <p className="text-sm text-brand-muted mb-3">
                We provide professional title insurance, escrow, and real estate closing services throughout Washington, DC, including:
              </p>
              <h4 className="font-semibold text-brand-navy text-sm mb-2">Washington, DC</h4>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Washington, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Georgetown, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Capitol Hill, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Navy Yard, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Dupont Circle, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Logan Circle, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Adams Morgan, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Shaw, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Columbia Heights, DC</Link></li>
                <li><Link href="/title-company-washington-dc" className="text-brand-blue hover:underline text-sm">Title Company in Brookland, DC</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ── SECTION 9: WILL / TRUST BUILDER ─────────────────────── */}
      <section className="section-light">
        <div className="container-xl max-w-3xl text-center">
          <h2 className="prose-title mb-2">Meet Will: The Face Behind DMV Title Guy</h2>
          <p className="text-brand-blue font-semibold mb-6">Pruitt Title LLC</p>
          <div className="accent-divider" />
          <div className="text-brand-muted leading-relaxed space-y-4 mb-8 text-left">
            <p>
              Will Rapuano isn&apos;t just a name on a business card—he&apos;s the person you call when you want to close more deals and keep your clients coming back. Based in Vienna, VA, Will works with real estate agents and lenders across Virginia, Maryland, and DC.
            </p>
            <p>
              He knows that smooth closings mean happier clients, more referrals, and repeat business for you. That&apos;s why he focuses on the details that matter: clear communication, no surprises at the table, and a team that actually answers the phone. No corporate runaround. Just a title partner who treats your business like it&apos;s his own.
            </p>
          </div>
          <div className="text-brand-muted text-sm space-y-2 mb-8">
            <p className="font-semibold text-brand-navy">Get in touch:</p>
            <p><a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue hover:underline">wrapuano@pruitt-title.com</a></p>
            <p><a href="tel:+17038591467" className="text-brand-blue hover:underline">(703) 859-1467</a></p>
            <p>1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/calculators/title-quote" className="btn-primary px-8">
              Get a Title Quote
            </Link>
            <Link href="/contact" className="btn-outline px-8">
              Contact the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
