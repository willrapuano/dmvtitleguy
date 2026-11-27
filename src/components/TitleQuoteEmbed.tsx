"use client";

import { useEffect, useState } from "react";
import { TITLECAPTURE_QUOTE_URL } from "@/lib/titleCapture";

interface TitleQuoteEmbedProps {
  title?: string;
  subtitle?: string;
}

export default function TitleQuoteEmbed({
  title = "Get Your TitleCapture Quote",
  subtitle = "Enter the actual transaction details below for a live estimate of title insurance, settlement charges, and applicable closing items.",
}: TitleQuoteEmbedProps) {
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "slow">("loading");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (loadStatus !== "loading") return;
    const slowTimer = window.setTimeout(() => setLoadStatus("slow"), 12000);
    return () => window.clearTimeout(slowTimer);
  }, [loadStatus, iframeKey]);

  const reloadCalculator = () => {
    setLoadStatus("loading");
    setIframeKey((current) => current + 1);
  };

  return (
    <section className="section-light" aria-labelledby="titlecapture-quote-heading">
      <div className="container-xl">
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue-deep">
            Powered by TitleCapture
          </p>
          <h2 id="titlecapture-quote-heading" className="t-h3 text-brand-navy mb-3">{title}</h2>
          <p className="text-brand-muted text-sm md:text-base max-w-[68ch] mx-auto leading-relaxed">{subtitle}</p>
          <p className="mt-3 text-xs leading-relaxed text-brand-muted">
            The quote tool stays embedded on DMV Title Guy. Results are estimates until Pruitt Title reviews the contract and transaction details.
          </p>
        </div>

        <div className="surface-card-elevated overflow-hidden bg-white p-2 sm:p-4">
          {loadStatus === "slow" && (
            <div
              className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-blue/20 bg-brand-blue/5 px-4 py-3 text-sm text-brand-navy"
              role="alert"
            >
              <span>The embedded calculator is taking longer than expected in this browser.</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={reloadCalculator}
                  className="inline-flex min-h-11 items-center rounded-md bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy/90"
                >
                  Reload calculator
                </button>
                <a
                  href={TITLECAPTURE_QUOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-xs font-semibold text-brand-blue-deep underline underline-offset-4 hover:text-brand-navy"
                >
                  Open quote tool in a new tab ↗
                </a>
              </div>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={TITLECAPTURE_QUOTE_URL}
            className="block min-h-[900px] w-full border-0 bg-white"
            title="TitleCapture title quote calculator for Pruitt Title LLC"
            allow="clipboard-write"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation"
            onLoad={() => setLoadStatus("ready")}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-2 pt-2 text-xs text-brand-muted">
            <span>Having trouble viewing the embedded calculator?</span>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={reloadCalculator}
                className="inline-flex min-h-11 items-center font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-blue-deep"
              >
                Reload calculator
              </button>
              <a
                href={TITLECAPTURE_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-semibold text-brand-blue-deep underline underline-offset-4 hover:text-brand-navy"
              >
                Open quote tool in a new tab ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
