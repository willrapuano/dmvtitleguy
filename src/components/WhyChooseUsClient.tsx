"use client";

import { useState } from "react";
import Link from "next/link";

const ACCORDION_ITEMS = [
  {
    title: "Our Reputation",
    body: "Pruitt Title LLC was established in 2007 as a locally-owned, woman-owned title and settlement company based in Vienna, Virginia. For nearly two decades, we've built a reputation for professionalism, integrity, and exceptional service throughout the DMV region. Our clients trust us because we consistently deliver smooth closings and clear communication.",
  },
  {
    title: "Our Resources",
    body: "Pruitt Title is an authorized agent of First American Title Insurance Company, one of the nation's leading providers of title insurance and a Fortune 500 company. This partnership gives us access to cutting-edge technology, extensive underwriting expertise, and financial resources that smaller title companies simply cannot match. When you work with us, you get local service backed by national strength.",
  },
  {
    title: "Our Marketing",
    body: "Will Rapuano brings a unique background in video marketing, digital advertising, and real estate technology. Unlike traditional title companies, we actively help our referral partners grow their businesses through innovative marketing strategies, educational workshops, and creative campaigns. Our marketing support is a value-add that sets us apart from every other title company in the DMV.",
  },
  {
    title: "Our Size",
    body: "We're a nimble, locally-owned company that provides the personalized attention and fast turnarounds that large title companies can't match — while still having the backing of First American's national infrastructure. You get the best of both worlds: the responsiveness of a boutique firm and the resources of a Fortune 500 company.",
  },
  {
    title: "Our Technology",
    body: "We leverage the latest technology to streamline the closing process for all parties. From digital closings and e-signatures to real-time status updates and secure document sharing, our tech stack is designed to make every transaction faster, more transparent, and more convenient for agents, lenders, and their clients.",
  },
  {
    title: "Our Flexibility",
    body: "Whether it's a residential purchase, commercial transaction, luxury property, new construction deal, refinance, or investor flip — we handle every type of closing with the same level of professionalism and care. No transaction type is outside our expertise, and we adapt our process to fit the unique needs of each deal.",
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
    body: "Will Rapuano is an educator, a connector, and an advocate for real estate professionals in the DMV. Recognized among the top 5% of title insurance executives nationwide, Will goes beyond just closing transactions — he hosts free CE classes, organizes industry events, and provides one-on-one mentorship to help agents and lenders grow their businesses. When you partner with Pruitt Title, you're partnering with people who genuinely care about your success.",
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/80" />
        <div className="container-xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
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
          <div className="accent-divider" />
          <div className="mt-10 space-y-3">
            {ACCORDION_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenItem(openItem === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-brand-navy">{item.title}</span>
                  </div>
                  <span className={`text-brand-blue text-lg transition-transform duration-200 flex-shrink-0 ml-4 ${openItem === i ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {openItem === i && (
                  <div className="px-6 pb-5 pt-1 border-t border-gray-100">
                    <p className="text-brand-muted leading-relaxed text-sm">{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protect Your Real Estate Investment */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-2">Protect Your Real Estate Investment</h2>
          <div className="accent-divider" />
          <div className="text-brand-muted leading-relaxed space-y-4 mt-8">
            <p>
              Real estate has traditionally been a family&apos;s most valuable asset. It is a form of wealth that is protected
              by many laws that have been enacted to protect one&apos;s ownership and the improvements located on the land.
              The owner, the owner&apos;s family, and the owner&apos;s heirs have extremely strong rights in and to the property
              you are purchasing.
            </p>
            <p>
              First American Title Insurance Company provides title insurance that gives you the assurance that possible
              clouds on title to the property you are purchasing have been investigated and resolved. Additionally, it is
              insurance that if any undiscovered claims arise out of the past to threaten your ownership, they will be
              disposed of, or you will be reimbursed as your title insurance policy provides.
            </p>
            <p>
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
          <div className="accent-divider" />
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 mt-10">
            {REASONS_FOR_TITLE_INSURANCE.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <span className="bg-brand-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">
            Contact Will Rapuano at Pruitt Title LLC for a title insurance quote or to open your order today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/title-quote" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
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
