"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("30");
  const [showFull, setShowFull] = useState(false);

  const results = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(termYears) || 30) * 12;
    if (!P || !r) return null;

    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const totalInterest = totalPaid - P;

    // Build schedule (yearly summary)
    const yearlyRows: { year: number; principal: number; interest: number; balance: number }[] = [];
    let balance = P;
    for (let year = 1; year <= parseInt(termYears); year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      for (let mo = 0; mo < 12 && balance > 0; mo++) {
        const interestCharge = balance * r;
        const principalPaid = payment - interestCharge;
        yearInterest += interestCharge;
        yearPrincipal += Math.min(principalPaid, balance);
        balance = Math.max(0, balance - principalPaid);
      }
      yearlyRows.push({ year, principal: yearPrincipal, interest: yearInterest, balance });
    }

    return { payment, totalPaid, totalInterest, yearlyRows };
  }, [loanAmount, rate, termYears]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";
  const displayRows = showFull ? results?.yearlyRows : results?.yearlyRows.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
        <div>
          <label className={labelClass}>Loan Amount</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="400,000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
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

      {results && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-brand-navy rounded-xl p-5 text-white">
              <div className="text-xs uppercase tracking-widest text-brand-blue mb-1 font-semibold">Monthly Payment</div>
              <div className="text-3xl font-bold">{fmt(results.payment)}</div>
            </div>
            <div className="bg-brand-gray-bg rounded-xl p-5">
              <div className="text-xs uppercase tracking-widest text-brand-muted mb-1 font-semibold">Total Paid</div>
              <div className="text-2xl font-bold text-brand-navy">{fmt(results.totalPaid)}</div>
            </div>
            <div className="bg-brand-gray-bg rounded-xl p-5">
              <div className="text-xs uppercase tracking-widest text-brand-muted mb-1 font-semibold">Total Interest</div>
              <div className="text-2xl font-bold text-brand-navy">{fmt(results.totalInterest)}</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-brand-navy mb-4">Amortization Schedule (Yearly)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-brand-navy">
                    <th className="text-left py-2 font-semibold text-brand-navy">Year</th>
                    <th className="text-right py-2 font-semibold text-brand-navy">Principal Paid</th>
                    <th className="text-right py-2 font-semibold text-brand-navy">Interest Paid</th>
                    <th className="text-right py-2 font-semibold text-brand-navy">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayRows?.map(row => (
                    <tr key={row.year} className="hover:bg-brand-gray-bg">
                      <td className="py-2 text-brand-muted">{row.year}</td>
                      <td className="py-2 text-right text-green-600 font-medium">{fmt(row.principal)}</td>
                      <td className="py-2 text-right text-red-500 font-medium">{fmt(row.interest)}</td>
                      <td className="py-2 text-right text-brand-dark-text">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(results.yearlyRows.length > 5) && (
              <button onClick={() => setShowFull(!showFull)} className="mt-3 text-sm text-brand-blue hover:underline font-medium">
                {showFull ? "Show less ↑" : `Show all ${results.yearlyRows.length} years ↓`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
