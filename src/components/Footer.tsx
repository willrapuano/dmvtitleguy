import Link from "next/link";
import Image from "next/image";
import { ALL_LOCATIONS } from "@/data/locations";

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  icon: "IG" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      icon: "IN" },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   icon: "YT" },
];

const SERVICE_AREAS = ALL_LOCATIONS;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      {/* Areas We Serve */}
      <div className="border-b border-white/10 py-8">
        <div className="container-xl">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-brand-blue">Areas We Serve</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-300 md:grid-cols-3 lg:grid-cols-4">
            {SERVICE_AREAS.map((loc) => (
              <Link key={loc.slug} href={`/${loc.slug}`} className="block transition-colors hover:text-brand-blue">
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
           * logo.png is a 2046x690 horizontal wordmark (2.97:1), but it was
           * declared 44x44, so it rendered as a ~44x15px sliver — and because the
           * file is RGB with no alpha, its baked-in white background showed as a
           * pale box against the navy footer.
           *
           * Correct proportions here, and knock the white out with invert+screen:
           * invert turns the black artwork white and the white ground black, then
           * screen drops black to transparent. A proper transparent light-on-dark
           * export would make this unnecessary.
           */}
          <Link href="/" className="mb-5 inline-block" aria-label="DMV Title Guy — home">
            <Image
              src="/logo.png"
              alt="DMV Title Guy — got your back on every contract"
              width={2046}
              height={690}
              sizes="200px"
              unoptimized
              className="h-auto w-[200px] [filter:invert(1)] [mix-blend-mode:screen]"
              priority={false}
            />
          </Link>
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
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-action flex items-center justify-center text-xs font-bold transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><Link href="/title-insurance" className="hover:text-brand-blue transition-colors">Title Insurance</Link></li>
              <li><Link href="/investor-title-services" className="hover:text-brand-blue transition-colors">Investor Title Services</Link></li>
              <li><Link href="/auction-property-title-search" className="hover:text-brand-blue transition-colors">Auction Property Title Search</Link></li>
              <li><Link href="/foreclosure-title-review" className="hover:text-brand-blue transition-colors">Foreclosure Title Review</Link></li>
              <li><Link href="/why-choose-us" className="hover:text-brand-blue transition-colors">Why Pruitt Title?</Link></li>
              <li><Link href="/my-classes" className="hover:text-brand-blue transition-colors">My Classes</Link></li>
              <li><Link href="/my-blog" className="hover:text-brand-blue transition-colors">My Blog</Link></li>

              <li><Link href="/subscribe" className="hover:text-brand-blue transition-colors">Subscribe</Link></li>
              <li><Link href="/calculators" className="hover:text-brand-blue transition-colors">Calculators</Link></li>
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
