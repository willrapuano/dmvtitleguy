import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { ALL_LOCATIONS } from "@/data/locations";
import { PRUITT_TITLE, RELATIONSHIP_DISCLOSURE, WILL } from "@/lib/brand-identity";

/* Same four links as the hero, which already uses these icons — the footer was
   still spelling them out as "FB" / "IG" / "IN" / "YT". */
const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  Icon: Instagram },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      Icon: Linkedin },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   Icon: Youtube },
];

const SERVICE_AREAS = ALL_LOCATIONS;

const QUICK_LINKS = [
  { href: "/title-insurance",              label: "Title Insurance" },
  { href: "/investor-title-services",      label: "Investor Title Services" },
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/foreclosure-title-review",     label: "Foreclosure Title Review" },
  { href: "/about-will-rapuano",           label: "About Will & DMV Title Guy" },
  { href: "/why-choose-us",                label: "Why Pruitt Title?" },
  { href: "/my-classes",                   label: "My Classes" },
  { href: "/blog",                         label: "My Blog" },
  { href: "/subscribe",                    label: "Subscribe" },
  { href: "/calculators",                  label: "Calculators" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="border-b border-white/10 py-12 md:py-16">
        <div className="container-xl">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue-300">Ready when your contract is</p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                Start with clear numbers—or start the closing.
              </h2>
              <p className="mt-4 max-w-[62ch] leading-relaxed text-slate-300">
                Get a title quote, send the transaction details, or speak directly with Will about a purchase, refinance, or builder closing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/calculators/title-quote" className="btn-primary px-7">
                Get a Title Quote <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-on-dark px-7">
                Contact Will
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Areas We Serve */}
      <div className="border-b border-white/10 bg-brand-navy-dark/40 py-8">
        <div className="container-xl">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-[0.16em] text-brand-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue-300 lg:hidden">
              Areas We Serve
              <span
                aria-hidden="true"
                className="text-xl transition-transform duration-150 ease-[var(--ease-out)] group-open:rotate-45 motion-reduce:transition-none lg:hidden"
              >
                +
              </span>
            </summary>
            <div className="mt-5 hidden grid-cols-2 gap-x-6 gap-y-3 text-xs text-slate-300 group-open:grid lg:!grid lg:grid-cols-4 lg:gap-x-10 lg:gap-y-2.5">
              <h3 className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue-300 lg:col-span-4 lg:mb-3 lg:block">
                Areas We Serve
              </h3>
              {SERVICE_AREAS.map((loc) => (
                <Link key={loc.slug} href={`/${loc.slug}`} prefetch={false} className="block transition-colors duration-150 hover:text-white">
                  {loc.city}
                </Link>
              ))}
            </div>
          </details>
          {/**
           * prefetch={false} because this 62-link directory sits on every page.
           * It renders once, collapses natively on mobile, and CSS forces the
           * content visible on desktop without duplicating the DOM payload.
           */}
        </div>
      </div>

      <div className="container-xl grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand tagline */}
        <div className="lg:col-span-2">
          {/**
           * The wordmark ships without its tagline, because at 220px wide the
           * tagline in the full lockup sets about 7px tall — so it goes below as
           * real text instead, where it is legible and selectable.
           */}
          <Link href="/" className="inline-block" aria-label="DMV Title Guy — home">
            <Image
              src="/logo-wordmark-white.png"
              alt="DMV Title Guy"
              width={1235}
              height={164}
              sizes="220px"
              className="h-auto w-[220px]"
              priority={false}
            />
          </Link>
          <p className="mb-5 mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-300">
            Got your back on every contract
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-300">
            Practical title education and direct access to Will Rapuano for transactions across Washington DC, Maryland, and Virginia.
          </p>
          <p className="mt-5 max-w-2xl text-xs leading-relaxed text-slate-400">{RELATIONSHIP_DISCLOSURE}</p>
        </div>

        {/* Column 2: Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-4">Contact Will</h3>
          <address className="space-y-2 text-sm not-italic text-slate-300">
            <p>
              <span className="block text-xs text-slate-400">Pruitt Title email</span>
              <a href={`mailto:${WILL.email}`} className="hover:text-brand-blue transition-colors">
                {WILL.email}
              </a>
            </p>
            <p>
              <span className="block text-xs text-slate-400">Will’s direct line</span>
              <a href={WILL.phoneHref} className="hover:text-brand-blue transition-colors">
                {WILL.phoneDisplay}
              </a>
            </p>
            <p className="pt-1 text-xs text-slate-400">Pruitt Title office</p>
            <p>{PRUITT_TITLE.address.streetAddress}</p>
            <p>{PRUITT_TITLE.address.addressLocality}, {PRUITT_TITLE.address.addressRegion} {PRUITT_TITLE.address.postalCode}</p>
          </address>
        </div>

        {/* Column 3: Follow Us */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-4">Follow Us</h3>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-brand-action"
              >
                <s.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="hover:text-brand-blue transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        {/* slate-400 clears 6.4:1 on navy; gray-500 measured 3.47:1 and failed AA. */}
        <div className="container-xl flex flex-col items-center justify-between gap-2 text-xs text-slate-400 md:flex-row">
          <p>© {currentYear} All Rights Reserved by DMV Title Guy</p>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
