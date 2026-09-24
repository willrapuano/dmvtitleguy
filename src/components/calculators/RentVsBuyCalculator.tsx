"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { balanceAfter, monthlyPayment, num, usd } from "./mortgage-math";
import { NumberField } from "./NumberField";

export function RentVsBuyCalculator() {
  const [price, setPrice] = useState("550000");
  const [downPct, setDownPct] = useState("10");
  const [rate, setRate] = useState("6.5");
  const [taxPct, setTaxPct] = useState("1.0");
  const [insHoa, setInsHoa] = useState("250");
  const [maintPct, setMaintPct] = useState("1");
  const [appreciation, setAppreciation] = useState("3");
  const [buyClosingPct, setBuyClosingPct] = useState("3");
  const [sellPct, setSellPct] = useState("6");
  const [rent, setRent] = useState("2800");
  const [rentGrowth, setRentGrowth] = useState("3");
  const [invReturn, setInvReturn] = useState("5");
  const [years, setYears] = useState("7");

  const result = useMemo(() => {
    const P = num(price);
    if (P <= 0) return null;
    const horizon = Math.min(30, Math.max(1, Math.round(num(years))));
    const down = (P * num(downPct)) / 100;
    const loan = Math.max(0, P - down);
    const buyClosing = (P * num(buyClosingPct)) / 100;
    const upfront = down + buyClosing;
    const pi = monthlyPayment(loan, num(rate), 30);
    const g = num(appreciation) / 100;

    let cumOwner = 0;
    let cumRent = 0;
    let breakEven: number | null = null;
    const rows: { year: number; buyNet: number; rentNet: number }[] = [];
    for (let y = 1; y <= 30; y++) {
      const startValue = P * (1 + g) ** (y - 1);
      const monthlyTaxes = (startValue * num(taxPct)) / 100 / 12;
      const monthlyMaint = (startValue * num(maintPct)) / 100 / 12;
      cumOwner += 12 * (pi + monthlyTaxes + num(insHoa) + monthlyMaint);
      cumRent += 12 * num(rent) * (1 + num(rentGrowth) / 100) ** (y - 1);

      const value = P * (1 + g) ** y;
      const equityOut = value * (1 - num(sellPct) / 100) - balanceAfter(loan, num(rate), 30, y * 12);
      const buyNet = upfront + cumOwner - equityOut;
      // A renter keeps the down payment and closing costs invested instead.
      const rentNet = cumRent - upfront * ((1 + num(invReturn) / 100) ** y - 1);
      rows.push({ year: y, buyNet, rentNet });
      if (breakEven === null && buyNet <= rentNet) breakEven = y;
    }
    const at = rows[horizon - 1];
    const firstYearOwnerMonthly = pi + (P * num(taxPct)) / 100 / 12 + num(insHoa) + (P * num(maintPct)) / 100 / 12;
    return { horizon, at, breakEven, pi, firstYearOwnerMonthly, upfront };
  }, [price, downPct, rate, taxPct, insHoa, maintPct, appreciation, buyClosingPct, sellPct, rent, rentGrowth, invReturn, years]);

  const buyingWins = result ? result.at.buyNet < result.at.rentNet : false;
  const gap = result ? Math.abs(result.at.buyNet - result.at.rentNet) : 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="mb-2 font-display text-2xl font-medium text-brand-navy">Buying</legend>
          <NumberField id="rvb-price" label="Home price" value={price} set={setPrice} prefix="$" />
          <div className="grid grid-cols-2 items-end gap-4">
            <NumberField id="rvb-down" label="Down payment" value={downPct} set={setDownPct} suffix="%" />
            <NumberField id="rvb-rate" label="Mortgage rate (30-year)" value={rate} set={setRate} suffix="%" />
            <NumberField id="rvb-tax" label="Property tax (per year)" value={taxPct} set={setTaxPct} suffix="%" />
            <NumberField id="rvb-ins" label="Insurance + HOA (monthly)" value={insHoa} set={setInsHoa} prefix="$" />
            <NumberField id="rvb-maint" label="Maintenance (per year)" value={maintPct} set={setMaintPct} suffix="%" />
            <NumberField id="rvb-appr" label="Home value growth (per year)" value={appreciation} set={setAppreciation} suffix="%" />
            <NumberField id="rvb-close" label="Buyer closing costs" value={buyClosingPct} set={setBuyClosingPct} suffix="%" />
            <NumberField id="rvb-sell" label="Selling costs" value={sellPct} set={setSellPct} suffix="%" />
          </div>
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="mb-2 font-display text-2xl font-medium text-brand-navy">Renting</legend>
          <div className="grid grid-cols-2 items-end gap-4">
            <NumberField id="rvb-rent" label="Monthly rent" value={rent} set={setRent} prefix="$" />
            <NumberField id="rvb-rent-growth" label="Rent increase (per year)" value={rentGrowth} set={setRentGrowth} suffix="%" />
            <NumberField id="rvb-return" label="Return on invested savings" value={invReturn} set={setInvReturn} suffix="%" />
            <NumberField id="rvb-years" label="Years you expect to stay" value={years} set={setYears} />
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {!result ? (
          <div className="bg-brand-gray-bg p-6 text-sm text-brand-ink-light">Enter a home price to compare.</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-brand-navy p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-brass">Over {result.horizon} {result.horizon === 1 ? "year" : "years"}</p>
              <p className="mt-3 font-display text-3xl font-medium leading-tight md:text-4xl">
                {buyingWins ? "Buying" : "Renting"} comes out about {usd(gap)} ahead.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#C9D6E0]">
                {result.breakEven
                  ? `Buying overtakes renting in year ${result.breakEven} with these assumptions.`
                  : "With these assumptions, buying does not overtake renting within 30 years."}
              </p>
            </div>

            <dl className="divide-y divide-brand-line border-y border-brand-line text-[15px]">
              {[
                ["Net cost of buying", usd(result.at.buyNet)],
                ["Net cost of renting", usd(result.at.rentNet)],
                ["Cash needed to buy (down payment + closing)", usd(result.upfront)],
                ["Mortgage payment (principal + interest)", usd(result.pi)],
                ["All-in monthly cost of owning, year 1", usd(result.firstYearOwnerMonthly)],
                ["Monthly rent, year 1", usd(num(rent))],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="text-brand-ink-light">{k}</dt>
                  <dd className="shrink-0 font-semibold text-brand-navy">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="text-sm leading-relaxed text-brand-ink-light">
              Net cost of buying is everything you pay to own, minus what you walk away with after selling and paying off the loan.
              Net cost of renting is rent paid, minus what your down payment and closing costs would have earned invested.
              Tax effects are not included. This is an estimate for planning, not financial or tax advice.
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
