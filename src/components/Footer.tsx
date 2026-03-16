import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  icon: "IG" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      icon: "IN" },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   icon: "YT" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="container-xl py-14 grid gap-10 md:grid-cols-3">
        {/* Column 1: Brand tagline */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="DMV Title Guy" width={44} height={44} className="rounded-sm" />
            <span className="text-xl font-bold">DMV <span className="text-brand-blue">Title Guy</span></span>
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
            Helping real estate agents and mortgage lenders throughout the DMV area implement unique marketing strategies and adopt a sustainable business model designed to help them grow.
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
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center text-xs font-bold transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><Link href="/title-insurance" className="hover:text-brand-blue transition-colors">Title Insurance</Link></li>
              <li><Link href="/why-choose-us" className="hover:text-brand-blue transition-colors">Why Pruitt Title?</Link></li>
              <li><Link href="/my-classes" className="hover:text-brand-blue transition-colors">My Classes</Link></li>
              <li><Link href="/my-blog" className="hover:text-brand-blue transition-colors">My Blog</Link></li>
              <li><Link href="/advertising-services" className="hover:text-brand-blue transition-colors">Advertising</Link></li>
              <li><Link href="/subscribe" className="hover:text-brand-blue transition-colors">Subscribe</Link></li>
              <li><Link href="/calculators" className="hover:text-brand-blue transition-colors">Calculators</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-xl flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {currentYear} All Rights Reserved by DMV Title Guy</p>
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
