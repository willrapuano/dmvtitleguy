import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Inter } from "next/font/google";
import { ArrowUpRight, Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin, Check } from "lucide-react";
import { BRAND, HERO, PROOF, AUDIENCES, DIFFERENTIATORS, NAV, CLOSING_CTA } from "../_content";

/**
 * Direction B — "Modern Product".
 *
 * Tight geometric headlines, a dark hero that ends in a hard edge, bordered
 * surfaces instead of drop shadows, and monospace-ish numerals treated as data.
 * The reference points are software marketing pages rather than professional
 * services. Highest contrast with the current site; also the least "title
 * company" of the three, which may be exactly the point or exactly wrong.
 */
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--d-display" });
const body = Inter({ subsets: ["latin"], variable: "--d-body" });

const ICONS = { Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin } as const;

const NIGHT = "#0A0F1C";
const SURFACE = "#111827";
const LINE = "#1F2A3C";
const MINT = "#5EE9B5";
const SKY = "#7DB8FF";

export default function DirectionB() {
  return (
    <div className={`${display.variable} ${body.variable}`} style={{ fontFamily: "var(--d-body)" }}>
      {/* Dark hero block, self-contained */}
      <div style={{ background: NIGHT, color: "#E8EDF5" }}>
        <header style={{ borderBottom: `1px solid ${LINE}` }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            {/* On the dark nav: invert flips the artwork to white, screen drops
                the now-black ground to transparent. */}
            <Link href="/" aria-label={`${BRAND.name} — home`}>
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={2046}
                height={690}
                sizes="180px"
              unoptimized
                className="h-auto w-[180px] [filter:invert(1)] [mix-blend-mode:screen]"
              />
            </Link>
            <nav className="hidden items-center gap-7 text-sm md:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-[#9FB0C9] transition-colors hover:text-white">
                  {n.label}
                </Link>
              ))}
              <Link
                href={HERO.primaryCta.href}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: MINT, color: NIGHT }}
              >
                Get a quote
              </Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
            style={{ border: `1px solid ${LINE}`, background: SURFACE, color: SKY }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
            {BRAND.legal} · {BRAND.operator}
          </div>
          <h1
            style={{ fontFamily: "var(--d-display)" }}
            className="mt-7 max-w-[20ch] text-[2.7rem] font-bold leading-[0.98] tracking-[-0.045em] md:text-[4.5rem]"
          >
            Title &amp; settlement,
            <br />
            <span style={{ color: MINT }}>without the surprises.</span>
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-[#9FB0C9]">{HERO.standfirst}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={HERO.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: MINT, color: NIGHT }}
            >
              {HERO.primaryCta.label}
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
            <Link
              href={HERO.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold"
              style={{ border: `1px solid ${LINE}`, background: SURFACE }}
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>

          {/* Proof rendered as a product stat strip */}
          <div
            className="mt-16 grid divide-y overflow-hidden rounded-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            style={{ border: `1px solid ${LINE}`, background: SURFACE, borderColor: LINE }}
          >
            {PROOF.map((p) => (
              <div key={p.label} className="p-6" style={{ borderColor: LINE }}>
                <div
                  style={{ fontFamily: "var(--d-display)" }}
                  className="text-3xl font-bold tracking-[-0.04em]"
                >
                  {p.value}
                </div>
                <div className="mt-1.5 text-sm text-[#9FB0C9]">{p.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Light section: bordered feature surfaces */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#1B6FA8" }}>
              Why teams switch
            </p>
            <h2
              style={{ fontFamily: "var(--d-display)" }}
              className="mt-3 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A0F1C] md:text-[2.9rem]"
            >
              Built for the pace of a real pipeline
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {DIFFERENTIATORS.map((d) => {
              const Icon = ICONS[d.icon as keyof typeof ICONS];
              return (
                <div
                  key={d.title}
                  className="rounded-2xl border border-gray-200 bg-white p-7 transition-colors hover:border-gray-400"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "#0A0F1C" }}
                  >
                    <Icon size={18} strokeWidth={2} color={MINT} />
                  </div>
                  <h3
                    style={{ fontFamily: "var(--d-display)" }}
                    className="mt-5 text-lg font-bold leading-snug tracking-[-0.02em] text-[#0A0F1C]"
                  >
                    {d.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-gray-600">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audiences — split layout: sticky heading beside a compact list */}
      <section className="bg-[#F7F9FC]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <h2
              style={{ fontFamily: "var(--d-display)" }}
              className="text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A0F1C]"
            >
              Pick your lane
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Five closing paths, one point of contact. Every route lands with the same team.
            </p>
            <ul className="mt-6 space-y-2">
              {["DC", "Maryland", "Virginia"].map((j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={15} strokeWidth={2.5} style={{ color: "#1B6FA8" }} />
                  {j}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {AUDIENCES.map((a, i) => {
                const Icon = ICONS[a.icon as keyof typeof ICONS];
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="group flex items-start gap-4 p-5 transition-colors hover:bg-[#F7F9FC]"
                    style={{ borderTop: i === 0 ? "none" : "1px solid #E5E7EB" }}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FB]">
                      <Icon size={17} strokeWidth={2} style={{ color: "#1B6FA8" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        style={{ fontFamily: "var(--d-display)" }}
                        className="text-base font-bold tracking-[-0.02em] text-[#0A0F1C]"
                      >
                        {a.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{a.body}</p>
                    </div>
                    <ArrowUpRight
                      size={17}
                      strokeWidth={2}
                      className="mt-1 shrink-0 text-gray-300 transition-all group-hover:-translate-y-0.5 group-hover:text-[#1B6FA8]"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA — inset dark panel rather than a full-bleed band */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
          <div
            className="overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
            style={{ background: NIGHT, color: "#E8EDF5" }}
          >
            <h2
              style={{ fontFamily: "var(--d-display)" }}
              className="mx-auto max-w-[24ch] text-3xl font-bold leading-[1.06] tracking-[-0.035em] md:text-[2.75rem]"
            >
              {CLOSING_CTA.headline}
            </h2>
            <p className="mx-auto mt-5 max-w-[58ch] text-[15px] leading-relaxed text-[#9FB0C9]">
              {CLOSING_CTA.body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold"
                style={{ background: MINT, color: NIGHT }}
              >
                {HERO.primaryCta.label}
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={BRAND.phoneHref}
                className="inline-flex items-center rounded-lg px-6 py-3.5 text-sm font-semibold"
                style={{ border: `1px solid ${LINE}`, background: SURFACE }}
              >
                {BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
