import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection({
  eyebrow = "Ready when you are",
  title,
  lede,
  primaryLabel = "Get a Title Quote",
  primaryHref = "/calculators/title-quote",
  secondaryLabel = "Contact Will",
  secondaryHref = "/contact",
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="section-light">
      <div className="container-xl">
        <div className="cta-panel grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue-300">{eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">{title}</h2>
            <p className="mt-4 max-w-[62ch] leading-relaxed text-slate-300">{lede}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href={primaryHref} className="btn-primary px-7">
              {primaryLabel} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href={secondaryHref} className="btn-on-dark px-7">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

