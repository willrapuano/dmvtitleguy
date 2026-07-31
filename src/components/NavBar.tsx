"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface NavGroup {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
}

const NAV_LINKS: (NavGroup | { label: string; href: string })[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    children: [
      { label: "Title Insurance", href: "/title-insurance" },
      { label: "Investor Title Services", href: "/investor-title-services", desc: "Title searches, auction support & wholesale closings" },
      { label: "Auction Property Title Search", href: "/auction-property-title-search", desc: "Pre-auction title search & risk assessment" },
      { label: "Foreclosure Title Review", href: "/foreclosure-title-review", desc: "Surviving liens & chain-of-title review" },
    ],
  },
  {
    label: "Get Started",
    children: [
      { label: "Start Contract Intake", href: "/upload-contract", desc: "Begin intake and receive secure transfer instructions" },
      { label: "Investor Due Diligence", href: "/investor-due-diligence", desc: "Submit property info & get a title search started" },
      { label: "Request Title Review", href: "/request-title-review", desc: "Get clarity on a property's title status" },
    ],
  },
  { label: "Calculators", href: "/calculators" },
  { label: "Classes", href: "/my-classes" },
  { label: "Blog", href: "/blog" },
];

function DropdownMenu({ id, items, onClose }: { id: string; items: { label: string; href: string; desc?: string }[]; onClose: () => void }) {
  return (
    <div id={id} className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-3 hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue-deep"
          onClick={onClose}
        >
          <span className="text-sm font-semibold text-brand-navy block">{item.label}</span>
          {item.desc && <span className="text-xs text-brand-muted block mt-0.5">{item.desc}</span>}
        </Link>
      ))}
    </div>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const openDropdown = activeDropdown;
      const mobileMenuWasOpen = open;
      setOpen(false);
      setActiveDropdown(null);
      requestAnimationFrame(() => {
        if (openDropdown) dropdownTriggerRefs.current[openDropdown]?.focus();
        else if (mobileMenuWasOpen) mobileToggleRef.current?.focus();
      });
    };
    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, [activeDropdown, open]);

  useEffect(() => () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  }, []);

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="container-xl flex items-center justify-between h-16">
        {/* Logo */}
        {/**
         * logo-wordmark-white.png is the wordmark alone — no tagline, trimmed to
         * the ink, white on transparent. At this size the tagline in the full
         * lockup would render about 2px tall, and the old invert+screen knockout
         * (needed because logo.png has no alpha) is gone with it.
         */}
        <Link href="/" className="flex items-center" aria-label="DMV Title Guy — home">
          <Image
            src="/logo-wordmark-white.png"
            alt="DMV Title Guy"
            width={1235}
            height={164}
            sizes="184px"
            priority
            className="h-auto w-[160px] sm:w-[184px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((l) => {
            if ("children" in l && l.children) {
              const dropdownId = `nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`;
              const isActive = activeDropdown === l.label;
              return (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(l.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    ref={(element) => {
                      dropdownTriggerRefs.current[l.label] = element;
                    }}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={isActive ? dropdownId : undefined}
                    onClick={() => setActiveDropdown(isActive ? null : l.label)}
                    className="text-gray-300 hover:text-brand-blue transition-colors flex items-center gap-1 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
                  >
                    {l.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isActive && (
                    <DropdownMenu id={dropdownId} items={l.children} onClose={() => setActiveDropdown(null)} />
                  )}
                </div>
              );
            }
            return (
              <Link
                key={l.href!}
                href={l.href!}
                className="text-gray-300 hover:text-brand-blue transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/calculators/title-quote" className="btn-primary text-sm py-2 px-6 ml-3">
            Get a Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={mobileToggleRef}
          type="button"
          className="lg:hidden min-h-11 min-w-11 p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls={open ? "mobile-navigation" : undefined}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white my-1 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto bg-brand-navy-dark border-t border-white/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((l) => {
            if ("children" in l && l.children) {
              return (
                <div key={l.label} className="space-y-2">
                  <span className="block text-brand-blue font-semibold text-xs uppercase tracking-wider py-1">
                    {l.label}
                  </span>
                  {l.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="flex min-h-11 items-center text-gray-300 hover:text-brand-blue pl-4 py-2 text-sm font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={l.href!}
                href={l.href!}
                className="flex min-h-11 items-center text-gray-300 hover:text-brand-blue py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/calculators/title-quote" className="btn-primary block text-center text-sm mt-2" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
