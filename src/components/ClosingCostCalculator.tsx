"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type State = "VA" | "MD" | "DC";
type PartyType = "buyer" | "seller" | "both";
type MarylandCounty = "montgomery" | "princeGeorges";

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
    transferTaxNote: "Maryland state transfer tax: 0.5% standard, or 0.25% for qualifying first-time Maryland homebuyers paid by the seller. Tax rates verified as of June 2026.",
  },
  DC: {
    state: "DC",
    stateFullName: "Washington DC",
    transferTaxNote: "DC recordation & transfer taxes: combined ~2.9% on properties over $400K.",
  },
};

interface CalcResult {
  buyerCosts: Record<string, number>;
  sellerCosts: Record<string, number>;
}

interface MarylandOptions {
  county: MarylandCounty;
  firstTimeMarylandHomebuyer: boolean;
  ownerOccupiedResidential: boolean;
}

const MARYLAND_COUNTY_OPTIONS: Record<MarylandCounty, { label: string; transferTaxRate: number; recordationTaxRate?: number }> = {
  montgomery: {
    label: "Montgomery County",
    transferTaxRate: 0.01,
  },
  princeGeorges: {
    label: "Prince George's County",
    transferTaxRate: 0.014,
    recordationTaxRate: 0.0055,
  },
};

function calculateMontgomeryTransferTax(price: number) {
  if (price < 40000) return price * 0.0025;
  if (price < 70000) return price * 0.005;
  return price * 0.01;
}

function calculateMontgomeryRecordationTax(price: number, ownerOccupiedResidential: boolean) {
  let taxableAmount = Math.max(0, price - (ownerOccupiedResidential ? 100000 : 0));
  const tiers = [
    { limit: 500000, ratePer500: 4.45 },
    { limit: 600000, ratePer500: 6.75 },
    { limit: 750000, ratePer500: 10.2 },
    { limit: 1000000, ratePer500: 10.78 },
    { limit: Infinity, ratePer500: 11.35 },
  ];

  let previousLimit = 0;
  let tax = 0;

  for (const tier of tiers) {
    if (taxableAmount <= 0) break;

    const tierSize = Math.min(taxableAmount, tier.limit - previousLimit);
    tax += Math.ceil(tierSize / 500) * tier.ratePer500;
    taxableAmount -= tierSize;
    previousLimit = tier.limit;
  }

  return tax;
}

function calculateVA(price: number, loanAmount: number, party: PartyType): CalcResult {
  const isResale = true;

  const buyerCosts: Record<string, number> = {
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

  const sellerCosts: Record<string, number> = {
    agentCommission: price * 0.025, // 2.5% seller side
    grantorTax: price * 0.001, // $0.50/$500
    settlementFee: 295,
    recordingFee: 50,
    payoffProcessing: 75,
    titleSearch: 150,
  };

  return { buyerCosts, sellerCosts };
}

function calculateMD(
  price: number,
  loanAmount: number,
  party: PartyType,
  options: MarylandOptions = {
    county: "montgomery",
    firstTimeMarylandHomebuyer: false,
    ownerOccupiedResidential: true,
  }
): CalcResult {
  const countyInfo = MARYLAND_COUNTY_OPTIONS[options.county];
  const stateTransferTaxTotal = price * (options.firstTimeMarylandHomebuyer ? 0.0025 : 0.005);
  const buyerStateTransferTax = options.firstTimeMarylandHomebuyer ? 0 : stateTransferTaxTotal / 2;
  const sellerStateTransferTax = options.firstTimeMarylandHomebuyer ? stateTransferTaxTotal : stateTransferTaxTotal / 2;
  const countyTransferTaxTotal =
    options.county === "montgomery"
      ? calculateMontgomeryTransferTax(price)
      : price * countyInfo.transferTaxRate;
  const recordationTax =
    options.county === "montgomery"
      ? calculateMontgomeryRecordationTax(price, options.ownerOccupiedResidential)
      : price * (countyInfo.recordationTaxRate ?? 0);

  const buyerCosts: Record<string, number> = {
    titleSearch: 250,
    titleInsuranceLender: price * 0.004,
    titleInsuranceOwner: price * 0.0045,
    settlementFee: 495,
    recordingFee: 150,
    stateTransferTax: buyerStateTransferTax,
    countyTransferTax: countyTransferTaxTotal / 2,
    recordationTax,
    loanOriginationEst: loanAmount * 0.01,
    appraisal: 600,
    prepaidItems: loanAmount * 0.015,
  };

  if (options.county === "princeGeorges") {
    buyerCosts.princeGeorgesDeedOfTrustTransferTax = loanAmount * countyInfo.transferTaxRate;
  }

  const sellerCosts: Record<string, number> = {
    agentCommission: price * 0.025,
    stateTransferTax: sellerStateTransferTax,
    countyTransferTax: countyTransferTaxTotal / 2,
    settlementFee: 295,
    recordingFee: 50,
    payoffProcessing: 75,
  };

  return { buyerCosts, sellerCosts };
}

function calculateDC(price: number, loanAmount: number, party: PartyType): CalcResult {
  // DC: combined recordation + transfer = ~2.9% over $400K, split buyer/seller
  const combinedRate = price >= 400000 ? 0.029 : 0.022;
  const halfTax = (price * combinedRate) / 2;

  const buyerCosts: Record<string, number> = {
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

  const sellerCosts: Record<string, number> = {
    agentCommission: price * 0.025,
    recordationTax: halfTax,
    transferTax: halfTax,
    settlementFee: 395,
    recordingFee: 100,
    payoffProcessing: 75,
  };

  return { buyerCosts, sellerCosts };
}

const CALCULATORS = { VA: calculateVA, DC: calculateDC };

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function sumObj(obj: Record<string, number>) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function CostBreakdown({ label, costs, total }: { label: string; costs: Record<string, number>; total: number }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-brand-navy t-h6 mb-4">{label}</h3>
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
        <span>Total</span>
        <span className="text-brand-blue-deep text-lg">{formatCurrency(total)}</span>
      </div>
      <p className="text-xs text-brand-muted mt-2 max-w-[68ch]">
        Tax rates verified as of June 2026. Rates are subject to change; confirm with the applicable circuit court clerk for the most current rates.
      </p>
    </div>
  );
}

/** Optional city-level overrides for localized calculator pages */
export interface CityOverrides {
  /** Additional local recordation/transfer tax rate (decimal, e.g. 0.001 for 0.1%) */
  localRecordationTaxRate?: number;
  /** County transfer tax rate (MD, decimal) */
  countyTransferTaxRate?: number;
  /** Additional local transfer tax rate (decimal) */
  localTransferTaxRate?: number;
  /** Override default purchase price */
  defaultPrice?: number;
  /** Override default loan amount */
  defaultLoanAmount?: number;
  /** Custom note to display below calculator */
  localTaxNote?: string;
}

interface ClosingCostCalculatorProps {
  state: State;
  cityOverrides?: CityOverrides;
}

export function ClosingCostCalculator({ state, cityOverrides }: ClosingCostCalculatorProps) {
  const config = CONFIGS[state];
  const defaultPrice = cityOverrides?.defaultPrice ?? 500000;
  const defaultLoan = cityOverrides?.defaultLoanAmount ?? Math.round(defaultPrice * 0.8);
  const [price, setPrice] = useState(defaultPrice);
  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [party, setParty] = useState<PartyType>("both");
  const [marylandCounty, setMarylandCounty] = useState<MarylandCounty>(
    cityOverrides?.countyTransferTaxRate === 0.014 ? "princeGeorges" : "montgomery"
  );
  const [firstTimeMarylandHomebuyer, setFirstTimeMarylandHomebuyer] = useState(false);
  const [ownerOccupiedResidential, setOwnerOccupiedResidential] = useState(true);

  const results = useMemo(() => {
    const base =
      state === "MD"
        ? calculateMD(price, loanAmount, party, {
            county: marylandCounty,
            firstTimeMarylandHomebuyer,
            ownerOccupiedResidential,
          })
        : CALCULATORS[state](price, loanAmount, party);

    // Apply city-level tax overrides if provided
    if (cityOverrides) {
      const localRecTax = (cityOverrides.localRecordationTaxRate ?? 0) * price;
      const localTransferTax = (cityOverrides.localTransferTaxRate ?? 0) * price;

      if (localRecTax > 0) {
        base.buyerCosts = { ...base.buyerCosts, localRecordationTax: localRecTax };
      }
      if (localTransferTax > 0) {
        base.buyerCosts = { ...base.buyerCosts, localTransferTax: localTransferTax / 2 };
        base.sellerCosts = { ...base.sellerCosts, localTransferTax: localTransferTax / 2 };
      }

      // MD county tax is handled through the Maryland county selector.
    }

    return base;
  }, [state, price, loanAmount, party, cityOverrides, marylandCounty, firstTimeMarylandHomebuyer, ownerOccupiedResidential]);

  const buyerTotal = sumObj(results.buyerCosts);
  const sellerTotal = sumObj(results.sellerCosts);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-brand-gray-bg rounded-xl p-6">
        <h2 className="t-h5 text-brand-navy mb-6">{config.stateFullName} Closing Cost Calculator</h2>
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

        {state === "MD" && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark-text mb-1">Maryland County</label>
              <select
                value={marylandCounty}
                onChange={(e) => setMarylandCounty(e.target.value as MarylandCounty)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
              >
                {Object.entries(MARYLAND_COUNTY_OPTIONS).map(([value, county]) => (
                  <option key={value} value={value}>
                    {county.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-brand-dark-text">
              <input
                type="checkbox"
                checked={firstTimeMarylandHomebuyer}
                onChange={(e) => setFirstTimeMarylandHomebuyer(e.target.checked)}
                className="h-4 w-4"
              />
              First-time Maryland homebuyer
            </label>
            <label className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-brand-dark-text">
              <input
                type="checkbox"
                checked={ownerOccupiedResidential}
                onChange={(e) => setOwnerOccupiedResidential(e.target.checked)}
                className="h-4 w-4"
              />
              Owner-occupied residential
            </label>
          </div>
        )}

        {/* Summary bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide max-w-[68ch]">Sale Price</p>
            <p className="font-bold text-brand-navy text-lg max-w-[68ch]">{formatCurrency(price)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide max-w-[68ch]">Loan Amount</p>
            <p className="font-bold text-brand-navy text-lg max-w-[68ch]">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide max-w-[68ch]">Buyer</p>
            <p className="font-bold text-brand-blue-deep text-lg max-w-[68ch]">{formatCurrency(buyerTotal)}</p>
          </div>
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wide max-w-[68ch]">Seller</p>
            <p className="font-bold text-brand-blue-deep text-lg max-w-[68ch]">{formatCurrency(sellerTotal)}</p>
          </div>
        </div>

        <p className="text-xs text-brand-muted mt-3 max-w-[68ch]">{cityOverrides?.localTaxNote ?? config.transferTaxNote}</p>
        {state === "MD" && marylandCounty === "montgomery" && (
          <p className="text-xs text-brand-muted mt-2 max-w-[68ch]">
            Montgomery County recordation tax uses the Bill 17-23 tiered schedule and applies the first $100,000 owner-occupied residential exemption when selected.
          </p>
        )}
        {state === "MD" && marylandCounty === "princeGeorges" && (
          <p className="text-xs text-brand-muted mt-2 max-w-[68ch]">
            Prince George&apos;s County uses 0.55% recordation tax and 1.4% county transfer tax. The 1.4% local transfer tax also applies to mortgages and deeds of trust.
          </p>
        )}
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
          <h3 className="t-h6">Ready for a Precise Quote?</h3>
          <p className="text-gray-300 text-sm max-w-[68ch] leading-relaxed">Contact Will Rapuano at Pruitt Title LLC — we&apos;ll walk through actual costs for your transaction.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/calculators/title-quote" className="btn-primary whitespace-nowrap">Get a Real Quote</Link>
          <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy whitespace-nowrap">Call Now</a>
        </div>
      </div>
    </div>
  );
}
