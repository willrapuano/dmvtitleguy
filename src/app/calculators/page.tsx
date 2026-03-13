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
    icon: "🏷️",
  },
  {
    href: "/calculators/loan-estimate",
    title: "Loan Estimate Calculator",
    description:
      "Generate a detailed loan estimate with projected closing costs for buyers and lenders.",
    icon: "📋",
  },
  {
    href: "/calculators/seller-net-sheet",
    title: "Seller Net Sheet Calculator",
    description:
      "Calculate exactly how much you'll walk away with after commissions, fees, and closing costs.",
    icon: "💰",
  },
  {
    href: "/calculators/rent-vs-buy",
    title: "Rent vs. Buy Calculator",
    description:
      "Compare the true cost of renting versus buying a home in the DMV market.",
    icon: "🏠",
  },
  {
    href: "/calculators/monthly-affordability",
    title: "Monthly Affordability Calculator",
    description:
      "Find out how much home you can afford based on your income, debts, and down payment.",
    icon: "📊",
  },
];

export default function CalculatorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>Calculators</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tools</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
                className="group block border border-brand-gray-bg rounded-lg p-6 bg-white hover:border-brand-blue hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{calc.icon}</div>
                <h2 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue mb-2 transition-colors">
                  {calc.title}
                </h2>
                <p className="text-sm text-brand-muted leading-relaxed">{calc.description}</p>
                <span className="inline-block mt-4 text-sm text-brand-blue font-medium">
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
