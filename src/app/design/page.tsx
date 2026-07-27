import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DIRECTIONS } from "./_content";

export default function DesignIndex() {
  return (
    <main className="min-h-screen bg-[#0f1115] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Internal · pick a direction
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Three visual directions
        </h1>
        <p className="mt-5 leading-relaxed text-white/60">
          Same body copy in all three, taken from the live homepage, so the comparison is mostly
          about design: typeface, palette, composition, and iconography. The 38 emoji currently
          used as icons are replaced with real icons throughout. None of this touches the live
          site.
        </p>
        <p className="mt-4 leading-relaxed text-white/45">
          Two deliberate exceptions: each direction writes its own <em>headline</em>, because tone
          of voice is part of a direction — and the third stat plus C&rsquo;s pull-quote are marked
          placeholders rather than invented claims.
        </p>

        <ul className="mt-12 space-y-3">
          {DIRECTIONS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/design/${d.slug}`}
                className="group flex items-start gap-5 rounded-2xl border border-white/12 bg-white/[0.03] p-6 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                <span className="mt-0.5 text-2xl font-bold uppercase text-white/25">{d.slug}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-lg font-bold">{d.name}</span>
                    <span className="text-xs text-white/45">{d.typeface}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">{d.idea}</span>
                </span>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-white/30 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm leading-relaxed text-white/40">
          Compare on a phone as well as a laptop — the directions diverge most at small widths.
        </p>
      </div>
    </main>
  );
}
