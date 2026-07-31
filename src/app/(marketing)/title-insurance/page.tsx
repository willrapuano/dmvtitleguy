import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { FAQSection } from "@/components/FAQSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Title Insurance Resources | DMV Title Guy",
  description:
    "Downloadable title insurance resources, FAQs, and educational guides from Pruitt Title LLC. Serving Washington D.C., Maryland, and Virginia.",
  alternates: { canonical: "/title-insurance" },
};

const resources = [
  { title: "Title Insurance FAQ", file: "/guides/title-insurance-faq.pdf" },
  { title: "A Guide to Title Insurance", file: "/guides/a-guide-to-title-insurance.pdf" },
  { title: "What is Title Insurance?", file: "/guides/what-is-title-insurance.pdf" },
  { title: "Why Title Insurance?", file: "/guides/21-reasons-for-title-insurance.pdf" },
  { title: "Types of Deeds in DMV", file: "/guides/property-deeds-guide.pdf" },
  { title: "Wire Fraud Prevention Guide", file: "/guides/wire-fraud-prevention-guide.pdf" },
  { title: "Typical Settlement Costs in DMV", file: "/guides/typical-settlement-costs-dmv.pdf" },
  { title: "Contract to Close Chart", file: "/guides/contract-to-close-chart.pdf" },
];

const titleInsuranceFaqs = [
  {
    question: "What is title insurance?",
    answer: "Title insurance protects property buyers and mortgage lenders against losses from defects in the title to real property. It covers issues that may have existed before you purchased the property, such as unpaid taxes, liens, fraud, or recording errors.",
  },
  {
    question: "Do I need both lender's and owner's title insurance?",
    answer: "Your mortgage lender will require a lender's title insurance policy. An owner's policy is optional but strongly recommended — it protects your equity and ownership rights for as long as you or your heirs own the property, with only a one-time premium at closing.",
  },
  {
    question: "How much does title insurance cost in DC, Maryland, and Virginia?",
    answer: "Title insurance premiums vary by state and property value. In Virginia and Maryland, rates are regulated and based on the property's sale price. In DC, rates may vary. Pruitt Title LLC can provide a free quote for your specific transaction.",
  },
  {
    question: "What does a title search find?",
    answer: "A title search examines public records to identify unpaid taxes, unsatisfied mortgages, judgments, tax liens, easements, restrictions, and court actions that could affect your ownership of the property.",
  },
  {
    question: "How long does title insurance last?",
    answer: "An owner's title insurance policy lasts for as long as you or your heirs own the property. There are no annual payments — the original premium paid at closing is your only cost.",
  },
];

export default function TitleInsurancePage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Title Insurance" }]}
        eyebrow="Understand what protects the property"
        title="Title Insurance Resources"
        lede="Plain-English guidance, downloadable checklists, and answers for buyers, agents, and lenders navigating title insurance across DC, Maryland, and Virginia."
        actions={
          <>
            <Link href="/calculators/title-quote" className="btn-primary px-7">Get a Title Quote</Link>
            <Link href="#resources" className="btn-on-dark px-7">Browse the Guides</Link>
          </>
        }
      />

      {/* Downloadable Resources */}
      <section
        id="resources"
        className="py-16 md:py-20"
        style={{ backgroundColor: "var(--site-blush)" }}
      >
        <div className="container-xl">
          <h2 className="t-h2 text-brand-navy text-center mb-10">
            Downloadable Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {resources.map((r) => (
              <a
                key={r.title}
                href={r.file}
                download
                className="resource-download-btn flex items-center gap-3 justify-center rounded-md px-6 py-4 font-semibold text-white transition-colors duration-200 text-center"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <span>{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="section-light">
        <div className="container-xl max-w-3xl space-y-12">
          {/* Word About Real Estate */}
          <div>
            <h2 className="prose-title mb-4">A Word About Real Estate</h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                Real estate has traditionally been a family&apos;s most valuable
                asset in the DMV area. It is a form of wealth that is protected
                by many laws in Washington D.C., Maryland, and Virginia. These
                laws have been enacted to protect one&apos;s ownership of real
                estate and the improvements located on the land.
              </p>
              <p className="max-w-[68ch]">
                The owner, the owner&apos;s family, and the owner&apos;s heirs
                have extremely strong rights in and to the property you are
                purchasing. In addition to the owner, there may be others who
                have rights or claims in and to the property that you are buying.
              </p>
              <p className="max-w-[68ch]">
                Those who may have an interest in or lien upon the property could
                be governmental bodies, contractors, lenders, judgment creditors,
                the Internal Revenue Service or various other individuals or
                corporations.
              </p>
              <p className="max-w-[68ch]">
                The real estate may be sold to you without the knowledge of the
                party having claim in and to the property. In addition, you may
                purchase the real estate without having any knowledge of these
                rights or claims. In either event, these rights or claims remain
                attached to the title of the property that you are buying until
                they are extinguished.
              </p>
            </div>
          </div>

          {/* Title Insurance Protects Your Assets */}
          <div>
            <h2 className="prose-title mb-4">
              Title Insurance Protects Your Assets
            </h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                Title insurance gives you the assurance that possible clouds on
                title to the property you are purchasing in the DMV—which can be
                discovered from the public records—have been called to your
                attention so that such defects can be corrected before you buy.
              </p>
              <p className="max-w-[68ch]">
                Additionally, it is insurance that if any undiscovered claims
                covered by your policy arise out of the past to threaten your
                ownership of real estate, it will be disposed of, or you will be
                reimbursed exactly as your title insurance policy provides.
              </p>
              <p className="max-w-[68ch]">
                Pruitt Title LLC works with First American Title Insurance
                Company, a respected Fortune 500 leader in the industry,
                combining local DMV expertise with national financial strength to
                protect your investment.
              </p>
            </div>
          </div>

          {/* Will You Get Clear Title? */}
          <div>
            <h2 className="prose-title mb-4">Will You Get Clear Title?</h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                It is of utmost importance that you receive clear title to the
                property when you purchase real estate in Washington D.C.,
                Maryland, or Virginia. In order to do so, you must first be
                informed of any existing rights or claims that may be asserted by
                any party against the title to the property.
              </p>
              <p className="max-w-[68ch]">
                Any of those rights or claims that are unacceptable to you must
                be resolved or extinguished prior to your purchase of the
                property. In addition, you will want to be protected against any
                past undiscovered rights or claims that may, in the future,
                threaten your title and possession of the property.
              </p>
              <p>
                Title insurance provides you with this twofold protection
                throughout the DMV area.
              </p>
            </div>
          </div>

          {/* How Do You Find Out What Claims Exist? */}
          <div>
            <h2 className="prose-title mb-4">
              How Do You Find Out What Claims Exist?
            </h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                In order to determine the status of title, First American Title
                conducts a diligent search of the public records in Washington
                D.C., Maryland, and Virginia for the documents associated with
                the property.
              </p>
              <p className="max-w-[68ch]">
                First American Title then examines those recorded documents in
                order to determine if there are any rights or claims that may
                have an impact upon the title such as unpaid taxes, unsatisfied
                mortgages, judgments, and tax liens against the current or past
                owners, easements, restrictions, and court actions.
              </p>
              <p className="max-w-[68ch]">
                These recorded defects, liens, and encumbrances are reported to
                you prior to your purchase of the property. Once reported, these
                matters can be accepted, resolved or extinguished prior to the
                closing of the transaction.
              </p>
              <p className="max-w-[68ch]">
                In addition, you are protected against any recorded defects,
                liens, or encumbrances upon the title that are unreported to you
                and which are within the coverage of the particular policy issued
                in the transaction. This is the first benefit you receive from
                title insurance.
              </p>
            </div>
          </div>

          {/* Only One Title Premium */}
          <div>
            <h2 className="prose-title mb-4">Only One Title Premium</h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                Unlike other forms of insurance, the original premium is your
                only cost as long as you or your heirs own the property. There
                are no annual payments to keep your Owner&apos;s Title Insurance
                Policy in force.
              </p>
            </div>
          </div>

          {/* What About Undiscovered Claims? */}
          <div>
            <h2 className="prose-title mb-4">
              What About Undiscovered Claims?
            </h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p className="max-w-[68ch]">
                The title to the property that you have purchased could be
                seriously threatened or lost completely by hazards that are
                considered &ldquo;hidden risks.&rdquo;
              </p>
              <p className="max-w-[68ch]">
                &ldquo;Hidden risks&rdquo; are those matters, rights, or claims
                that are not shown by the public records and, therefore are not
                discoverable by a search and examination of the public records.
              </p>
              <p className="max-w-[68ch]">
                Matters such as forgery, incompetency or incapacity of the
                parties, fraudulent impersonation, and unknown errors in the
                records are examples of &ldquo;hidden risks&rdquo; which could
                provide a basis for a claim after you have purchased the
                property. In order to protect you against this possibility, First
                American Title provides insurance coverage for such claims. This
                is the second benefit you receive from title insurance.
              </p>
            </div>
          </div>

          {/* How Does A Title Insurance Policy Protect Against All These Claims? */}
          <div>
            <h2 className="prose-title mb-4">
              How Does A Title Insurance Policy Protect Against All These
              Claims?
            </h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p>
                If a claim is made against your insured title, First American
                Title protects you by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  Defending your title in the court if necessary, at no cost to
                  you, and
                </li>
                <li>
                  Bearing the cost of settling the case if it proves valid, in
                  order to protect your title and maintain the possession of your
                  property.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={titleInsuranceFaqs} />
        </div>
      </section>

      {/* CTA / Contact Form */}
      <section className="section-gray">
        <div className="container-xl text-center">
          <h2 className="prose-title mb-4">Ready to Open a Title Order?</h2>
          <p className="prose-subtitle max-w-xl mx-auto mb-6">
            Contact Will Rapuano at Pruitt Title LLC for a title insurance quote
            or to open your order today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/calculators/title-quote" className="btn-primary">
              Get a Quote
            </Link>
            <a href="tel:+17038591467" className="btn-outline">
              Call (703) 859-1467
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
