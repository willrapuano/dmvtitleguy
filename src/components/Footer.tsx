import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { ALL_LOCATIONS } from "@/data/locations";

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
      {/* Areas We Serve */}
      <div className="border-b border-white/10 py-8">
        <div className="container-xl">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-brand-blue">Areas We Serve</h3>
          {/**
           * prefetch={false} because this list is 62 links long and sits on every
           * page. App Router prefetches on viewport entry by default, so scrolling
           * to the footer pulled ~45 KB of RSC payload per link — measured at
           * 1.69 MB on the blog index alone, more than the images. Hover still
           * prefetches, so anyone showing intent keeps the instant navigation.
           */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-300 md:grid-cols-3 lg:grid-cols-4">
            {SERVICE_AREAS.map((loc) => (
              <Link key={loc.slug} href={`/${loc.slug}`} prefetch={false} className="block transition-colors hover:text-brand-blue">
                {loc.city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-xl py-14 grid gap-10 md:grid-cols-3">
        {/* Column 1: Brand tagline */}
        <div>
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
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
            Trusted title &amp; escrow services for real estate professionals, builders, and financial institutions — serving the DMV and clients nationwide.
          </p>
        </div>

        {/* Column 2: Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-4">Contact Us</h3>
          <address className="not-italic text-sm text-gray-300 space-y-2">
            <p>
              <a href="mailto:wrapuano@pruitt-title.com" className="hover:text-brand-blue transition-colors">
                wrapuano@pruitt-title.com
              </a>
            </p>
            <p>
              <a href="tel:+17038591467" className="hover:text-brand-blue transition-colors">
                (703) 859-1467
              </a>
            </p>
            <p>1900 Gallows Rd Suite 230</p>
            <p>Vienna, VA 22182</p>
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
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-action flex items-center justify-center text-white transition-colors duration-200"
              >
                <s.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-300">
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
        <div className="container-xl flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© {currentYear} All Rights Reserved by DMV Title Guy</p>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
