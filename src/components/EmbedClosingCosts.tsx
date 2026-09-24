"use client";

import { useEffect, useRef } from "react";
import { TITLECAPTURE_QUOTE_URL } from "@/lib/titleCapture";

/**
 * Pruitt Title's TitleCapture calculator suite (title quote, seller net sheet, loan
 * estimate, closing disclosure and more) as it appears inside another site's iframe,
 * with the site's disclosure. It reports its height to the parent page (a
 * `dmvtitleguy:height` message) so the embed snippet can size the iframe to fit.
 */
export function EmbedClosingCosts() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.parent === window) return;
    // The wrapper's own height, not the document's: the root layout's min-h-screen
    // would otherwise let the iframe grow but never shrink.
    const node = root.current;
    const post = () => window.parent.postMessage({ type: "dmvtitleguy:height", height: Math.ceil(node.getBoundingClientRect().height) }, "*");
    const observer = new ResizeObserver(post);
    observer.observe(node);
    post();
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="bg-white">
      <iframe
        src={TITLECAPTURE_QUOTE_URL}
        className="block min-h-[900px] w-full border-0"
        title="Pruitt Title quote and closing cost calculator (TitleCapture)"
        allow="clipboard-write"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-downloads allow-forms allow-modals allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-popups allow-popups-to-escape-sandbox"
      />
      <p className="px-4 py-3 text-xs leading-relaxed text-brand-ink-light">
        Calculator provided by Pruitt Title LLC through TitleCapture; results are estimates until Pruitt Title reviews the contract. Shared by{" "}
        <a href="https://dmvtitleguy.io/?utm_source=embed&utm_medium=widget&utm_campaign=pruitt-calculator" target="_blank" rel="noopener" className="font-semibold text-brand-navy underline decoration-brand-brass underline-offset-2">
          DMV Title Guy
        </a>
        , Will Rapuano of Pruitt Title.
      </p>
    </div>
  );
}
