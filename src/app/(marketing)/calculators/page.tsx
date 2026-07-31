import { CalendarDays, FileText, Hammer, Handshake, Home as HomeIcon, Hourglass, KeyRound, PieChart, Receipt, Scale, Tag, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/** Emoji were standing in for icons; lucide-react was already a dependency. */
const CALC_ICONS = { CalendarDays, FileText, Hammer, Handshake, HomeIcon, Hourglass, KeyRound, PieChart, Receipt, Scale, Tag, Zap } as const;

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
    icon: "Tag",
    tag: "Title",
  },
  {
    href: "/calculators/loan-estimate",
    title: "Loan Estimate Calculator",
    description:
      "Generate a detailed loan estimate with projected closing costs for buyers and lenders.",
    icon: "FileText",
    tag: "Buyers",
  },
  {
    href: "/calculators/seller-net-sheet",
    title: "Seller Net Sheet Calculator",
    description:
      "Calculate exactly how much you'll walk away with after commissions, fees, and closing costs.",
    icon: "Receipt",
    tag: "Sellers",
  },

  {
    href: "/calculators/monthly-affordability",
    title: "Monthly Affordability Calculator",
    description:
      "Find out how much home you can afford based on your income, debts, and down payment.",
    icon: "PieChart",
    tag: "Buyers",
  },
  {
    href: "/calculators/flip",
    title: "House Flip Calculator",
    description:
      "Calculate profit, ROI, and Maximum Allowable Offer (MAO) for your next fix-and-flip deal.",
    icon: "Hammer",
    tag: "Investors",
  },
  {
    href: "/calculators/compensation",
    title: "Agent Compensation Calculator",
    description:
      "Calculate your real take-home after commission splits, broker fees, and referral deductions.",
    icon: "Handshake",
    tag: "Agents",
  },
  {
    href: "/calculators/extra-payment",
    title: "Extra Loan Payment Calculator",
    description:
      "See how much interest you save and how many years you cut by making extra monthly payments.",
    icon: "Zap",
    tag: "Buyers",
  },
  {
    href: "/calculators/smart-compare",
    title: "Smart Compare Calculator",
    description:
      "Compare two properties or loan scenarios side by side with a full monthly cost breakdown.",
    icon: "Scale",
    tag: "Buyers",
  },
  {
    href: "/calculators/amortization",
    title: "Amortization Calculator",
    description:
      "View your full mortgage amortization schedule — year by year principal, interest, and balance.",
    icon: "CalendarDays",
    tag: "Buyers",
  },
  {
    href: "/calculators/home-equity",
    title: "Home Equity Calculator",
    description:
      "Know your equity, current LTV, and how much you can tap through a cash-out refi or HELOC.",
    icon: "HomeIcon",
    tag: "Homeowners",
  },
  {
    href: "/calculators/rent-vs-buy",
    title: "Rent vs Buy Calculator",
    description:
      "Should you rent or buy? Compare the long-term financial impact of both options in the DMV market.",
    icon: "KeyRound",
    tag: "Buyers",
  },
  {
    href: "/calculators/buy-now-or-later",
    title: "Buy Now or Later Calculator",
    description:
      "Thinking about waiting? Compare the total cost of buying today versus waiting — with appreciation, rent, and rate changes.",
    icon: "Hourglass",
    tag: "Buyers",
  },
];

export default function CalculatorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>Calculators</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tools</p>
          <h1 className="t-h1 text-white mb-4">
            Real Estate Calculators
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Instant estimates powered by Pruitt Title LLC — title quotes, net sheets, loan estimates, and more for DC, Maryland, and Virginia transactions.
          </p>
        </div>
      </section>

      {/* CALCULATOR GRID */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATORS.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group surface-card block p-6 transition-colors duration-150 hover:border-brand-blue"
              >
                <div className="flex items-start justify-between mb-3">
                  {(() => {
                    const Icon = CALC_ICONS[calc.icon as keyof typeof CALC_ICONS];
                    return (
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue-50">
                        <Icon size={19} strokeWidth={1.75} className="text-brand-blue-deep" aria-hidden="true" />
                      </span>
                    );
                  })()}
                  <span className="text-xs font-semibold text-brand-blue-deep bg-blue-50 px-2 py-0.5 rounded-full">{calc.tag}</span>
                </div>
                <h2 className="t-h6 text-brand-navy group-hover:text-brand-blue mb-2 transition-colors">
                  {calc.title}
                </h2>
                <p className="text-sm text-brand-muted leading-relaxed max-w-[68ch]">{calc.description}</p>
                <span className="inline-block mt-4 text-sm text-brand-blue-deep font-medium">
                  Open Calculator →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
