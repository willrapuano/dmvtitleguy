"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { monthlyPayment, num, usd } from "./mortgage-math";
import { NumberField } from "./NumberField";

export function BuyNowOrLaterCalculator() {
  const [price, setPrice] = useState("550000");
  const [downPct, setDownPct] = useState("10");
  const [rateNow, setRateNow] = useState("6.5");
  const [rateLater, setRateLater] = useState("6.0");
  const [appreciation, setAppreciation] = useState("3");
  const [months, setMonths] = useState("12");
  const [rent, setRent] = useState("2800");

  const result = useMemo(() => {
    const P = num(price);
    if (P <= 0) return null;
    const wait = Math.min(120, Math.max(0, Math.round(num(months))));
    const d = num(downPct) / 100;
    const priceLater = P * (1 + num(appreciation) / 100) ** (wait / 12);
    const downNow = P * d;
    const downLater = priceLater * d;
    const pmtNow = monthlyPayment(P - downNow, num(rateNow), 30);
    const pmtLater = monthlyPayment(priceLater - downLater, num(rateLater), 30);
    const rentPaid = num(rent) * wait;
    // Everything paid for the home over a full 30-year loan, plus rent while waiting.
    const totalNow = downNow + pmtNow * 360;
    const totalLater = rentPaid + downLater + pmtLater * 360;
    const monthlyDiff = pmtNow - pmtLater; // positive: waiting lowers the payment
    const upfrontExtra = rentPaid + (downLater - downNow);
    const recoupMonths = monthlyDiff > 0 ? Math.ceil(upfrontExtra / monthlyDiff) : null;
    return { wait, priceLater, downNow, downLater, pmtNow, pmtLater, rentPaid, totalNow, totalLater, monthlyDiff, recoupMonths };
  }, [price, downPct, rateNow, rateLater, appreciation, months, rent]);

  const waitingCosts = result ? result.totalLater > result.totalNow : false;
  const gap = result ? Math.abs(result.totalLater - result.totalNow) : 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-2xl font-medium text-brand-navy">Your scenario</legend>
        <NumberField id="bnl-price" label="Home price today" value={price} set={setPrice} prefix="$" />
        <div className="grid grid-cols-2 items-end gap-4">
          <NumberField id="bnl-down" label="Down payment" value={downPct} set={setDownPct} suffix="%" />
          <NumberField id="bnl-months" label="Months you would wait" value={months} set={setMonths} />
          <NumberField id="bnl-rate-now" label="Mortgage rate today" value={rateNow} set={setRateNow} suffix="%" />
          <NumberField id="bnl-rate-later" label="Expected rate later" value={rateLater} set={setRateLater} suffix="%" />
          <NumberField id="bnl-appr" label="Home price growth (per year)" value={appreciation} set={setAppreciation} suffix="%" />
          <NumberField id="bnl-rent" label="Rent while you wait (monthly)" value={rent} set={setRent} prefix="$" />
        </div>
      </fieldset>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {!result ? (
          <div className="bg-brand-gray-bg p-6 text-sm text-brand-ink-light">Enter a home price to compare.</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-brand-navy p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-brass">Waiting {result.wait} {result.wait === 1 ? "month" : "months"}</p>
              <p className="mt-3 font-display text-3xl font-medium leading-tight md:text-4xl">
                {waitingCosts ? `Waiting costs about ${usd(gap)} more` : `Waiting saves about ${usd(gap)}`} over the life of the loan.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#C9D6E0]">
                {result.monthlyDiff <= 0 || result.recoupMonths === null
                  ? `Your payment later would be ${usd(Math.abs(result.monthlyDiff))} a month higher than buying today.`
                  : result.recoupMonths > 360
                    ? `The lower payment later saves ${usd(result.monthlyDiff)} a month, which never earns back the rent and larger down payment within a 30-year loan.`
                    : `The lower payment later saves ${usd(result.monthlyDiff)} a month, which takes about ${Math.ceil(result.recoupMonths / 12)} years to earn back the rent and larger down payment.`}
              </p>
            </div>

            <dl className="divide-y divide-brand-line border-y border-brand-line text-[15px]">
              {[
                ["Home price if you wait", usd(result.priceLater)],
                ["Monthly payment buying today", usd(result.pmtNow)],
                ["Monthly payment buying later", usd(result.pmtLater)],
                ["Rent paid while waiting", usd(result.rentPaid)],
                ["Down payment today / later", `${usd(result.downNow)} / ${usd(result.downLater)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="text-brand-ink-light">{k}</dt>
                  <dd className="shrink-0 font-semibold text-brand-navy">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="text-sm leading-relaxed text-brand-ink-light">
              Compares the total paid for the home over a 30-year loan, plus rent while you wait. Payments are principal and interest only;
              taxes, insurance, and closing costs are left out because they apply either way. Rates and prices are your assumptions, not a forecast.
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
