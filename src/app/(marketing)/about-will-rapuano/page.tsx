import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import {
  PRUITT_TITLE,
  RELATIONSHIP_DISCLOSURE,
  SITE_NAME,
  SITE_URL,
  WILL,
} from "@/lib/brand-identity";
import { serializeJsonLd } from "@/lib/json-ld";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "About Will Rapuano & DMV Title Guy",
  description:
    "Meet Will Rapuano, learn why he created DMV Title Guy, and understand how his personal educational website relates to Pruitt Title LLC.",
  path: "/about-will-rapuano",
});

const ABOUT_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${WILL.url}#profilepage`,
      url: WILL.url,
      name: "About Will Rapuano & DMV Title Guy",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${WILL.url}#person` },
    },
    {
      "@type": "Person",
      "@id": `${WILL.url}#person`,
      name: WILL.name,
      url: WILL.url,
      image: WILL.image,
      jobTitle: WILL.jobTitle,
      email: WILL.email,
      telephone: WILL.phoneDisplay,
      worksFor: {
        "@type": "Organization",
        "@id": PRUITT_TITLE.id,
        name: PRUITT_TITLE.name,
        url: PRUITT_TITLE.url,
      },
      sameAs: WILL.sameAs,
    },
  ],
};

const roles = [
  {
    title: SITE_NAME,
    text: "Will’s personal website for practical title education, calculators, local market resources, and direct relationship-building.",
  },
  {
    title: WILL.name,
    text: "The person behind DMV Title Guy and your direct point of contact for questions, quotes, and help getting a transaction started.",
  },
  {
    title: PRUITT_TITLE.name,
    text: "Will’s employer. An eligible request may be introduced to Pruitt for independent review; this website does not bind Pruitt or establish a service relationship.",
  },
];

export default function AboutWillRapuanoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(ABOUT_SCHEMA) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(145deg,#fbfcfd_0%,#f3f7fa_62%,#eef5f8_100%)]">
        <div aria-hidden="true" className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-brand-blush/80 blur-3xl" />
        <div className="container-xl relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_0.72fr] lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue-deep">
              The person behind DMV Title Guy
            </p>
            <h1 className="t-display max-w-[15ch] text-brand-navy">A direct title relationship built around useful answers.</h1>
            <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-brand-ink md:text-xl">
              I created DMV Title Guy to publish the resources real estate professionals and consumers actually need—and to make it easy to reach me directly when a transaction is ready to move.
            </p>
            <p className="mt-5 max-w-[62ch] leading-relaxed text-brand-muted">
              I am Will Rapuano, Marketing and Business Development Officer at Pruitt Title LLC. DMV Title Guy is my personal educational and business-development website, separate from Pruitt&apos;s corporate website. Eligible transaction requests may be referred to Pruitt for independent review; Pruitt confirms acceptance and service terms directly.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary px-8 text-center">
                Contact Will <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/calculators/title-quote" className="btn-outline px-8 text-center">
                Get a Title Quote
              </Link>
            </div>
          </div>

          <aside className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="overflow-hidden rounded-sm bg-brand-blue-50">
              <Image
                src="/will-rapuano-headshot.jpg"
                alt="Will Rapuano"
                width={1638}
                height={2048}
                sizes="(min-width: 1024px) 430px, 90vw"
                className="h-auto w-full [mix-blend-mode:multiply]"
                priority
              />
            </div>
            <dl className="border-x border-b border-slate-200 bg-white px-6 py-5 text-sm shadow-[0_24px_70px_-52px_rgba(11,29,58,0.7)]">
              <div className="border-b border-slate-100 pb-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/60">Role</dt>
                <dd className="mt-1 font-semibold text-brand-navy">{WILL.jobTitle}</dd>
              </div>
              <div className="pt-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy/60">Company</dt>
                <dd className="mt-1 font-semibold text-brand-navy">{PRUITT_TITLE.name}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue-deep">One relationship, three distinct identities</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-navy md:text-4xl">What each name means</h2>
          </div>
          <div className="mt-10 grid border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-slate-200">
            {roles.map((role, index) => (
              <article key={role.title} className="border-b border-slate-200 py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <p className="text-xs font-semibold text-brand-blue-deep">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-brand-navy">{role.title}</h3>
                <p className="mt-4 leading-relaxed text-brand-muted">{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 md:py-20">
        <div className="container-xl grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue-deep">How it works</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-navy md:text-4xl">From research to closing</h2>
          </div>
          <ol className="space-y-5">
            {[
              "Use DMV Title Guy to research title questions, compare costs, and prepare for your transaction.",
              "Contact Will directly when you need a quote, an answer, or help opening a title order.",
              "Pruitt Title LLC performs the title insurance, escrow, and settlement services for the transaction.",
            ].map((step) => (
              <li key={step} className="flex gap-4 border-b border-slate-200 pb-5 last:border-b-0">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue-deep" aria-hidden="true" />
                <span className="leading-relaxed text-brand-ink">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue-deep">Transparency</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-brand-navy md:text-4xl">No ambiguity about who does what</h2>
            <p className="mt-6 max-w-[70ch] text-[17px] leading-relaxed text-brand-muted">{RELATIONSHIP_DISCLOSURE}</p>
            <a
              href={PRUITT_TITLE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-blue-deep underline decoration-brand-blue-deep/30 underline-offset-4 hover:decoration-brand-blue-deep"
            >
              Visit the official Pruitt Title website <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
          <aside className="border-l-4 border-brand-blue-deep bg-brand-blue-50 p-7 md:p-8">
            <h2 className="text-xl font-semibold text-brand-navy">Reach Will directly</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-brand-navy">Will’s direct line</dt>
                <dd className="mt-1"><a href={WILL.phoneHref} className="text-brand-blue-deep hover:underline">{WILL.phoneDisplay}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Will’s Pruitt Title email</dt>
                <dd className="mt-1 break-all"><a href={`mailto:${WILL.email}`} className="text-brand-blue-deep hover:underline">{WILL.email}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Pruitt Title office</dt>
                <dd className="mt-1 leading-relaxed text-brand-muted">
                  {PRUITT_TITLE.address.streetAddress}<br />
                  {PRUITT_TITLE.address.addressLocality}, {PRUITT_TITLE.address.addressRegion} {PRUITT_TITLE.address.postalCode}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
