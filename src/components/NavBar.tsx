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

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function DropdownMenu({ id, items, onClose, pathname }: { id: string; items: { label: string; href: string; desc?: string }[]; onClose: () => void; pathname: string }) {
  return (
    <div
      id={id}
      className="surface-card-elevated absolute left-1/2 top-full z-50 mt-3 w-80 -translate-x-1/2 overflow-hidden p-2"
    >
      {items.map((item) => {
        const current = isCurrentPath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`block rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-brand-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue-deep ${current ? "bg-brand-blue-50" : ""}`}
            onClick={onClose}
          >
            <span className="block text-sm font-semibold text-brand-navy">{item.label}</span>
            {item.desc && <span className="mt-1 block text-xs leading-relaxed text-brand-muted">{item.desc}</span>}
          </Link>
        );
      })}
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 text-brand-navy shadow-[0_8px_30px_-26px_rgba(11,29,58,0.5)] backdrop-blur-xl">
      <div className="container-xl flex h-[4.5rem] items-center justify-between">
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
            className="brand-wordmark-dark h-auto w-[160px] sm:w-[184px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-semibold lg:flex">
          {NAV_LINKS.map((l) => {
            if ("children" in l && l.children) {
              const dropdownId = `nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`;
              const isActive = activeDropdown === l.label;
              const groupCurrent = l.children.some((child) => isCurrentPath(pathname, child.href));
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
                    className={`flex min-h-11 items-center gap-1 rounded-full px-3.5 transition-colors duration-150 hover:bg-brand-blue-50 hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action ${groupCurrent ? "bg-brand-blue-50 text-brand-navy" : "text-brand-navy/75"}`}
                  >
                    {l.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isActive && (
                    <DropdownMenu id={dropdownId} items={l.children} onClose={() => setActiveDropdown(null)} pathname={pathname} />
                  )}
                </div>
              );
            }
            const current = isCurrentPath(pathname, l.href!);
            return (
              <Link
                key={l.href!}
                href={l.href!}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-full px-3.5 transition-colors duration-150 hover:bg-brand-blue-50 hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action ${
                  current ? "bg-brand-blue-50 text-brand-navy" : "text-brand-navy/75"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/calculators/title-quote" className="btn-primary ml-3 px-5 py-2 text-sm">
            Get a Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={mobileToggleRef}
          type="button"
          className="grid min-h-11 min-w-11 place-content-center rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls={open ? "mobile-navigation" : undefined}
        >
          <span className={`block h-0.5 w-6 bg-brand-navy transition-transform duration-150 ease-[var(--ease-out)] motion-reduce:transition-none ${open ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`my-1 block h-0.5 w-6 bg-brand-navy transition-opacity duration-150 ease-[var(--ease-out)] motion-reduce:transition-none ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-brand-navy transition-transform duration-150 ease-[var(--ease-out)] motion-reduce:transition-none ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-4.5rem)] space-y-2 overflow-y-auto border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden">
          {NAV_LINKS.map((l) => {
            if ("children" in l && l.children) {
              return (
                <div key={l.label} className="space-y-2">
                    <span className="block py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-deep">
                      {l.label}
                    </span>
                  {l.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      aria-current={isCurrentPath(pathname, child.href) ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-blue-50 hover:text-brand-navy ${isCurrentPath(pathname, child.href) ? "bg-brand-blue-50 text-brand-navy" : "text-brand-navy/75"}`}
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }
            const current = isCurrentPath(pathname, l.href!);
            return (
              <Link
                key={l.href!}
                href={l.href!}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-blue-50 hover:text-brand-navy ${current ? "bg-brand-blue-50 text-brand-navy" : "text-brand-navy/75"}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/calculators/title-quote" className="btn-primary mt-4 flex w-full text-center text-sm" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
