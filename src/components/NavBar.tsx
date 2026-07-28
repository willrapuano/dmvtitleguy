"use client";

import Link from "next/link";
import Image from "next/image";
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
      { label: "Upload Contract", href: "/upload-contract", desc: "Upload your ratified contract for fast processing" },
      { label: "Investor Due Diligence", href: "/investor-due-diligence", desc: "Submit property info & get a title search started" },
      { label: "Request Title Review", href: "/request-title-review", desc: "Get clarity on a property's title status" },
    ],
  },
  { label: "Calculators", href: "/calculators" },
  { label: "Classes", href: "/my-classes" },
  { label: "Blog", href: "/my-blog" },
];

function DropdownMenu({ items, onClose }: { items: { label: string; href: string; desc?: string }[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
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
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="container-xl flex items-center justify-between h-16">
        {/* Logo */}
        {/**
         * The header showed a text wordmark while the real wordmark sat unused in
         * logo.png. Same knockout as the footer: logo.png has no alpha, so invert
         * flips the black artwork white and screen drops the now-black ground.
         * `unoptimized` keeps the exact 255/0 values the blend depends on.
         */}
        <Link href="/" className="flex items-center" aria-label="DMV Title Guy — home">
          <Image
            src="/logo.png"
            alt="DMV Title Guy"
            width={2046}
            height={690}
            sizes="150px"
            priority
            unoptimized
            className="h-auto w-[132px] sm:w-[150px] [filter:invert(1)] [mix-blend-mode:screen]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((l) => {
            if ("children" in l && l.children) {
              return (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(l.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="text-gray-300 hover:text-brand-blue transition-colors flex items-center gap-1"
                  >
                    {l.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === l.label && (
                    <DropdownMenu items={l.children} onClose={() => setActiveDropdown(null)} />
                  )}
                </div>
              );
            }
            return (
              <Link
                key={l.href!}
                href={l.href!}
                className="text-gray-300 hover:text-brand-blue transition-colors"
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
          className="lg:hidden p-2 rounded focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white my-1 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-brand-navy-dark border-t border-white/10 px-6 py-4 space-y-3">
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
                      className="block text-gray-300 hover:text-brand-blue pl-4 py-1 text-sm font-medium"
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
                className="block text-gray-300 hover:text-brand-blue py-1 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/calculators/title-quote" className="btn-primary block text-center text-sm mt-2" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
