"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { monthlyPayment, num, usd } from "./mortgage-math";
import { NumberField } from "./NumberField";

/**
 * Price you can afford for a target monthly housing payment. The payment is
 * linear in price (P&I on price − down, plus tax on price, plus a flat
 * insurance/HOA amount), so it solves directly.
 */
function priceFor(maxPayment: number, down: number, ratePct: number, taxPct: number, insHoa: number) {
  const k = monthlyPayment(1, ratePct, 30);
  const t = taxPct / 100 / 12;
  if (maxPayment <= insHoa || k + t <= 0) return 0;
  return Math.max(0, (maxPayment - insHoa + k * down) / (k + t));
}

export function AffordabilityCalculator() {
  const [income, setIncome] = useState("12000");
  const [debts, setDebts] = useState("600");
  const [down, setDown] = useState("60000");
  const [rate, setRate] = useState("6.5");
  const [taxPct, setTaxPct] = useState("1.0");
  const [insHoa, setInsHoa] = useState("250");

  const result = useMemo(() => {
    const gross = num(income);
    if (gross <= 0) return null;
    // Comfortable: 28% of income on housing, 36% on all debts. Stretch: 43% on all debts.
    const comfortablePmt = Math.max(0, Math.min(gross * 0.28, gross * 0.36 - num(debts)));
    const stretchPmt = Math.max(0, gross * 0.43 - num(debts));
    const comfortable = priceFor(comfortablePmt, num(down), num(rate), num(taxPct), num(insHoa));
    const stretch = priceFor(stretchPmt, num(down), num(rate), num(taxPct), num(insHoa));
    return { comfortablePmt, stretchPmt, comfortable, stretch };
  }, [income, debts, down, rate, taxPct, insHoa]);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-2xl font-medium text-brand-navy">Your numbers</legend>
        <div className="grid grid-cols-2 items-end gap-4">
          <NumberField id="aff-income" label="Gross monthly income" value={income} set={setIncome} prefix="$" />
          <NumberField id="aff-debts" label="Monthly debt payments" value={debts} set={setDebts} prefix="$" />
          <NumberField id="aff-down" label="Down payment" value={down} set={setDown} prefix="$" />
          <NumberField id="aff-rate" label="Mortgage rate (30-year)" value={rate} set={setRate} suffix="%" />
          <NumberField id="aff-tax" label="Property tax (per year)" value={taxPct} set={setTaxPct} suffix="%" />
          <NumberField id="aff-ins" label="Insurance + HOA (monthly)" value={insHoa} set={setInsHoa} prefix="$" />
        </div>
      </fieldset>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {!result ? (
          <div className="bg-brand-gray-bg p-6 text-sm text-brand-ink-light">Enter your monthly income to see a price range.</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-brand-navy p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-brass">Comfortable price range</p>
              <p className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">
                {usd(result.comfortable)}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#C9D6E0]">
                Up to {usd(result.stretch)} if you stretch to the 43% debt-to-income limit many lenders allow.
              </p>
            </div>
            <dl className="divide-y divide-brand-line border-y border-brand-line text-[15px]">
              {[
                ["Comfortable monthly housing payment", usd(result.comfortablePmt)],
                ["Stretch monthly housing payment", usd(result.stretchPmt)],
                ["Down payment", usd(num(down))],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="text-brand-ink-light">{k}</dt>
                  <dd className="shrink-0 font-semibold text-brand-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm leading-relaxed text-brand-ink-light">
              Comfortable uses the common 28% housing and 36% total-debt guideline; stretch uses 43% total debt. Housing payment includes principal,
              interest, property tax, insurance, and HOA. Your lender&apos;s approval, mortgage insurance, and closing costs will change the final number.
            </p>
            <Link href="/calculators/title-quote" className="btn-primary">
              Estimate your closing costs <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
