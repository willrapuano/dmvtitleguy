import type { Metadata } from "next";
import Link from "next/link";

/**
 * Mockups only. These routes exist so design directions can be compared in a
 * real browser at real breakpoints; they are kept out of search indexes and out
 * of sitemap.ts, and carry a visible banner so nobody mistakes one for the
 * shipping homepage.
 */
export const metadata: Metadata = {
  title: "Design directions — internal mockups",
  robots: { index: false, follow: false, nocache: true },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 bg-black px-4 py-2 text-xs text-white">
        <span className="font-semibold uppercase tracking-[0.16em]">
          Internal mockup · not live
        </span>
        <nav className="flex items-center gap-1">
          <Link href="/design" className="rounded px-2 py-1 hover:bg-white/15">
            Index
          </Link>
          {["a", "b", "c"].map((s) => (
            <Link
              key={s}
              href={`/design/${s}`}
              className="rounded px-2 py-1 uppercase hover:bg-white/15"
            >
              {s}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
