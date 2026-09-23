import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Real Estate Calculators | DMV Title Guy",
  description:
    "Free real estate calculators from Pruitt Title LLC. Get instant title quotes, seller net sheets, loan estimates, and affordability analysis for DC, Maryland, and Virginia.",
  alternates: { canonical: "/calculators" },
};

const CALCULATORS = [
  {
    href: "/calculators/title-quote",
    title: "Title Quote Calculator",
    description:
      "Get an instant title insurance quote for your DC, Maryland, or Virginia real estate transaction.",
    tag: "Title",
  },
  {
    href: "/calculators/loan-estimate",
    title: "Loan Estimate Calculator",
    description:
      "Generate a detailed loan estimate with projected closing costs for buyers and lenders.",
    tag: "Buyers",
  },
  {
    href: "/calculators/seller-net-sheet",
    title: "Seller Net Sheet Calculator",
    description:
      "Calculate exactly how much you'll walk away with after commissions, fees, and closing costs.",
    tag: "Sellers",
  },

  {
    href: "/calculators/monthly-affordability",
    title: "Monthly Affordability Calculator",
    description:
      "Find out how much home you can afford based on your income, debts, and down payment.",
    tag: "Buyers",
  },
  {
    href: "/calculators/flip",
    title: "House Flip Calculator",
    description:
      "Calculate profit, ROI, and Maximum Allowable Offer (MAO) for your next fix-and-flip deal.",
    tag: "Investors",
  },
  {
    href: "/calculators/compensation",
    title: "Agent Compensation Calculator",
    description:
      "Calculate your real take-home after commission splits, broker fees, and referral deductions.",
    tag: "Agents",
  },
  {
    href: "/calculators/extra-payment",
    title: "Extra Loan Payment Calculator",
    description:
      "See how much interest you save and how many years you cut by making extra monthly payments.",
    tag: "Buyers",
  },
  {
    href: "/calculators/smart-compare",
    title: "Smart Compare Calculator",
    description:
      "Compare two properties or loan scenarios side by side with a full monthly cost breakdown.",
    tag: "Buyers",
  },
  {
    href: "/calculators/amortization",
    title: "Amortization Calculator",
    description:
      "View your full mortgage amortization schedule — year by year principal, interest, and balance.",
    tag: "Buyers",
  },
  {
    href: "/calculators/home-equity",
    title: "Home Equity Calculator",
    description:
      "Know your equity, current LTV, and how much you can tap through a cash-out refi or HELOC.",
    tag: "Homeowners",
  },
  {
    href: "/calculators/rent-vs-buy",
    title: "Rent vs Buy Calculator",
    description:
      "Should you rent or buy? Compare the long-term financial impact of both options in the DMV market.",
    tag: "Buyers",
  },
  {
    href: "/calculators/buy-now-or-later",
    title: "Buy Now or Later Calculator",
    description:
      "Thinking about waiting? Compare the total cost of buying today versus waiting — with appreciation, rent, and rate changes.",
    tag: "Buyers",
  },
];

export default function CalculatorsPage() {
  const [primary, ...rest] = CALCULATORS;
  return (
    <>
      {/* HERO */}
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-[#C9D6E0]">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2 text-white/30" aria-hidden="true">/</span>
            <span>Calculators</span>
          </nav>
          <p className="page-hero-eyebrow">Free tools</p>
          <h1 className="t-h1 text-white">Real Estate Calculators</h1>
          <p className="page-hero-lede">
            Instant estimates powered by Pruitt Title LLC — title quotes, net sheets, loan estimates, and more for DC, Maryland, and Virginia transactions.
          </p>
        </div>
      </section>

      {/* CALCULATOR GRID */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-xl">
          <Link
            href={primary.href}
            className="group grid gap-6 border-b border-brand-line pb-14 md:grid-cols-[1fr_auto] md:items-end md:gap-16"
          >
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-ink-light">Start here · {primary.tag}</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-[-0.02em] text-brand-navy md:text-[3.25rem] md:leading-[1.05]">
                {primary.title}
              </h2>
              <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-brand-ink">{primary.description}</p>
            </div>
            <span className="btn-brass w-fit px-7">Open the calculator <span aria-hidden="true">→</span></span>
          </Link>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group block border-t-2 border-brand-navy pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-light">{calc.tag}</p>
                <h2 className="mt-2.5 font-display text-[1.625rem] font-medium leading-[1.2] tracking-[-0.01em] text-brand-navy group-hover:underline group-hover:decoration-brand-brass group-hover:decoration-2 group-hover:underline-offset-4">
                  {calc.title}
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-brand-ink-light">{calc.description}</p>
                <span className="mt-4 inline-block text-[15px] font-bold text-brand-navy">
                  Open calculator <span aria-hidden="true" className="text-brand-brass">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
