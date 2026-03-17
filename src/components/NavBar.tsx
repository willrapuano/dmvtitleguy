"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "My Classes", href: "/my-classes" },
  { label: "My Blog", href: "/my-blog" },
  { label: "Title Insurance", href: "/title-insurance" },
  { label: "Why Pruitt Title?", href: "/why-choose-us" },

  { label: "Calculators", href: "/calculators" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="container-xl flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight text-white">
            DMV <span className="text-brand-blue">Title Guy</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-300 hover:text-brand-blue transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/calculators/title-quote" className="btn-primary text-sm py-2 px-5 ml-2">
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
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-gray-300 hover:text-brand-blue py-1 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/calculators/title-quote" className="btn-primary block text-center text-sm mt-2" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
