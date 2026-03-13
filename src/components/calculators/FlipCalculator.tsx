"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtPct(n: number) {
  return n.toFixed(1) + "%";
}

export function FlipCalculator() {
  const [arv, setArv] = useState("");
  const [purchase, setPurchase] = useState("");
  const [rehab, setRehab] = useState("");
  const [holdingMonths, setHoldingMonths] = useState("6");
  const [holdingCostPct, setHoldingCostPct] = useState("1.0");
  const [closingCostPct, setClosingCostPct] = useState("2.0");
  const [desiredProfit, setDesiredProfit] = useState("20000");

  const results = useMemo(() => {
    const a = parseFloat(arv) || 0;
    const p = parseFloat(purchase) || 0;
    const r = parseFloat(rehab) || 0;
    const months = parseFloat(holdingMonths) || 6;
    const holdPct = parseFloat(holdingCostPct) / 100;
    const closePct = parseFloat(closingCostPct) / 100;

    if (!a) return null;

    const holdingCosts = a * holdPct * (months / 12);
    const closingCosts = a * closePct;
    const totalCosts = p + r + holdingCosts + closingCosts;
    const profit = a - totalCosts;
    const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;
    const profitPct = a > 0 ? (profit / a) * 100 : 0;

    const desired = parseFloat(desiredProfit) || 0;
    const mao = a - r - holdingCosts - closingCosts - desired;

    return { holdingCosts, closingCosts, totalCosts, profit, roi, profitPct, mao };
  }, [arv, purchase, rehab, holdingMonths, holdingCostPct, closingCostPct, desiredProfit]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* INPUTS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Deal Details</h2>

        <div>
          <label className={labelClass}>After Repair Value (ARV)</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="350,000" value={arv} onChange={e => setArv(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Purchase Price</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="200,000" value={purchase} onChange={e => setPurchase(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Rehab / Renovation Cost</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="50,000" value={rehab} onChange={e => setRehab(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Holding Period (months)</label>
            <input type="number" placeholder="6" value={holdingMonths} onChange={e => setHoldingMonths(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Holding Cost (% ARV/yr)</label>
            <div className="relative"><input type="number" step="0.1" placeholder="1.0" value={holdingCostPct} onChange={e => setHoldingCostPct(e.target.value)} className={inputClass + " pr-7"} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Closing Costs (% ARV)</label>
            <div className="relative"><input type="number" step="0.1" placeholder="2.0" value={closingCostPct} onChange={e => setClosingCostPct(e.target.value)} className={inputClass + " pr-7"} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Desired Profit (MAO calc)</label>
            <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
              <input type="number" placeholder="20,000" value={desiredProfit} onChange={e => setDesiredProfit(e.target.value)} className={inputClass + " pl-7"} />
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Results</h2>
        {!results ? (
          <div className="bg-brand-gray-bg rounded-xl p-6 text-center text-brand-muted text-sm">Enter ARV to see your numbers</div>
        ) : (
          <div className="space-y-3">
            <div className="bg-brand-gray-bg rounded-xl p-5 space-y-3">
              {parseFloat(purchase) > 0 && (
                <Row label="Purchase Price" value={fmt(parseFloat(purchase))} />
              )}
              {parseFloat(rehab) > 0 && (
                <Row label="Rehab Cost" value={fmt(parseFloat(rehab))} />
              )}
              <Row label="Holding Costs (est.)" value={fmt(results.holdingCosts)} />
              <Row label="Closing Costs (est.)" value={fmt(results.closingCosts)} />
              <div className="border-t border-gray-200 pt-3">
                <Row label="Total All-In Cost" value={fmt(results.totalCosts)} bold />
              </div>
            </div>

            <div className={`rounded-xl p-5 ${results.profit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-navy">Estimated Profit</span>
                <span className={`text-xl font-bold ${results.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(results.profit)}</span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-brand-muted">
                <span>ROI</span><span className="font-semibold">{fmtPct(results.roi)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-brand-muted">
                <span>Profit % of ARV</span><span className="font-semibold">{fmtPct(results.profitPct)}</span>
              </div>
            </div>

            <div className="bg-brand-navy rounded-xl p-5 text-white">
              <div className="text-xs uppercase tracking-widest text-brand-blue mb-1 font-semibold">Maximum Allowable Offer (MAO)</div>
              <div className="text-3xl font-bold">{fmt(results.mao)}</div>
              <div className="text-xs text-gray-400 mt-1">Based on {fmt(parseFloat(desiredProfit) || 0)} desired profit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={bold ? "font-bold text-brand-navy" : "text-brand-muted"}>{label}</span>
      <span className={bold ? "font-bold text-brand-navy" : "text-brand-dark-text"}>{value}</span>
    </div>
  );
}
