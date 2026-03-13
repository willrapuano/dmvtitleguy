"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function ExtraPaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("30");
  const [extraMonthly, setExtraMonthly] = useState("");

  const results = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(termYears) || 30) * 12;
    const extra = parseFloat(extraMonthly) || 0;

    if (!P || !r) return null;

    // Standard monthly payment
    const basePayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Total interest without extra payment
    const totalBaseInterest = basePayment * n - P;

    // With extra payment — simulate payoff
    let balance = P;
    let monthsPaid = 0;
    let totalInterestPaid = 0;
    const totalPayment = basePayment + extra;

    while (balance > 0 && monthsPaid < n) {
      const interestCharge = balance * r;
      totalInterestPaid += interestCharge;
      const principalPaid = Math.min(totalPayment - interestCharge, balance);
      balance -= principalPaid;
      monthsPaid++;
      if (principalPaid <= 0) break;
    }

    const interestSaved = totalBaseInterest - totalInterestPaid;
    const monthsSaved = n - monthsPaid;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remMonths = monthsSaved % 12;

    return { basePayment, totalBaseInterest, totalInterestPaid, interestSaved, monthsPaid, monthsSaved, yearsSaved, remMonths };
  }, [loanAmount, rate, termYears, extraMonthly]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Loan Details</h2>

        <div>
          <label className={labelClass}>Loan Amount</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="400,000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Interest Rate</label>
            <div className="relative">
              <input type="number" step="0.01" placeholder="6.75" value={rate} onChange={e => setRate(e.target.value)} className={inputClass + " pr-7"} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Loan Term</label>
            <select value={termYears} onChange={e => setTermYears(e.target.value)} className={inputClass}>
              <option value="30">30 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
              <option value="10">10 Years</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Extra Monthly Payment</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="200" value={extraMonthly} onChange={e => setExtraMonthly(e.target.value)} className={inputClass + " pl-7"} />
          </div>
          <p className="text-xs text-brand-muted mt-1">Applied directly to principal each month</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Payoff Impact</h2>
        {!results ? (
          <div className="bg-brand-gray-bg rounded-xl p-6 text-center text-brand-muted text-sm">Enter loan details to calculate savings</div>
        ) : (
          <div className="space-y-3">
            <div className="bg-brand-gray-bg rounded-xl p-5 space-y-3">
              <Row label="Base Monthly Payment" value={fmt(results.basePayment)} />
              <Row label="Total Interest (no extra)" value={fmt(results.totalBaseInterest)} />
              {parseFloat(extraMonthly) > 0 && (
                <Row label="Total Interest (with extra)" value={fmt(results.totalInterestPaid)} />
              )}
            </div>

            {parseFloat(extraMonthly) > 0 && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-navy">Interest Saved</span>
                    <span className="text-2xl font-bold text-green-600">{fmt(results.interestSaved)}</span>
                  </div>
                </div>

                <div className="bg-brand-navy rounded-xl p-5 text-white">
                  <div className="text-xs uppercase tracking-widest text-brand-blue mb-1 font-semibold">Payoff Early By</div>
                  <div className="text-3xl font-bold">
                    {results.yearsSaved > 0 ? `${results.yearsSaved}y ` : ""}{results.remMonths > 0 ? `${results.remMonths}mo` : ""}
                    {results.yearsSaved === 0 && results.remMonths === 0 ? "No change" : ""}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Paid off in {Math.floor(results.monthsPaid / 12)}y {results.monthsPaid % 12}mo instead of {termYears}y</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-brand-muted">{label}</span>
      <span className="font-semibold text-brand-dark-text">{value}</span>
    </div>
  );
}
