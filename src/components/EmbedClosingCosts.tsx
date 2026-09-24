"use client";

import { useEffect, useRef, useState } from "react";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";

type State = "VA" | "MD" | "DC";
const STATES: { id: State; label: string }[] = [
  { id: "VA", label: "Virginia" },
  { id: "MD", label: "Maryland" },
  { id: "DC", label: "Washington, DC" },
];

/**
 * The calculator as it appears inside another site's iframe. It reports its height
 * to the parent page (a `dmvtitleguy:height` message) so the embed snippet can size
 * the iframe to fit; without the snippet's listener it simply scrolls.
 */
export function EmbedClosingCosts({ initialState }: { initialState: State }) {
  const [state, setState] = useState<State>(initialState);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.parent === window) return;
    // The calculator's own height, not the document's: the root layout's min-h-screen
    // would otherwise let the iframe grow but never shrink.
    const node = root.current;
    const post = () => window.parent.postMessage({ type: "dmvtitleguy:height", height: Math.ceil(node.getBoundingClientRect().height) }, "*");
    const observer = new ResizeObserver(post);
    observer.observe(node);
    post();
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="bg-white p-4 sm:p-6">
      <div role="tablist" aria-label="State" className="mb-6 flex gap-x-6 border-b border-brand-line">
        {STATES.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={state === s.id}
            onClick={() => setState(s.id)}
            className={`-mb-px border-b-2 pb-3 pt-1 text-[15px] font-semibold ${state === s.id ? "border-brand-brass text-brand-navy" : "border-transparent text-brand-ink-light hover:text-brand-navy"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <ClosingCostCalculator key={state} state={state} embedded />
      <p className="mt-6 text-xs leading-relaxed text-brand-ink-light">
        Closing cost calculator by{" "}
        <a href="https://dmvtitleguy.io/calculators?utm_source=embed&utm_medium=widget&utm_campaign=closing-cost-calculator" target="_blank" rel="noopener" className="font-semibold text-brand-navy underline decoration-brand-brass underline-offset-2">
          DMV Title Guy
        </a>
        , an educational website by Will Rapuano. It is not a title insurer or settlement provider.
      </p>
    </div>
  );
}
