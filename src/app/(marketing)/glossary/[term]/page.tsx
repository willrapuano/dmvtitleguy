import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQSection } from "@/components/FAQSection";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  GLOSSARY_TERMS,
  STATE_NAMES,
  getGlossaryTerm,
  type GlossaryTerm,
} from "@/data/glossary";

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((entry) => ({ term: entry.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await props.params;
  const entry = getGlossaryTerm(slug);

  if (!entry) {
    return createPageMetadata({
      title: "Term Not Found | DMV Title Guy",
      description: "This glossary entry could not be found.",
      path: `/glossary/${slug}`,
    });
  }

  /* The description is the short answer verbatim rather than a rewritten
     summary: it is already written to stand alone as a snippet, and having the
     meta description and the on-page answer say the same thing is the point. */
  return createPageMetadata({
    title: `${entry.term} — What It Means in DC, Maryland & Virginia | DMV Title Guy`,
    description: entry.shortAnswer,
    path: `/glossary/${slug}`,
  });
}

/* Definition schema, distinct from the FAQ schema FAQSection emits. Marking the
   short answer as the defined term's description is what lets the entry compete
   for the definition panel rather than only the ten blue links. */
function DefinedTermSchema({ entry }: { entry: GlossaryTerm }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.shortAnswer,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "DMV Real Estate & Settlement Glossary",
      url: "https://dmvtitleguy.io/glossary",
    },
    url: `https://dmvtitleguy.io/glossary/${entry.slug}`,
    ...(entry.aliases?.length ? { alternateName: entry.aliases } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function GlossaryTermPage(props: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await props.params;
  const entry = getGlossaryTerm(slug);

  if (!entry) {
    notFound();
  }

  const related = (entry.related ?? [])
    .map((s) => getGlossaryTerm(s))
    .filter((t): t is GlossaryTerm => Boolean(t));

  return (
    <>
      <DefinedTermSchema entry={entry} />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: entry.term },
        ]}
        eyebrow="Real estate & settlement glossary"
        title={entry.term}
        lede={entry.shortAnswer}
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
        <div className="container-xl max-w-3xl">
          <div className="max-w-[68ch]">
            {entry.body.map((paragraph, i) => (
              <p key={i} className="mb-5 text-lg leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>

          {entry.jurisdictions?.length ? (
            <div className="mt-14">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                How this works across the DMV
              </h2>
              <p className="mt-2 text-slate-600">
                The same term behaves differently on either side of the river.
                This is what changes by jurisdiction.
              </p>
              <div className="mt-6 grid gap-4">
                {entry.jurisdictions.map((j) => (
                  <div
                    key={j.state}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                  >
                    <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {STATE_NAMES[j.state]}
                    </div>
                    <p className="mt-2 leading-relaxed text-slate-700">
                      {j.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {entry.seeAlso?.length ? (
            <div className="mt-12 rounded-xl bg-slate-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Next steps
              </div>
              <ul className="mt-3 space-y-2">
                {entry.seeAlso.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-medium text-brand underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Required by the site brief: nothing here may imply legal advice. */}
          <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
            This page explains how transactions customarily work in Washington,
            DC, Maryland and Virginia. It is general information, not legal or
            tax advice, and it cannot account for the facts of a specific
            transaction. For advice on your situation, speak with an attorney or
            tax professional.
          </p>
        </div>
      </section>

      {entry.faqs?.length ? <FAQSection faqs={entry.faqs} /> : null}

      {related.length ? (
        <section className="section-gray">
          <div className="container-xl max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Related terms
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"
                >
                  <div className="font-semibold text-slate-900">{r.term}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {r.shortAnswer}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
