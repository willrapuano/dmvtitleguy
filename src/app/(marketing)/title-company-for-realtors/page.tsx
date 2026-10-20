import Link from "next/link";
import { AudienceSections } from "@/components/AudienceSections";
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

const tools = [
  {
    href: "/agent-tools",
    title: "Contract analyzer",
    body: "Checks NVAR K1321, GCAAR 1301 and MAR contracts for missing fields, signature issues and date conflicts. Free for agents who work with Pruitt Title.",
  },
  {
    href: "/virginia-closing-cost-calculator",
    title: "Virginia closing cost calculator",
    body: "Recordation tax, grantor's tax and the Northern Virginia fees, with worked examples for Fairfax, Prince William and Fredericksburg.",
  },
  {
    href: "/maryland-closing-cost-calculator",
    title: "Maryland closing cost calculator",
    body: "State and county transfer and recordation tax on a $500,000 sale for seven counties, including Montgomery's tiered recordation.",
  },
  {
    href: "/dc-closing-cost-calculator",
    title: "DC closing cost calculator",
    body: "DC recordation and transfer tax at 1.1% or 1.45%, and what the 0.725% first-time buyer rate saves.",
  },
  {
    href: "/calculators/seller-net-sheet",
    title: "Seller net sheet",
    body: "Estimate a seller's proceeds before the listing appointment.",
  },
  {
    href: "/calculators/title-quote",
    title: "Title quote calculator",
    body: "Pruitt Title's live TitleCapture quote for title insurance and settlement charges.",
  },
];

const guides = [
  { href: "/blog/virginia-real-estate-contract", label: "How the Virginia real estate contract works" },
  { href: "/blog/maryland-real-estate-contract", label: "How the Maryland residential contract of sale works" },
  { href: "/blog/dc-real-estate-purchase-contract", label: "How a DC purchase contract works" },
  { href: "/blog/who-chooses-the-title-company-in-virginia", label: "Who chooses the title company in Virginia" },
  { href: "/blog/enhanced-vs-standard-title-insurance", label: "Enhanced vs. standard owner's title insurance" },
  { href: "/blog/firpta-explained-dmv", label: "FIRPTA withholding at a DMV closing" },
  { href: "/blog/types-of-property-surveys-dc-md-va", label: "Property survey types in DC, MD and VA" },
];

const steps = [
  { title: "Start intake", body: "Send Will the basic transaction details through contract intake. He replies with a secure way to send the ratified contract." },
  { title: "Title opens", body: "The Pruitt Title team orders the title search and works with the lender on its closing instructions." },
  { title: "Commitment and clearing", body: "Will shares the title commitment and what has to be cleared before closing, such as payoffs and lien releases." },
  { title: "Closing and recording", body: "The closing is held, funds are disbursed, the deed is recorded, and the title policy goes to the buyer." },
];

const faqs = [
  {
    question: "Can my buyer choose Pruitt Title even if the seller prefers another company?",
    answer:
      "Yes. In Virginia the buyer or borrower has the right to select the settlement agent, and the seller can't require a particular one (Va. Code § 55.1-1006). Federal law also bars a seller from requiring a particular title insurer when the loan is federally related (12 U.S.C. § 2608).",
  },
  {
    question: "Does DMV Title Guy pay referral fees to agents?",
    answer:
      "No. Federal law prohibits giving or accepting anything of value for referring settlement business (RESPA section 8, 12 U.S.C. § 2607). Agents work with Will because the file is handled well, and the client always chooses the title company.",
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
    question: "How do I send a contract?",
    answer:
      "Start with the contract intake form. Will replies with a secure way to send the ratified contract, so it never goes through a public form or unsecured email.",
  },
  {
    question: "Can Will train my office?",
    answer:
      "Yes. Will offers training sessions for teams, brokerages and mortgage companies, from title insurance deep-dives to marketing workshops. See the classes page or contact him to set one up.",
  },
];

export default function RealtorsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Realtors" }]}
        eyebrow="For real estate professionals"
        title="A title team that makes your deals easier across the DMV."
        lede="Will Rapuano and the Pruitt Title team handle title and settlement in Northern Virginia, Maryland and Washington DC, with one direct contact and tools you can use on every deal."
        aside={<LeadCaptureForm location="realtors" compact />}
      />
      <AudienceSections
        label="Working with Realtors"
        heading="A closing that reflects well on you."
        intro="Your client sees one transaction. Will and the Pruitt Title team keep the title side clear, so every handoff feels intentional."
        rows={[
          { title: "Contract intake", body: "Send Will the ratified contract details and he confirms the next steps with you." },
          { title: "One contact at Pruitt Title", body: "Will confirms the quote, timing and deliverables, and the Pruitt Title team handles the title work and closing." },
          { title: "Answers your clients understand", body: "Plain-language guides on title insurance, surveys, closing costs and settlement you can send to a client." },
          { title: "Local cost and process guides", body: "Compare Virginia, Maryland and DC costs and steps before you set a client's expectations." },
        ]}
        handoff="Agent → Will → Client"
        handoffNote="Direct access keeps the answer close to the person who knows the file."
        handoffLink={{ label: "Start contract intake →", href: "/upload-contract" }}
      />

      <section className="bg-brand-gray-bg py-14 md:py-16">
        <div className="container-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass">Agent tools</p>
          <h2 className="mb-8 font-display text-3xl font-medium leading-tight text-brand-navy md:text-4xl">Tools to use on every deal.</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-lg border border-brand-line bg-white p-5 transition-colors hover:border-brand-navy">
                <h3 className="mb-2 font-display text-xl text-brand-navy">{tool.title}</h3>
                <p className="text-sm leading-relaxed text-brand-ink-light">{tool.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-[70px]">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass">Client guides</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-brand-navy md:text-4xl">Guides to send before a deadline slips.</h2>
          </div>
          <ul className="flex flex-col border-t border-brand-line">
            {guides.map((item) => (
              <li key={item.href} className="border-b border-brand-line">
                <Link href={item.href} className="flex items-center justify-between py-4 font-display text-xl text-brand-navy hover:text-brand-ink">
                  {item.label} <span aria-hidden="true" className="text-brand-brass-dark">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-gray-bg py-14 md:py-16">
        <div className="container-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass">How a file works</p>
          <h2 className="mb-8 font-display text-3xl font-medium leading-tight text-brand-navy md:text-4xl">From ratified contract to recorded deed.</h2>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-lg border border-brand-line bg-white p-5">
                <p className="mb-1 text-sm font-bold text-brand-brass-dark">{i + 1}</p>
                <h3 className="mb-2 font-display text-xl text-brand-navy">{step.title}</h3>
                <p className="text-sm leading-relaxed text-brand-ink-light">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-brand-ink-light max-w-[68ch]">
            Want training for your office? Will runs sessions for teams, brokerages and mortgage companies; see{" "}
            <Link href="/my-classes" className="font-semibold text-brand-navy hover:underline">classes and workshops</Link>.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-4xl">
          <h2 className="mb-6 font-display text-3xl font-medium leading-tight text-brand-navy md:text-4xl">Questions agents ask</h2>
          <FAQSection faqs={faqs} />
        </div>
      </section>
    </>
  );
}
