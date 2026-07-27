import Link from "next/link";
import Image from "next/image";
import { Fraunces, Inter } from "next/font/google";
import { ArrowRight, Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin } from "lucide-react";
import { BRAND, HERO, PROOF, AUDIENCES, DIFFERENTIATORS, NAV, CLOSING_CTA } from "../_content";

/**
 * Direction A — "Editorial Authority".
 *
 * Serif display against a neutral sans, hairline rules instead of cards, and an
 * asymmetric two-column hero. The intent is an established professional firm:
 * quiet, typographic, ink-on-paper. Colour is used sparingly so the type carries
 * the personality — the opposite of the current site, where a bright accent does
 * the work and one neutral sans sets every word.
 */
const display = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--d-display" });
const body = Inter({ subsets: ["latin"], variable: "--d-body" });

const ICONS = { Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin } as const;

const INK = "#14181F";
const PAPER = "#FBF9F5";
const RULE = "#DED8CC";
const ACCENT = "#1B4B7A";

export default function DirectionA() {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ background: PAPER, color: INK, fontFamily: "var(--d-body)" }}
    >
      {/* Nav — a single rule, no filled bar */}
      <header style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 py-6">
          {/* Real wordmark. On a light ground, multiply knocks out the file's
              baked-in white background; no invert needed. */}
          <Link href="/" aria-label={`${BRAND.name} — home`}>
            <Image
              src="/logo.png"
              alt={BRAND.name}
              width={2046}
              height={690}
              sizes="190px"
              unoptimized
              className="h-auto w-[190px] [mix-blend-mode:multiply]"
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="opacity-70 transition-opacity hover:opacity-100">
                {n.label}
              </Link>
            ))}
            <a href={BRAND.phoneHref} className="font-medium" style={{ color: ACCENT }}>
              {BRAND.phone}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero — asymmetric 7/5 split, not a centred stack */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              {HERO.eyebrow}
            </p>
            <h1
              style={{ fontFamily: "var(--d-display)" }}
              className="mt-6 text-[2.6rem] font-normal leading-[1.06] tracking-[-0.02em] md:text-[4rem]"
            >
              Title &amp; settlement services across{" "}
              <em className="not-italic" style={{ color: ACCENT }}>
                Virginia, Maryland, and DC
              </em>
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed opacity-75">{HERO.standfirst}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: INK }}
              >
                {HERO.primaryCta.label}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={HERO.secondaryCta.href}
                className="text-sm font-semibold underline decoration-1 underline-offset-4"
                style={{ color: ACCENT }}
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Proof as a typographic table rather than three floating cards */}
          <aside className="md:col-span-5 md:pl-10" style={{ borderLeft: `1px solid ${RULE}` }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-50">
              The practice
            </p>
            <dl className="mt-6">
              {PROOF.map((p, i) => (
                <div
                  key={p.label}
                  className="flex items-baseline gap-5 py-5"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${RULE}` }}
                >
                  <dd
                    style={{ fontFamily: "var(--d-display)", color: ACCENT }}
                    className="w-16 shrink-0 text-4xl font-semibold leading-none"
                  >
                    {p.value}
                  </dd>
                  <dt className="text-sm leading-snug opacity-70">{p.label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed opacity-60">
              {BRAND.operator}, {BRAND.legal}
              <br />
              {BRAND.address}
            </p>
          </aside>
        </div>
      </section>

      {/* Differentiators — numbered editorial list */}
      <section style={{ borderTop: `1px solid ${RULE}` }}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2
            style={{ fontFamily: "var(--d-display)" }}
            className="max-w-[22ch] text-3xl font-normal leading-tight tracking-[-0.01em] md:text-[2.75rem]"
          >
            Why transactions move faster
          </h2>
          <div className="mt-14 grid gap-y-12 md:grid-cols-3 md:gap-x-12">
            {DIFFERENTIATORS.map((d, i) => {
              const Icon = ICONS[d.icon as keyof typeof ICONS];
              return (
                <div key={d.title} style={{ borderTop: `2px solid ${INK}` }} className="pt-6">
                  <div className="flex items-center gap-3">
                    <span
                      style={{ fontFamily: "var(--d-display)", color: ACCENT }}
                      className="text-sm font-semibold"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon size={17} strokeWidth={1.5} style={{ color: ACCENT }} />
                  </div>
                  <h3
                    style={{ fontFamily: "var(--d-display)" }}
                    className="mt-4 text-xl font-semibold leading-snug"
                  >
                    {d.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed opacity-70">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audiences — a list with rules, so it reads as an index, not a card wall */}
      <section style={{ borderTop: `1px solid ${RULE}`, background: "#F5F1E9" }}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              style={{ fontFamily: "var(--d-display)" }}
              className="text-3xl font-normal tracking-[-0.01em] md:text-[2.75rem]"
            >
              Who we work with
            </h2>
            <p className="text-sm opacity-60">Choose the closing path that matches your role</p>
          </div>
          <ul className="mt-12">
            {AUDIENCES.map((a) => {
              const Icon = ICONS[a.icon as keyof typeof ICONS];
              return (
                <li key={a.href} style={{ borderTop: `1px solid ${RULE}` }}>
                  <Link
                    href={a.href}
                    className="group grid items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12"
                  >
                    <div className="flex items-center gap-3 md:col-span-4">
                      <Icon size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
                      <h3
                        style={{ fontFamily: "var(--d-display)" }}
                        className="text-xl font-semibold transition-transform group-hover:translate-x-1"
                      >
                        {a.title}
                      </h3>
                    </div>
                    <p className="text-[15px] leading-relaxed opacity-70 md:col-span-7">{a.body}</p>
                    <span className="md:col-span-1 md:justify-self-end">
                      <ArrowRight
                        size={18}
                        strokeWidth={1.5}
                        style={{ color: ACCENT }}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing CTA — ink block, serif headline */}
      <section style={{ background: INK, color: PAPER }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:py-24">
          <h2
            style={{ fontFamily: "var(--d-display)" }}
            className="text-3xl font-normal leading-tight tracking-[-0.01em] md:col-span-7 md:text-[2.75rem]"
          >
            {CLOSING_CTA.headline}
          </h2>
          <div className="md:col-span-5">
            <p className="text-[15px] leading-relaxed opacity-70">{CLOSING_CTA.body}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
                style={{ background: PAPER, color: INK }}
              >
                {HERO.primaryCta.label}
                <ArrowRight size={16} />
              </Link>
              <a
                href={BRAND.phoneHref}
                className="inline-flex items-center px-7 py-3.5 text-sm font-semibold"
                style={{ border: "1px solid rgba(251,249,245,0.4)" }}
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
