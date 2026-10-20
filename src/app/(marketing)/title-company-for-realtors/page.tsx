import Image from "next/image";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Title Company for Realtors in Northern Virginia, MD & DC",
  description:
    "Will Rapuano and Pruitt Title for DMV agents: a free contract analyzer, VA, MD and DC closing cost calculators, client guides, agent training and one direct contact.",
  path: "/title-company-for-realtors",
});

// Google Business Profile for "Will Rapuano, Pruitt Title" (all reviews 5 stars as of 2026-10-19).
const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJlS-QUdNLtokRYYLhJ7JGdyc";

const reasons = [
  {
    title: "You reach me, not a queue",
    body: "Call me at (703) 859-1467. I'm your contact from the contract to the recorded deed, and the Pruitt Title team does the title work behind me.",
  },
  {
    title: "Your contract gets a second look",
    body: "Run NVAR, GCAAR and MAR contracts through my contract analyzer before they go out. It flags missing fields, signature gaps and date conflicts.",
  },
  {
    title: "Your clients get straight answers",
    body: "Send them a guide instead of a long email: closing costs, title insurance, surveys and FIRPTA for Virginia, Maryland and DC.",
  },
];

const tools = [
  { href: "/virginia-closing-cost-calculator", label: "Virginia closing cost calculator" },
  { href: "/maryland-closing-cost-calculator", label: "Maryland closing cost calculator" },
  { href: "/dc-closing-cost-calculator", label: "DC closing cost calculator" },
  { href: "/calculators/seller-net-sheet", label: "Seller net sheet" },
  { href: "/calculators/title-quote", label: "Title quote calculator" },
];

const guides = [
  { href: "/blog/virginia-real-estate-contract", label: "The Virginia real estate contract" },
  { href: "/blog/maryland-real-estate-contract", label: "The Maryland contract of sale" },
  { href: "/blog/dc-real-estate-purchase-contract", label: "The DC purchase contract" },
  { href: "/blog/who-chooses-the-title-company-in-virginia", label: "Who chooses the title company in Virginia" },
  { href: "/blog/enhanced-vs-standard-title-insurance", label: "Enhanced vs. standard title insurance" },
  { href: "/blog/firpta-explained-dmv", label: "FIRPTA at a DMV closing" },
];

const steps = [
  { title: "Send the file", body: "Start contract intake and I'll reply with a secure way to send the ratified contract." },
  { title: "Title opens", body: "The search is ordered and the lender gets what it needs for closing instructions." },
  { title: "Issues get cleared", body: "I share the title commitment and what has to be cleared, like payoffs and releases." },
  { title: "Closing and recording", body: "Funds are disbursed, the deed is recorded, and your buyer gets the policy." },
];

const faqs = [
  {
    question: "Can my buyer choose Pruitt Title even if the seller prefers another company?",
    answer:
      "Yes. In Virginia the buyer or borrower has the right to select the settlement agent, and the seller can't require a particular one (Va. Code § 55.1-1006). Federal law also bars a seller from requiring a particular title insurer when the loan is federally related (12 U.S.C. § 2608).",
  },
  {
    question: "Does Will pay referral fees to agents?",
    answer:
      "No. Federal law prohibits giving or accepting anything of value for referring settlement business (RESPA section 8, 12 U.S.C. § 2607). The client always chooses the title company.",
  },
  {
    question: "Where does Pruitt Title close?",
    answer:
      "Pruitt Title handles title and settlement in Northern Virginia, Maryland and Washington, DC. Its office is at 1900 Gallows Road, Suite 230, Vienna, Virginia.",
  },
  {
    question: "Who conducts a DC closing?",
    answer:
      "A notary or a title company's settlement agent can conduct the closing. Preparing the deed and other documents affecting title is the practice of law in DC (D.C. Court of Appeals Rule 49), so a DC-licensed attorney handles that part.",
  },
  {
    question: "Can Will train my office?",
    answer:
      "Yes. Will runs sessions for teams, brokerages and mortgage companies, from title insurance deep-dives to marketing workshops. See the classes page or call him to set one up.",
  },
];

const eyebrow = "text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass";
const h2 = "font-display text-3xl font-medium leading-tight text-brand-navy md:text-[2.5rem]";
const arrowLink =
  "group flex items-center justify-between border-b border-brand-line py-3.5 text-[17px] text-brand-navy transition-colors hover:text-brand-ink";

export default function RealtorsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Realtors" }]}
        eyebrow="For real estate agents"
        title="Send me your next contract."
        lede="I'm Will Rapuano. Pruitt Title and I handle title and settlement for agents across Northern Virginia, Maryland and DC, with one direct line from ratified contract to recorded deed."
        actions={
          <>
            <a href="tel:+17038591467" className="btn-primary px-8 text-center">Call (703) 859-1467</a>
            <Link href="/upload-contract" className="btn-outline px-8 text-center">Start contract intake</Link>
          </>
        }
        aside={<LeadCaptureForm location="realtors" compact />}
      />

      {/* Proof strip */}
      <section className="border-b border-brand-line bg-white">
        <div className="container-xl flex flex-wrap items-center gap-x-10 gap-y-3 py-5 text-sm text-brand-ink-light">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener" className="flex items-center gap-2 font-semibold text-brand-navy hover:underline">
            <span aria-hidden="true" className="tracking-[0.1em] text-brand-brass">★★★★★</span>
            5.0 on Google · Read the reviews
          </a>
          <span>Northern Virginia · Maryland · Washington, DC</span>
          <span>Pruitt Title · 1900 Gallows Rd, Suite 230, Vienna</span>
        </div>
      </section>

      {/* Why agents send files */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-xl grid items-center gap-12 lg:grid-cols-[400px_1fr] lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-sm bg-brand-blue-50">
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-brand-navy/5" />
            <Image
              src="/will-rapuano-headshot.jpg"
              alt="Will Rapuano, Pruitt Title"
              fill
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-contain object-bottom pt-8 [mix-blend-mode:multiply]"
            />
          </div>
          <div>
            <p className={eyebrow}>Why agents send me files</p>
            <h2 className={`${h2} mt-3`}>The title side handled, so you can work the deal.</h2>
            <div className="mt-10 space-y-8">
              {reasons.map((r) => (
                <div key={r.title} className="border-l-2 border-brand-brass pl-5">
                  <h3 className="font-display text-xl text-brand-navy">{r.title}</h3>
                  <p className="mt-1.5 max-w-[60ch] leading-relaxed text-brand-ink-light">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools and guides */}
      <section className="bg-brand-gray-bg py-16 md:py-24">
        <div className="container-xl">
          <p className={eyebrow}>Free for agents</p>
          <h2 className={`${h2} mt-3 mb-10`}>Tools for you, guides for your clients.</h2>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr]">
            <Link href="/agent-tools" className="flex flex-col justify-between rounded-sm bg-brand-navy p-8 text-white transition-opacity hover:opacity-95">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass">Contract analyzer</p>
                <p className="mt-4 font-display text-2xl leading-snug">Catch contract mistakes before they become closing problems.</p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  Upload an NVAR K1321, GCAAR 1301 or MAR contract to check for missing fields, signature issues and date conflicts.
                </p>
              </div>
              <span className="mt-8 text-sm font-bold">Open the analyzer →</span>
            </Link>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.1em] text-brand-navy">Calculators</h3>
              {tools.map((t) => (
                <Link key={t.href} href={t.href} className={arrowLink}>
                  {t.label} <span aria-hidden="true" className="text-brand-brass-dark transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.1em] text-brand-navy">Guides to send clients</h3>
              {guides.map((g) => (
                <Link key={g.href} href={g.href} className={arrowLink}>
                  {g.label} <span aria-hidden="true" className="text-brand-brass-dark transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How a file works */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-xl">
          <p className={eyebrow}>How a file works</p>
          <h2 className={`${h2} mt-3 mb-12`}>From ratified contract to recorded deed.</h2>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-brand-navy pt-5">
                <p className="font-display text-4xl text-brand-brass">{i + 1}</p>
                <h3 className="mt-3 font-display text-xl text-brand-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-light">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-sm text-brand-ink-light">
            Want training for your office?{" "}
            <Link href="/my-classes" className="font-semibold text-brand-navy underline decoration-brand-brass decoration-2 underline-offset-[3px]">
              See classes and workshops
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-brand-gray-bg py-16 md:py-24">
        <div className="container-xl max-w-4xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>
    </>
  );
}
