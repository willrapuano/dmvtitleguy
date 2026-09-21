"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ACCORDION_ITEMS = [
  {
    title: "Company & Authorization",
    body: "Confirm the provider's legal identity, licensing or authorization, underwriter relationships, service area, and the entity that will receive funds and issue documents. Use the provider's official website and transaction disclosures as the authority.",
  },
  {
    title: "Title Insurance & Underwriting",
    body: "Ask which policy and endorsements may be available, who the underwriter is, and which exclusions, exceptions, conditions, and transaction-specific underwriting requirements may apply.",
  },
  {
    title: "Education & Preparation",
    body: "Useful calculators, plain-language explanations, and early issue spotting can help parties ask better questions. These resources are educational and do not replace a provider's file-specific review.",
  },
  {
    title: "Team & Capacity",
    body: "Ask who will examine title, coordinate settlement, handle funds, support signing, record documents, and respond after closing—and whether the team has capacity for the transaction's actual deadline.",
  },
  {
    title: "Process & Communication",
    body: "Ask how the provider shares milestones, requests documents, reports title issues, confirms signing logistics, and handles recording and post-closing questions.",
  },
  {
    title: "Transaction Fit",
    body: "Residential purchases, commercial matters, refinances, estates, new construction, and investor transactions can require different experience. Confirm the provider accepts the specific property, jurisdiction, lender, and transaction type.",
  },
  {
    title: "Policy-Specific Protection",
    body: "Title insurance protection is governed by the policy actually issued, including covered risks, exclusions, exceptions, and conditions. Ask the accepted provider to explain the available policy and endorsements.",
  },
  {
    title: "Service Area & Signing",
    body: "Confirm that the provider can serve the property jurisdiction and support the needed signing method. Remote, mobile, or in-office options can depend on the state, lender, documents, and transaction.",
  },
  {
    title: "Will, DMV Title Guy & Pruitt",
    body: "Will Rapuano operates DMV Title Guy and works as Pruitt Title's Marketing and Business Development Officer. DMV Title Guy is not Pruitt's corporate site. A requested introduction does not bind Pruitt; Pruitt independently confirms acceptance and terms.",
  },
];

const REASONS_FOR_TITLE_INSURANCE = [
  "There may be liens against the property for unpaid taxes or mortgages",
  "The property may be subject to an easement that limits its use",
  "There could be errors in the public records affecting the title",
  "A previous owner may have had liens filed against the property",
  "The deed may have been forged or executed under fraud",
  "The seller may not have had legal authority to sell",
  "An undisclosed heir may claim ownership of the property",
  "There may be restrictive covenants limiting the use of the property",
  "The property may have been sold by someone who was legally incompetent",
  "The property boundaries may have been inaccurately surveyed",
  "There may be outstanding building permits or code violations",
  "A previous owner may have made improvements without proper permits",
  "There may be judgment liens from lawsuits against a previous owner",
  "The property may be subject to mechanics' liens from contractors",
  "Federal or state tax liens may exist against the property",
  "There may be pending legal action that affects the property",
  "The property may have been conveyed through a defective will",
  "There may be dower or curtesy rights that affect the title",
  "The property may be subject to zoning violations",
  "There may be errors in the legal description of the property",
  "The property may have been transferred without the consent of all owners",
];

export function WhyChooseUsClient() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src="/office-bg.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/80" />
        <div className="container-xl relative z-10 text-center">
          <h1 className="t-display text-white">
            How to Choose a Title Provider
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
            Will Rapuano operates DMV Title Guy as an education and business-development website separate from Pruitt Title LLC&apos;s corporate website. Will is Pruitt&apos;s Marketing and Business Development Officer. Eligible transaction requests may be referred to Pruitt for independent review; submission does not mean Pruitt has accepted the transaction.
          </p>
        </div>
      </section>

      {/* 9 Reasons Accordion */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-2">
            9 Questions to Ask Before You Choose
          </h2>
          <div className="mt-10 space-y-3">
            {ACCORDION_ITEMS.map((item, i) => {
              const buttonId = `why-pruitt-trigger-${i}`;
              const panelId = `why-pruitt-panel-${i}`;
              const isOpen = openItem === i;

              return (
                <div
                  key={item.title}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenItem(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-action"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-action text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-bold text-brand-navy">{item.title}</span>
                    </div>
                    <span aria-hidden="true" className={`text-brand-blue-deep text-lg transition-transform duration-200 motion-reduce:transition-none flex-shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-6 pb-5 pt-1 border-t border-gray-100"
                  >
                    <p className="text-brand-muted leading-relaxed text-sm max-w-[68ch]">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protect Your Real Estate Investment */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-2">Protect Your Real Estate Investment</h2>
          <div className="text-brand-muted leading-relaxed space-y-4 mt-8">
            <p className="max-w-[68ch]">
              Real estate has traditionally been a family&apos;s most valuable asset. It is a form of wealth that is protected
              by many laws that have been enacted to protect one&apos;s ownership and the improvements located on the land.
              The owner, the owner&apos;s family, and the owner&apos;s heirs have extremely strong rights in and to the property
              you are purchasing.
            </p>
            <p className="max-w-[68ch]">
              A title search and underwriting review can identify recorded matters before settlement. An owner&apos;s title
              insurance policy can provide protection against covered title risks, subject to the policy&apos;s terms,
              exclusions, exceptions, and conditions.
            </p>
            <p className="max-w-[68ch]">
              If you request an introduction through DMV Title Guy, an eligible matter may be referred to Pruitt Title
              for independent review. Pruitt decides whether to accept the matter and confirms any available policy,
              endorsements, signing options, pricing, timing, terms, and required disclosures directly.
            </p>
          </div>
        </div>
      </section>

      {/* 21 Reasons For Title Insurance */}
      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <h2 className="prose-title text-center mb-2">21 Reasons For Title Insurance</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 mt-10">
            {REASONS_FOR_TITLE_INSURANCE.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <span className="bg-brand-action text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-brand-muted text-sm leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-blue">
        <div className="container-xl text-center max-w-2xl">
          <h2 className="t-h2 text-white mb-4">Have a Transaction Question?</h2>
          <p className="text-white/80 mb-8 max-w-[68ch] leading-relaxed">
            Contact Will through DMV Title Guy for an educational answer or to request a provider introduction. Submission does not create a Pruitt Title service relationship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/title-quote" className="btn-light px-8 py-3.5">
              Estimate Closing Costs
            </Link>
            <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3.5">
              Call (703) 859-1467
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
