import Link from "next/link";
import { TIER1_LOCATIONS, COUNTIES } from "@/data/locations";

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", icon: "f" },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  icon: "ig" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      icon: "in" },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   icon: "yt" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      {/* CTA strip */}
      <div className="bg-brand-navy-dark py-10">
        <div className="container-xl text-center">
          <p className="text-sm uppercase tracking-widest text-brand-blue mb-2">Serving DC, Maryland &amp; Virginia</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Looking for Ideas to Grow Your Real Estate Business?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-6">
            Get access to real estate tools, classes, and marketing ideas from Will Rapuano — Pruitt Title LLC.
          </p>
          <Link href="/#contact" className="btn-primary">
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-xl py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="text-xl font-bold mb-1">DMV <span className="text-brand-blue">Title Guy</span></p>
          <p className="text-xs text-gray-400 mb-4">Pruitt Title LLC</p>
          <address className="not-italic text-sm text-gray-300 space-y-1">
            <p>1900 Gallows Rd Suite 230</p>
            <p>Vienna, VA 22182</p>
            <p><a href="tel:+17038591467" className="hover:text-brand-blue">(703) 859-1467</a></p>
            <p><a href="mailto:wrapuano@pruitt-title.com" className="hover:text-brand-blue">wrapuano@pruitt-title.com</a></p>
          </address>
          {/* Socials */}
          <div className="flex gap-3 mt-5">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded bg-white/10 hover:bg-brand-blue flex items-center justify-center text-xs font-bold transition-colors"
              >
                {s.icon.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Virginia cities */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Virginia</h3>
          <ul className="space-y-1">
            {TIER1_LOCATIONS.filter((l) => l.state === "VA").map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`} className="text-sm text-gray-300 hover:text-brand-blue transition-colors">
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* MD/DC cities */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Maryland &amp; DC</h3>
          <ul className="space-y-1">
            {TIER1_LOCATIONS.filter((l) => l.state === "MD" || l.state === "DC").map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`} className="text-sm text-gray-300 hover:text-brand-blue transition-colors">
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3 mt-6">Counties</h3>
          <ul className="space-y-1">
            {COUNTIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-sm text-gray-300 hover:text-brand-blue transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services & Pages */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Services</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><Link href="/title-insurance" className="hover:text-brand-blue">Title Insurance</Link></li>
            <li><Link href="/investor-friendly-title-company" className="hover:text-brand-blue">All Transaction Types</Link></li>
            <li><Link href="/why-choose-us" className="hover:text-brand-blue">Why Choose Us</Link></li>
            <li><Link href="/my-classes" className="hover:text-brand-blue">CE Classes &amp; Events</Link></li>
            <li><Link href="/advertising-services" className="hover:text-brand-blue">Advertising Services</Link></li>
            <li><Link href="/subscribe" className="hover:text-brand-blue">Subscribe</Link></li>
            <li><Link href="/blog" className="hover:text-brand-blue">Blog &amp; Resources</Link></li>
          </ul>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3 mt-6">Calculators</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><Link href="/calculators" className="hover:text-brand-blue">All Calculators</Link></li>
            <li><Link href="/virginia-closing-cost-calculator" className="hover:text-brand-blue">Virginia Calculator</Link></li>
            <li><Link href="/maryland-closing-cost-calculator" className="hover:text-brand-blue">Maryland Calculator</Link></li>
            <li><Link href="/dc-closing-cost-calculator" className="hover:text-brand-blue">DC Calculator</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-xl flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {currentYear} Pruitt Title LLC dba DMV Title Guy. All rights reserved.</p>
          <p>
            <Link href="/privacy-policy" className="hover:text-gray-300 mr-4">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
