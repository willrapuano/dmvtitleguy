"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/client-analytics";

type MoneyField =
  | "salePrice"
  | "mortgagePayoff"
  | "commissionRate"
  | "sellerConcessions"
  | "transferTaxes"
  | "settlementFees"
  | "otherCosts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function toNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function SellerNetSheetCalculator() {
  const [jurisdiction, setJurisdiction] = useState("Virginia");
  const [values, setValues] = useState<Record<MoneyField, string>>({
    salePrice: "750000",
    mortgagePayoff: "420000",
    commissionRate: "5",
    sellerConcessions: "0",
    transferTaxes: "0",
    settlementFees: "2000",
    otherCosts: "0",
  });
  const startedRef = useRef(false);

  const result = useMemo(() => {
    const salePrice = toNumber(values.salePrice);
    const commission = salePrice * (toNumber(values.commissionRate) / 100);
    const payoff = toNumber(values.mortgagePayoff);
    const closingCosts =
      toNumber(values.sellerConcessions) +
      toNumber(values.transferTaxes) +
      toNumber(values.settlementFees) +
      toNumber(values.otherCosts);
    const deductions = payoff + commission + closingCosts;

    return {
      salePrice,
      payoff,
      commission,
      closingCosts,
      deductions,
      net: salePrice - deductions,
    };
  }, [values]);

  const updateValue = (field: MoneyField, value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackAnalyticsEvent("seller_net_sheet_start", { jurisdiction });
    }
    setValues((current) => ({ ...current, [field]: value }));
  };

  const moneyInput = (
    field: Exclude<MoneyField, "commissionRate">,
    label: string,
    help?: string,
  ) => (
    <div>
      <label htmlFor={`net-sheet-${field}`} className="form-label">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">$</span>
        <input
          id={`net-sheet-${field}`}
          name={field}
          type="number"
          min="0"
          step="100"
          inputMode="decimal"
          value={values[field]}
          onChange={(event) => updateValue(field, event.target.value)}
          className="form-control pl-7"
        />
      </div>
      {help && <p className="mt-1 text-xs leading-relaxed text-slate-500">{help}</p>}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start">
      <div className="surface-card-elevated p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="t-h4 text-brand-navy">Build your seller estimate</h2>
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-brand-muted">
            Enter the figures you know. This calculator does not guess jurisdiction-specific taxes or contractual fees;
            use your contract, payoff estimate, and provider quote for the most useful result.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="net-sheet-jurisdiction" className="form-label">Property jurisdiction</label>
            <select
              id="net-sheet-jurisdiction"
              value={jurisdiction}
              onChange={(event) => setJurisdiction(event.target.value)}
              className="form-control"
            >
              <option>Virginia</option>
              <option>Maryland</option>
              <option>Washington DC</option>
            </select>
          </div>
          {moneyInput("salePrice", "Expected sale price")}
          {moneyInput("mortgagePayoff", "Mortgage and lien payoffs", "Use a current estimate; final payoff figures can change daily.")}
          <div>
            <label htmlFor="net-sheet-commissionRate" className="form-label">Broker compensation (%)</label>
            <div className="relative">
              <input
                id="net-sheet-commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="20"
                step="0.1"
                inputMode="decimal"
                value={values.commissionRate}
                onChange={(event) => updateValue("commissionRate", event.target.value)}
                className="form-control pr-8"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">%</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">Enter the compensation agreed for this transaction.</p>
          </div>
          {moneyInput("sellerConcessions", "Seller concessions or credits")}
          {moneyInput("transferTaxes", "Transfer and recordation taxes", "Enter an estimate from the applicable jurisdiction or closing-cost quote.")}
          {moneyInput("settlementFees", "Title and settlement-related fees")}
          {moneyInput("otherCosts", "Repairs, HOA, legal, or other costs")}
        </div>
      </div>

      <aside className="surface-card-elevated overflow-hidden lg:sticky lg:top-24" aria-live="polite">
        <div className="bg-brand-navy p-6 text-white">
          <p className="text-sm font-semibold text-brand-blue">Projected seller proceeds</p>
          <p className={`mt-2 text-4xl font-bold tabular-nums ${result.net < 0 ? "text-red-200" : "text-white"}`}>
            {currency.format(result.net)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">Planning estimate for {jurisdiction}; not a settlement statement.</p>
        </div>

        <dl className="divide-y divide-slate-200 p-6 text-sm">
          {[
            ["Expected sale price", result.salePrice],
            ["Mortgage and lien payoffs", -result.payoff],
            ["Broker compensation", -result.commission],
            ["Other entered closing costs", -result.closingCosts],
            ["Total deductions", -result.deductions],
          ].map(([label, amount]) => (
            <div key={String(label)} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <dt className="text-slate-600">{label}</dt>
              <dd className="font-semibold tabular-nums text-brand-navy">{currency.format(Number(amount))}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-slate-200 p-6">
          <Link
            href="/calculators/title-quote"
            onClick={() => trackAnalyticsEvent("seller_net_sheet_quote_click", { jurisdiction })}
            className="btn-primary w-full text-center"
          >
            Request an itemized title quote →
          </Link>
          <button
            type="button"
            onClick={() => {
              trackAnalyticsEvent("seller_net_sheet_print", { jurisdiction });
              window.print();
            }}
            className="mt-3 min-h-11 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50"
          >
            Print or save this estimate
          </button>
        </div>
      </aside>
    </div>
  );
}
