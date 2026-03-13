"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type State = "VA" | "MD" | "DC";
type PartyType = "buyer" | "seller" | "both";

interface CalculatorConfig {
  state: State;
  stateFullName: string;
  transferTaxNote: string;
}

const CONFIGS: Record<State, CalculatorConfig> = {
  VA: {
    state: "VA",
    stateFullName: "Virginia",
    transferTaxNote: "VA grantor tax: $0.50/$500 on seller side. Some localities add recordation tax.",
  },
  MD: {
    state: "MD",
    stateFullName: "Maryland",
    transferTaxNote: "MD state transfer tax: 0.5% (1% if buyer not owner-occupied). County transfer tax varies.",
  },
  DC: {
    state: "DC",
    stateFullName: "Washington DC",
    transferTaxNote: "DC recordation & transfer taxes: combined ~2.9% on properties over $400K.",
  },
};

function calculateVA(price: number, loanAmount: number, party: PartyType) {
  const isResale = true;

  const buyerCosts = {
    titleSearch: 250,
    titleInsuranceLender: price * 0.0035,
    titleInsuranceOwner: price * 0.004,
    settlementFee: 495,
    recordingFee: price < 500000 ? 100 : 150,
    recordationTax: price * 0.0025, // state recordation tax (buyer portion)
    loanOriginationEst: loanAmount * 0.01,
    appraisal: 550,
    homeInspection: 450,
    prepaidItems: loanAmount * 0.015,
  };

  const sellerCosts = {
    agentCommission: price * 0.025, // 2.5% seller side
    grantorTax: price * 0.001, // $0.50/$500
    settlementFee: 295,
    recordingFee: 50,
    payoffProcessing: 75,
    titleSearch: 150,
  };

  return { buyerCosts, sellerCosts };
}

function calculateMD(price: number, loanAmount: number, party: PartyType) {
  const countyTransferTax = 0.01; // Montgomery County default

  const buyerCosts = {
    titleSearch: 250,
    titleInsuranceLender: price * 0.004,
    titleInsuranceOwner: price * 0.0045,
    settlementFee: 495,
    recordingFee: 150,
    stateTransferTax: price * 0.005,
    countyTransferTax: price * countyTransferTax,
    stateRecordationTax: price * 0.005,
    loanOriginationEst: loanAmount * 0.01,
    appraisal: 600,
    prepaidItems: loanAmount * 0.015,
  };

  const sellerCosts = {
    agentCommission: price * 0.025,
    stateTransferTax: price * 0.005,
    countyTransferTax: price * countyTransferTax,
    settlementFee: 295,
    recordingFee: 50,
    payoffProcessing: 75,
  };

  return { buyerCosts, sellerCosts };
}

function calculateDC(price: number, loanAmount: number, party: PartyType) {
  // DC: combined recordation + transfer = ~2.9% over $400K, split buyer/seller
  const combinedRate = price >= 400000 ? 0.029 : 0.022;
  const halfTax = (price * combinedRate) / 2;

  const buyerCosts = {
    titleSearch: 250,
    titleInsuranceLender: price * 0.004,
    titleInsuranceOwner: price * 0.005,
    settlementFee: 595,
    recordingFee: 200,
    recordationTax: halfTax,
    transferTax: halfTax,
    loanOriginationEst: loanAmount * 0.01,
    appraisal: 700,
    prepaidItems: loanAmount * 0.015,
  };

  const sellerCosts = {
    agentCommission: price * 0.025,
    recordationTax: halfTax,
    transferTax: halfTax,
    settlementFee: 395,
    recordingFee: 100,
    payoffProcessing: 75,
  };

  return { buyerCosts, sellerCosts };
}

const CALCULATORS = { VA: calculateVA, MD: calculateMD, DC: calculateDC };

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function sumObj(obj: Record<string, number>) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function CostBreakdown({ label, costs, total }: { label: string; costs: Record<string, number>; total: number }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold text-brand-navy text-lg mb-4">{label}</h3>
      <div className="space-y-2 mb-4">
        {Object.entries(costs).map(([key, val]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())
            .replace("Est", "(Est.)")
            .replace("Tax", "Tax");
          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-brand-muted">{label}</span>
              <span className="font-medium text-brand-dark-text">{formatCurrency(val)}</span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-brand-navy">
        <span>Estimated Total</span>
        <span className="text-brand-blue text-lg">{formatCurrency(total)}</span>
      </div>
      <p className="text-xs text-brand-muted mt-2">
        * Estimates only. Actual costs vary. Contact DMV Title Guy for a precise quote.
      </p>
    </div>
  );
}

interface ClosingCostCalculatorProps {
  state: State;
}

export function ClosingCostCalculator({ state }: ClosingCostCalculatorProps) {
  const config = CONFIGS[state];
  const [price, setPrice] = useState(500000);
  const [loanAmount, setLoanAmount] = useState(400000);
  const [party, setParty] = useState<PartyType>("both");

  const results = useMemo(
    () => CALCULATORS[state](price, loanAmount, party),
    [state, price, loanAmount, party]
  );

  const buyerTotal = sumObj(results.buyerCosts);
  const sellerTotal = sumObj(results.sellerCosts);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-brand-gray-bg rounded-xl p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-6">{config.stateFullName} Closing Cost Calculator</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-dark-text mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-brand-muted text-sm">$</span>
              <input
                type="number"
                value={price}
                min={50000}
                max={5000000}
                step={10000}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-text mb-1">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-brand-muted text-sm">$</span>
              <input
                type="number"
                value={loanAmount}
                min={0}
                max={price}
                step={10000}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-text mb-1">Show Costs For</label>
            <select
              value={party}
              onChange={(e) => setParty(e.target.value as PartyType)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
            >
              <option value="both">Buyer &amp; Seller</option>
              <option value="buyer">Buyer Only</option>
              <option value="seller">Seller Only</option>
            </select>
          </div>
        </div>

        {/* Summary bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide">Sale Price</p>
            <p className="font-bold text-brand-navy text-lg">{formatCurrency(price)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide">Loan Amount</p>
            <p className="font-bold text-brand-navy text-lg">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide">Buyer Est.</p>
            <p className="font-bold text-brand-blue text-lg">{formatCurrency(buyerTotal)}</p>
          </div>
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide">Seller Est.</p>
            <p className="font-bold text-brand-blue text-lg">{formatCurrency(sellerTotal)}</p>
          </div>
        </div>

        <p className="text-xs text-brand-muted mt-3">{config.transferTaxNote}</p>
      </div>

      {/* Breakdown tables */}
      <div className={`grid gap-6 ${party === "both" ? "md:grid-cols-2" : ""}`}>
        {(party === "both" || party === "buyer") && (
          <CostBreakdown label="Buyer Closing Costs" costs={results.buyerCosts} total={buyerTotal} />
        )}
        {(party === "both" || party === "seller") && (
          <CostBreakdown label="Seller Closing Costs" costs={results.sellerCosts} total={sellerTotal} />
        )}
      </div>

      {/* CTA */}
      <div className="bg-brand-navy text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Ready for a Precise Quote?</h3>
          <p className="text-gray-300 text-sm">Contact Will Rapuano at Pruitt Title LLC — we&apos;ll walk through actual costs for your transaction.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/#contact" className="btn-primary whitespace-nowrap">Get a Real Quote</Link>
          <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy whitespace-nowrap">Call Now</a>
        </div>
      </div>
    </div>
  );
}
