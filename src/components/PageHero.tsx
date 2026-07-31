import Link from "next/link";
import type { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  actions,
  aside,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero ${compact ? "md:py-16" : "md:py-24"}`}>
      <div className={`container-xl grid items-center gap-10 ${aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:gap-16" : ""}`}>
        <div className="page-hero-copy">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {breadcrumbs.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true" className="text-white/30">/</span>}
                    {item.href ? (
                      <Link href={item.href} className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-300">
                        {item.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white/70">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="page-hero-eyebrow">{eyebrow}</p>}
          <h1 className="t-h1 text-white">{title}</h1>
          {lede && <div className="page-hero-lede">{lede}</div>}
          {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}
