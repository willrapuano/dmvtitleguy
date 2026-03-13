"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function CompensationCalculator() {
  const [salePrice, setSalePrice] = useState("");
  const [totalCommission, setTotalCommission] = useState("5.0");
  const [agentSplit, setAgentSplit] = useState("70");
  const [brokerSplit, setBrokerSplit] = useState("30");
  const [referralFee, setReferralFee] = useState("0");
  const [side, setSide] = useState<"both" | "listing" | "buyer">("listing");

  const results = useMemo(() => {
    const price = parseFloat(salePrice) || 0;
    const totalPct = parseFloat(totalCommission) / 100;
    const agentPct = parseFloat(agentSplit) / 100;
    const referralPct = parseFloat(referralFee) / 100;

    const totalGross = price * totalPct;
    const sideGross = side === "both" ? totalGross : totalGross / 2;
    const afterReferral = sideGross * (1 - referralPct);
    const agentNet = afterReferral * agentPct;
    const brokerNet = afterReferral * (1 - agentPct);

    return { totalGross, sideGross, afterReferral, agentNet, brokerNet };
  }, [salePrice, totalCommission, agentSplit, brokerSplit, referralFee, side]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* INPUTS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Transaction Details</h2>

        <div>
          <label className={labelClass}>Sale Price</label>
          <div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="500,000" value={salePrice} onChange={e => setSalePrice(e.target.value)} className={inputClass + " pl-7"} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Total Commission</label>
          <div className="relative">
            <input type="number" step="0.1" placeholder="5.0" value={totalCommission} onChange={e => setTotalCommission(e.target.value)} className={inputClass + " pr-7"} />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Commission Side</label>
          <div className="grid grid-cols-3 gap-2">
            {(["listing", "buyer", "both"] as const).map(s => (
              <button key={s} onClick={() => setSide(s)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${side === s ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-brand-navy border-gray-200 hover:border-brand-blue"}`}>
                {s === "listing" ? "Listing Side" : s === "buyer" ? "Buyer Side" : "Both Sides"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Agent Split</label>
            <div className="relative">
              <input type="number" placeholder="70" value={agentSplit} onChange={e => { setAgentSplit(e.target.value); setBrokerSplit(String(100 - (parseFloat(e.target.value) || 0))); }} className={inputClass + " pr-7"} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Broker Split</label>
            <div className="relative">
              <input type="number" placeholder="30" value={brokerSplit} onChange={e => { setBrokerSplit(e.target.value); setAgentSplit(String(100 - (parseFloat(e.target.value) || 0))); }} className={inputClass + " pr-7"} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Referral Fee (if any)</label>
          <div className="relative">
            <input type="number" step="0.1" placeholder="0" value={referralFee} onChange={e => setReferralFee(e.target.value)} className={inputClass + " pr-7"} />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Compensation Breakdown</h2>
        {!parseFloat(salePrice) ? (
          <div className="bg-brand-gray-bg rounded-xl p-6 text-center text-brand-muted text-sm">Enter a sale price to see the breakdown</div>
        ) : (
          <div className="space-y-3">
            <div className="bg-brand-gray-bg rounded-xl p-5 space-y-3">
              <Row label="Total Gross Commission" value={fmt(results.totalGross)} />
              <Row label={`Your Side (${side === "both" ? "both" : side})`} value={fmt(results.sideGross)} />
              {parseFloat(referralFee) > 0 && (
                <Row label={`After Referral (${referralFee}%)`} value={fmt(results.afterReferral)} />
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-navy">Agent Take-Home</span>
                <span className="text-2xl font-bold text-green-600">{fmt(results.agentNet)}</span>
              </div>
              <div className="text-xs text-brand-muted mt-1">{agentSplit}% of side commission{parseFloat(referralFee) > 0 ? " after referral" : ""}</div>
            </div>

            <div className="bg-brand-gray-bg rounded-xl p-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted">Broker Portion</span>
                <span className="font-semibold text-brand-dark-text">{fmt(results.brokerNet)}</span>
              </div>
            </div>
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
