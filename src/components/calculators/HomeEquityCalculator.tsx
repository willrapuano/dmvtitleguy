"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtPct(n: number) {
  return n.toFixed(1) + "%";
}

export function HomeEquityCalculator() {
  const [homeValue, setHomeValue] = useState("");
  const [mortgageBalance, setMortgageBalance] = useState("");
  const [otherLiens, setOtherLiens] = useState("0");
  const [ltvTarget, setLtvTarget] = useState("80");

  const results = useMemo(() => {
    const value = parseFloat(homeValue) || 0;
    const balance = parseFloat(mortgageBalance) || 0;
    const liens = parseFloat(otherLiens) || 0;
    const ltv = parseFloat(ltvTarget) / 100;

    if (!value) return null;

    const totalDebt = balance + liens;
    const equity = value - totalDebt;
    const equityPct = value > 0 ? (equity / value) * 100 : 0;
    const currentLtv = value > 0 ? (totalDebt / value) * 100 : 0;

    const maxBorrow = Math.max(0, value * ltv - balance);
    const cashOutRefi = Math.max(0, value * 0.8 - balance);
    const heloc = Math.max(0, value * 0.85 - balance);

    return { equity, equityPct, currentLtv, maxBorrow, cashOutRefi, heloc, totalDebt };
  }, [homeValue, mortgageBalance, otherLiens, ltvTarget]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Property Details</h2>

        <div>
          <label className={labelClass}>Current Home Value</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="600,000" value={homeValue} onChange={e => setHomeValue(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Remaining Mortgage Balance</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="350,000" value={mortgageBalance} onChange={e => setMortgageBalance(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Other Liens (HELOC, 2nd mortgage)</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="0" value={otherLiens} onChange={e => setOtherLiens(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Max LTV Target (for borrowing)</label>
          <div className="relative">
            <input type="number" placeholder="80" value={ltvTarget} onChange={e => setLtvTarget(e.target.value)} className={inputClass + " pr-7"} />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Equity Snapshot</h2>
        {!results ? (
          <div className="bg-brand-gray-bg rounded-xl p-6 text-center text-brand-muted text-sm">Enter your home value to see equity</div>
        ) : (
          <div className="space-y-3">
            <div className={`rounded-xl p-5 ${results.equity >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-navy">Available Equity</span>
                <span className={`text-2xl font-bold ${results.equity >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(results.equity)}</span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-brand-muted">
                <span>Equity %</span><span className="font-semibold">{fmtPct(results.equityPct)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-brand-muted">
                <span>Current LTV</span><span className="font-semibold">{fmtPct(results.currentLtv)}</span>
              </div>
            </div>

            <div className="bg-brand-gray-bg rounded-xl p-5 space-y-3">
              <div className="text-xs uppercase tracking-widest text-brand-muted font-semibold mb-2">Borrowing Potential</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted">Max Borrow ({ltvTarget}% LTV)</span>
                <span className="font-bold text-brand-navy">{fmt(results.maxBorrow)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted">Cash-Out Refi (80% LTV)</span>
                <span className="font-semibold text-brand-dark-text">{fmt(results.cashOutRefi)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted">HELOC Max (85% LTV)</span>
                <span className="font-semibold text-brand-dark-text">{fmt(results.heloc)}</span>
              </div>
            </div>

            <div className="bg-brand-navy rounded-xl p-5 text-white">
              <div className="text-xs uppercase tracking-widest text-brand-blue mb-1 font-semibold">Debt vs. Value</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${Math.min(100, results.currentLtv)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Debt: {fmt(results.totalDebt)}</span>
                <span>Value: {fmt(parseFloat(homeValue))}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
