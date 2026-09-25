import Link from "next/link";

/**
 * The body of an audience page (builders, lenders, credit unions), built from the
 * Capital Standard "03 — Audience" template in Paper: a heading column beside
 * ruled, numbered rows, then a fog strip naming the handoff with a Contact Will
 * link (Contact Will by default). The template's dark closing band is left out because the site footer
 * already opens with one. Pages supply only the words, so the audiences stay one design.
 */
export type AudienceRow = { title: string; body: string };

const LABEL = "text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass";

export function AudienceSections({
  label,
  heading,
  intro,
  rows,
  handoff,
  handoffNote,
  handoffLink = { label: "Contact Will →", href: "/contact" },
}: {
  label: string;
  heading: string;
  intro: string;
  rows: AudienceRow[];
  /** e.g. "Builder → Will → Buyer" */
  handoff: string;
  handoffNote: string;
  handoffLink?: { label: string; href: string };
}) {
  return (
    <>
      <section className="bg-white py-16 md:py-20">
        <div className="container-xl grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-[70px]">
          <div className="flex flex-col gap-4">
            <p className={LABEL}>{label}</p>
            <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-brand-navy md:text-[46px]">
              {heading}
            </h2>
            <p className="text-[15px] leading-relaxed text-brand-ink-light">{intro}</p>
          </div>
          <ol className="border-t border-brand-line">
            {rows.map((row, i) => (
              <li key={row.title} className="grid gap-2 border-b border-brand-line py-6 md:grid-cols-[68px_275px_1fr] md:gap-0">
                <span className="text-xs tabular-nums text-brand-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-2xl leading-tight text-brand-navy md:pr-6">{row.title}</h3>
                <p className="max-w-[52ch] text-[15px] leading-relaxed text-brand-ink-light">{row.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-brand-gray-bg py-12 md:py-14">
        <div className="container-xl grid items-center gap-4 md:grid-cols-[180px_1fr_minmax(0,360px)] md:gap-[50px]">
          <p className={LABEL}>The handoff stays direct</p>
          <p className="font-display text-3xl leading-tight text-brand-navy md:text-[37px]">{handoff}</p>
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm leading-relaxed text-brand-ink-light">{handoffNote}</p>
            <Link href={handoffLink.href} className="text-sm font-bold text-brand-navy underline decoration-brand-brass decoration-2 underline-offset-[3px] hover:text-brand-ink">
              {handoffLink.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
