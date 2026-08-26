"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ACCORDION_ITEMS = [
  {
    title: "Our Reputation",
    body: "Pruitt Title LLC is an independently owned title, settlement, and escrow company based in Vienna, Virginia, with service across Virginia, Maryland, and Washington DC. Its public process emphasizes transaction communication, title review, settlement coordination, recording, and post-closing support.",
  },
  {
    title: "Our Resources",
    body: "Pruitt Title is an authorized agent of First American Title Insurance Company, one of the nation's leading providers of title insurance and a Fortune 500 company. This partnership gives us access to cutting-edge technology, extensive underwriting expertise, and financial resources that smaller title companies simply cannot match. When you work with us, you get local service backed by national strength.",
  },
  {
    title: "Our Marketing",
    body: "Will Rapuano brings experience in video marketing, digital advertising, and real estate technology. Through DMV Title Guy, he shares educational resources, classes, and practical tools designed to help agents and other real estate professionals prepare for smoother transactions.",
  },
  {
    title: "Our Size",
    body: "Pruitt Title operates as an independent title agency with a local DMV team. Its underwriter relationship and local staff support title examination, underwriting coordination, settlement, recording, and post-closing work without presenting this website as Pruitt's corporate site.",
  },
  {
    title: "Our Technology",
    body: "We leverage the latest technology to streamline the closing process for all parties. From digital closings and e-signatures to real-time status updates and secure document sharing, our tech stack is designed to make every transaction faster, more transparent, and more convenient for agents, lenders, and their clients.",
  },
  {
    title: "Our Flexibility",
    body: "Pruitt Title's public service information covers residential purchases, commercial transactions, refinances, resale closings, and new construction. Availability, underwriting, documentation, and closing requirements are confirmed after the team reviews the specific property and transaction.",
  },
  {
    title: "Our Strength",
    body: "First American Title Insurance Company provides the financial reserves and stability that protect every policy we issue. With over a century of experience and billions in assets, First American's financial strength means your clients' title insurance policies are backed by one of the strongest companies in the industry.",
  },
  {
    title: "Our Diversity",
    body: "Pruitt Title LLC is a proud woman-owned business with a diverse team that reflects the communities we serve. We believe diversity drives better outcomes — for our clients, our partners, and our industry. Our inclusive approach to business ensures that every client feels welcome and valued.",
  },
  {
    title: "Our People",
    body: "Will Rapuano is listed by Pruitt Title as its Marketing and Business Development Officer. He hosts classes, organizes industry events, and creates practical resources for real estate professionals while connecting transaction questions to the appropriate Pruitt Title team member.",
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
            Why Pruitt Title?
          </h1>
        </div>
      </section>

      {/* 9 Reasons Accordion */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-2">
            9 Reasons Why Real Estate Professionals Choose Pruitt Title
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
              First American Title Insurance Company provides title insurance that gives you the assurance that possible
              clouds on title to the property you are purchasing have been investigated and resolved. Additionally, it is
              insurance that if any undiscovered claims arise out of the past to threaten your ownership, they will be
              disposed of, or you will be reimbursed as your title insurance policy provides.
            </p>
            <p className="max-w-[68ch]">
              Pruitt Title LLC works with First American Title Insurance Company, a respected Fortune 500 leader in the
              industry, combining local DMV expertise with national financial strength to protect your investment. Whether
              you&apos;re a first-time buyer, seasoned investor, or industry professional — title insurance is the foundation
              that protects your most important transaction.
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
          <h2 className="t-h2 text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 max-w-[68ch] leading-relaxed">
            Contact Will Rapuano at Pruitt Title LLC for a title insurance quote or to open your order today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/title-quote" className="btn-light px-8 py-3.5">
              Get a Quote
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
