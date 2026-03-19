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
  { role: "Real Estate Agents", desc: "Marketing strategies, CE classes, and a title partner who makes every closing smooth and stress-free.", icon: "🏠" },
  { role: "Mortgage Lenders", desc: "Fast turnarounds, proactive communication, and reliable closings for your entire pipeline.", icon: "🏦" },
  { role: "Banks & Credit Unions", desc: "Institutional-grade title services with the reliability and compliance your organization demands.", icon: "🏛️" },
  { role: "Home Builders", desc: "From lot closings to final sales, we handle every phase of your new construction pipeline.", icon: "🔨" },
  { role: "Real Estate Investors", desc: "Subject-to, wholesale, fix-and-flip, BRRRR — we understand your deal structures and move fast.", icon: "📈" },
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

        <div className="container-xl relative z-10 grid md:grid-cols-2 gap-10 items-center py-20">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-300 mb-3">Welcome To</p>
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold text-white leading-none mb-6">
              DMV Title Guy
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-lg mb-8">
              I&apos;m <strong className="text-white">Will Rapuano</strong>, Business Development lead at{" "}
              <strong className="text-white">Pruitt Title LLC</strong> in Vienna, VA. I help{" "}
              <strong className="text-white">real estate agents</strong>,{" "}
              <strong className="text-white">mortgage lenders</strong>,{" "}
              <strong className="text-white">banks</strong>,{" "}
              <strong className="text-white">credit unions</strong>, and{" "}
              <strong className="text-white">home builders</strong> across the{" "}
              <strong className="text-white">DMV</strong> and nationwide grow their business through smarter marketing, better tools, and a{" "}
              <strong className="text-white">title partner</strong> who actually picks up the phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:wrapuano@pruitt-title.com" className="btn-primary text-base px-8 py-3.5">
                Get in Touch
              </a>
              <Link href="/subscribe" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-8 py-3.5">
                Subscribe
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src="/will-rapuano-headshot.jpg"
                alt="Will Rapuano — DMV Title Guy"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT / BIO ───────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl max-w-4xl text-center">
          <h2 className="text-3xl md:text-[42px] font-bold text-brand-navy leading-tight mb-3">
            Title Company &amp; Escrow Services in Virginia, Maryland, and Washington DC
          </h2>
          <div className="accent-divider" />
          <div className="text-brand-muted leading-relaxed space-y-4 text-left mt-8">
            <p>
              My name is Will Rapuano, and I am a Business Development Officer at <strong>Pruitt Title LLC</strong>, a
              locally-owned, woman-owned title and settlement company established in 2007 and based in Vienna, Virginia.
              I also lead Business Development for <strong>First American Title Insurance Company</strong>, the nation&apos;s
              leading provider of title insurance and settlement services and a Fortune 500 company.
            </p>
            <p>
              As the <strong>DMV Title Guy</strong>, my mission is to bring unique real estate marketing strategies,
              educational workshops, and innovative tools to real estate agents and mortgage lenders across Washington DC,
              Maryland, and Virginia. I&apos;m recognized among the top 5% of title insurance executives nationwide, and I use
              that expertise to not only handle closings with precision, but to help my referral partners grow their businesses.
            </p>
            <p>
              Whether you need a reliable title partner, want to attend a free CE class, or are looking for creative ways to
              market your listings — I&apos;m here to help. I&apos;m an educator, a connector, and an advocate for real estate
              professionals in the DMV.
            </p>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ────────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {AUDIENCE_CARDS.map((item) => (
              <div
                key={item.role}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-brand-navy text-base mb-2">{item.role}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SUBSCRIBE CTA ─────────────────────────────── */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Access to Real Estate Tools, Classes, and Marketing Ideas
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Sign up now for exclusive access to resources designed to help real estate professionals grow their business in the DMV.
          </p>
          <Link href="/subscribe" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
            Subscribe Now →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4: WHAT YOU GET ─────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="prose-title">What You Get When You Partner With DMV Title Guy</h2>
            <div className="accent-divider" />
            <p className="prose-subtitle max-w-2xl mx-auto">
              Title expertise. Marketing firepower. A partner who&apos;s invested in your growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Title &amp; Escrow That Doesn&apos;t Slow You Down</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Fast, reliable closings backed by First American Title Insurance Company. Residential, commercial, luxury, new construction — we handle it all across DC, Maryland, and Virginia. Your deals close on time because we don&apos;t drop the ball on title work.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Marketing Strategies That Actually Work</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Most title reps hand you a pen at closing. I hand you a marketing plan. From targeted listing ads to social media strategy, I help agents and lenders generate leads, impress sellers, and stand out in a crowded DMV market.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-brand-blue text-2xl">📚</span>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-3">Classes, Tools &amp; Resources — Free</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Regular workshops on AI for real estate, video marketing, social media ads, and more. Plus exclusive access to tools and templates designed specifically for DMV real estate professionals. No fluff, no upsells — just stuff that helps you close more deals.
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


      {/* ── SECTION 9: LOOKING FOR IDEAS ─────────────────────────── */}
      <section className="section-light">
        <div className="container-xl text-center max-w-3xl">
          <h2 className="prose-title mb-6">Looking for Ideas to Grow Your Real Estate Business?</h2>
          <div className="accent-divider" />
          <div className="flex justify-center mb-6 mt-6">
            <Image
              src="/pruitt-logo.jpg"
              alt="Pruitt Title LLC"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="text-brand-muted text-sm space-y-2 mb-8">
            <p><a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue hover:underline">wrapuano@pruitt-title.com</a></p>
            <p><a href="tel:+17038591467" className="text-brand-blue hover:underline">(703) 859-1467</a></p>
            <p>1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
          </div>
          <Link href="/subscribe" className="btn-primary px-8">
            Subscribe for Updates
          </Link>
        </div>
      </section>
    </>
  );
}
