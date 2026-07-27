import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowRight, Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin, Phone } from "lucide-react";
import { BRAND, HERO, PROOF, AUDIENCES, DIFFERENTIATORS, NAV, CLOSING_CTA, PLACEHOLDER_QUOTE } from "../_content";

/**
 * Direction C — "Warm Local".
 *
 * One humanist typeface across a warm sand palette, soft radii, and a named
 * person at the centre rather than an abstract company voice. Aimed at buyers and
 * agents choosing someone local over a national processor; the least corporate of
 * the three, and the one that leans hardest on the operator's own credibility.
 */
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--d-sans" });

const ICONS = { Home, Handshake, Landmark, Hammer, Building2, Clock, MessageSquare, MapPin } as const;

const SAND = "#FAF6F0";
const SAND_DEEP = "#F1E8DC";
const INK = "#241E1A";
const CLAY = "#B4552D";
const FOREST = "#255346";

export default function DirectionC() {
  return (
    <div
      className={sans.variable}
      style={{ fontFamily: "var(--d-sans)", background: SAND, color: INK }}
    >
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-lg font-extrabold tracking-[-0.02em]">{BRAND.name}</span>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="opacity-70 hover:opacity-100">
                {n.label}
              </Link>
            ))}
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: CLAY }}
            >
              <Phone size={14} strokeWidth={2.5} />
              {BRAND.phone}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero — person-forward, headshot anchoring the claim */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold"
              style={{ background: SAND_DEEP, color: FOREST }}
            >
              17+ years in Fairfax County
            </p>
            <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-[3.9rem]">
              A local title company that actually{" "}
              <span style={{ color: CLAY }}>picks up the phone.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed opacity-75">{HERO.standfirst}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: FOREST }}
              >
                {HERO.primaryCta.label}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href={HERO.secondaryCta.href}
                className="rounded-full px-7 py-4 text-sm font-bold"
                style={{ border: `2px solid ${INK}20` }}
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div
              className="relative overflow-hidden rounded-[2rem] p-7"
              style={{ background: SAND_DEEP }}
            >
              <Image
                src="/will-rapuano-headshot.jpg"
                alt={`${BRAND.operator}, ${BRAND.legal}`}
                width={420}
                height={420}
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />
              <p className="mt-5 text-base leading-relaxed opacity-70">{PLACEHOLDER_QUOTE}</p>
              <p className="mt-3 text-sm font-bold">
                {BRAND.operator}
                <span className="ml-2 font-medium opacity-60">{BRAND.legal}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Proof — inline pills, warm and light */}
        <div className="mt-14 flex flex-wrap gap-3">
          {PROOF.map((p) => (
            <div
              key={p.label}
              className="flex items-baseline gap-3 rounded-2xl px-5 py-4"
              style={{ background: SAND_DEEP }}
            >
              <span className="text-2xl font-extrabold tracking-[-0.03em]" style={{ color: CLAY }}>
                {p.value}
              </span>
              <span className="text-sm font-medium opacity-70">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators — soft cards on deeper sand */}
      <section style={{ background: SAND_DEEP }}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2 className="max-w-[24ch] text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[2.7rem]">
            What working together actually feels like
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {DIFFERENTIATORS.map((d) => {
              const Icon = ICONS[d.icon as keyof typeof ICONS];
              return (
                <div key={d.title} className="rounded-[1.5rem] p-7" style={{ background: SAND }}>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${FOREST}14` }}
                  >
                    <Icon size={21} strokeWidth={2} style={{ color: FOREST }} />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold leading-snug tracking-[-0.02em]">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed opacity-70">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audiences — wide soft rows */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] md:text-[2.7rem]">
              Who I help
            </h2>
            <p className="text-sm opacity-60">Same team, whichever door you come through</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => {
              const Icon = ICONS[a.icon as keyof typeof ICONS];
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group rounded-[1.5rem] p-6 transition-transform hover:-translate-y-1"
                  style={{ background: SAND_DEEP }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={19} strokeWidth={2} style={{ color: CLAY }} />
                    <h3 className="text-base font-extrabold tracking-[-0.02em]">{a.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed opacity-70">{a.body}</p>
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold"
                    style={{ color: FOREST }}
                  >
                    Learn more
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA — forest block with rounded top corners */}
      <section className="px-4 pb-4">
        <div
          className="mx-auto max-w-[1400px] rounded-[2.5rem] px-8 py-16 text-center md:px-16 md:py-24"
          style={{ background: FOREST, color: SAND }}
        >
          <h2 className="mx-auto max-w-[26ch] text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[2.9rem]">
            {CLOSING_CTA.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-base leading-relaxed opacity-80">
            {CLOSING_CTA.body}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href={HERO.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold"
              style={{ background: SAND, color: FOREST }}
            >
              {HERO.primaryCta.label}
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold"
              style={{ border: "2px solid rgba(250,246,240,0.35)" }}
            >
              <Phone size={15} strokeWidth={2.5} />
              {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
