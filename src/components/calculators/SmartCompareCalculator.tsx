"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface Property {
  label: string;
  price: string;
  downPct: string;
  rate: string;
  termYears: string;
  hoa: string;
  taxes: string;
  insurance: string;
}

const defaultProp = (label: string): Property => ({
  label, price: "", downPct: "20", rate: "6.75", termYears: "30", hoa: "0", taxes: "1.2", insurance: "0.5",
});

function calcMonthly(p: Property) {
  const price = parseFloat(p.price) || 0;
  const down = price * (parseFloat(p.downPct) / 100);
  const loan = price - down;
  const r = (parseFloat(p.rate) || 0) / 100 / 12;
  const n = (parseFloat(p.termYears) || 30) * 12;
  const pi = loan > 0 && r > 0 ? loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const taxMo = price * (parseFloat(p.taxes) / 100) / 12;
  const insMo = price * (parseFloat(p.insurance) / 100) / 12;
  const hoaMo = parseFloat(p.hoa) || 0;
  const total = pi + taxMo + insMo + hoaMo;
  return { down, loan, pi, taxMo, insMo, hoaMo, total };
}

function PropForm({ prop, onChange }: { prop: Property; onChange: (p: Property) => void }) {
  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue bg-white";
  const labelClass = "block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1";
  const set = (key: keyof Property) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...prop, [key]: e.target.value });

  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Price</label>
        <div className="relative"><span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
          <input type="number" placeholder="500,000" value={prop.price} onChange={set("price")} className={inputClass + " pl-7"} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Down %</label>
          <div className="relative">
            <input type="number" placeholder="20" value={prop.downPct} onChange={set("downPct")} className={inputClass + " pr-7"} />
            <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Rate</label>
          <div className="relative">
            <input type="number" step="0.01" placeholder="6.75" value={prop.rate} onChange={set("rate")} className={inputClass + " pr-7"} />
            <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Tax Rate %</label>
          <div className="relative">
            <input type="number" step="0.01" placeholder="1.2" value={prop.taxes} onChange={set("taxes")} className={inputClass + " pr-7"} />
            <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>HOA /mo</label>
          <div className="relative"><span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
            <input type="number" placeholder="0" value={prop.hoa} onChange={set("hoa")} className={inputClass + " pl-7"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmartCompareCalculator() {
  const [propA, setPropA] = useState<Property>(defaultProp("Option A"));
  const [propB, setPropB] = useState<Property>(defaultProp("Option B"));

  const a = useMemo(() => calcMonthly(propA), [propA]);
  const b = useMemo(() => calcMonthly(propB), [propB]);

  const hasData = parseFloat(propA.price) > 0 || parseFloat(propB.price) > 0;
  const cheaper = a.total < b.total ? "A" : b.total < a.total ? "B" : null;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Option A */}
        <div className="border border-brand-blue rounded-xl p-5">
          <input className="text-base font-bold text-brand-navy border-none outline-none bg-transparent mb-3 w-full" value={propA.label} onChange={e => setPropA({ ...propA, label: e.target.value })} />
          <PropForm prop={propA} onChange={setPropA} />
        </div>
        {/* Option B */}
        <div className="border border-gray-200 rounded-xl p-5">
          <input className="text-base font-bold text-brand-navy border-none outline-none bg-transparent mb-3 w-full" value={propB.label} onChange={e => setPropB({ ...propB, label: e.target.value })} />
          <PropForm prop={propB} onChange={setPropB} />
        </div>
      </div>

      {hasData && (
        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-brand-muted font-semibold">Item</th>
                  <th className="text-right py-2 text-brand-navy font-bold">{propA.label}</th>
                  <th className="text-right py-2 text-brand-navy font-bold">{propB.label}</th>
                  <th className="text-right py-2 text-brand-muted font-semibold">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "Purchase Price", vA: parseFloat(propA.price) || 0, vB: parseFloat(propB.price) || 0 },
                  { label: "Down Payment", vA: a.down, vB: b.down },
                  { label: "Loan Amount", vA: a.loan, vB: b.loan },
                  { label: "P&I Payment", vA: a.pi, vB: b.pi },
                  { label: "Taxes /mo", vA: a.taxMo, vB: b.taxMo },
                  { label: "Insurance /mo", vA: a.insMo, vB: b.insMo },
                  { label: "HOA /mo", vA: a.hoaMo, vB: b.hoaMo },
                ].map(row => (
                  <tr key={row.label}>
                    <td className="py-2 text-brand-muted">{row.label}</td>
                    <td className="py-2 text-right text-brand-dark-text">{fmt(row.vA)}</td>
                    <td className="py-2 text-right text-brand-dark-text">{fmt(row.vB)}</td>
                    <td className={`py-2 text-right font-medium ${row.vA < row.vB ? "text-green-600" : row.vA > row.vB ? "text-red-500" : "text-brand-muted"}`}>
                      {row.vA === row.vB ? "—" : (row.vA < row.vB ? "-" : "+") + fmt(Math.abs(row.vA - row.vB))}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-brand-navy">
                  <td className="py-3 font-bold text-brand-navy">Total Monthly</td>
                  <td className={`py-3 text-right text-lg font-bold ${cheaper === "A" ? "text-green-600" : "text-brand-navy"}`}>{fmt(a.total)}</td>
                  <td className={`py-3 text-right text-lg font-bold ${cheaper === "B" ? "text-green-600" : "text-brand-navy"}`}>{fmt(b.total)}</td>
                  <td className={`py-3 text-right font-bold ${a.total < b.total ? "text-green-600" : a.total > b.total ? "text-red-500" : "text-brand-muted"}`}>
                    {a.total === b.total ? "—" : (a.total < b.total ? "-" : "+") + fmt(Math.abs(a.total - b.total))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {cheaper && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
              <span className="font-bold text-green-700">{cheaper === "A" ? propA.label : propB.label}</span>
              <span className="text-green-700"> saves {fmt(Math.abs(a.total - b.total))}/month — {fmt(Math.abs(a.total - b.total) * 12)}/year.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
