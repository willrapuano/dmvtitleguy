import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/site-metadata";
import { glossaryAlphabetical } from "@/data/glossary";

export const metadata = createPageMetadata({
  title: "Real Estate & Settlement Glossary for DC, Maryland & Virginia | DMV Title Guy",
  description:
    "Plain-English definitions of the terms that appear in a DMV real estate transaction — and what changes between Washington DC, Maryland and Virginia.",
  path: "/glossary",
});

export default function GlossaryIndexPage() {
  const terms = glossaryAlphabetical();

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
        eyebrow="Real estate & settlement glossary"
        title="The terms, and what they mean here"
        lede="Most definitions online are written for the whole country. These are written for the DMV — because the same word behaves differently in Washington DC, Maryland and Virginia, and the difference is usually the part that matters."
        actions={
          <>
            <Link href="/calculators" className="btn-primary px-7">
              Estimate Closing Costs
            </Link>
            <Link href="/contact" className="btn-on-dark px-7">
              Ask About a Transaction
            </Link>
          </>
        }
      />

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {terms.map((entry) => (
              <Link
                key={entry.slug}
                href={`/glossary/${entry.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300"
              >
                <div className="text-lg font-semibold text-slate-900">
                  {entry.term}
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {entry.shortAnswer}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
            These pages explain how transactions customarily work in Washington,
            DC, Maryland and Virginia. They are general information, not legal or
            tax advice. For advice on your situation, speak with an attorney or
            tax professional.
          </p>
        </div>
      </section>
    </>
  );
}
