import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buy Now or Later Calculator | DMV Title Guy",
  description:
    "Should you buy a home now or wait? Compare the financial impact of buying today versus waiting in the DMV real estate market. Free calculator from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/buy-now-or-later" },
};

export default function BuyNowOrLaterPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Buy Now or Later</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Buy Now or Later Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Thinking about waiting to buy? Compare the total cost of purchasing a home today versus waiting — factoring in appreciation, rent payments, and changing interest rates in the DMV market.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://palmagent.com/app/calculators/"
            width="100%"
            style={{ border: "none", minHeight: "800px" }}
            title="Buy Now or Later Calculator — Pruitt Title LLC"
            allow="clipboard-write"
          />
        </div>
      </section>
    </>
  );
}
