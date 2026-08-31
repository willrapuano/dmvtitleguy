"use client";

import { Calculator, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TITLECAPTURE_QUOTE_URL } from "@/lib/titleCapture";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CompactTitleQuoteProps {
  locationName: string;
  placement: string;
}

export function CompactTitleQuote({ locationName, placement }: CompactTitleQuoteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loadStatus, setLoadStatus] = useState<"idle" | "loading" | "ready" | "slow">("idle");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (loadStatus !== "loading") return;

    const slowLoadTimer = window.setTimeout(() => setLoadStatus("slow"), 15000);
    return () => window.clearTimeout(slowLoadTimer);
  }, [loadStatus, iframeKey]);

  useEffect(() => {
    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
      }
    };
  }, []);

  const openCalculator = () => {
    if (!shouldLoad) {
      setShouldLoad(true);
      setLoadStatus("loading");
    }
    dialogRef.current?.showModal();
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.gtag?.("event", "title_quote_open", {
      page_location: window.location.href,
      placement,
    });
  };

  const closeCalculator = () => {
    dialogRef.current?.close();
  };

  const handleClose = () => {
    if (previousBodyOverflowRef.current !== null) {
      document.body.style.overflow = previousBodyOverflowRef.current;
      previousBodyOverflowRef.current = null;
    }
    triggerRef.current?.focus();
  };

  const retryCalculator = () => {
    setLoadStatus("loading");
    setIframeKey((currentKey) => currentKey + 1);
  };

  return (
    <>
      <aside
        className="rounded-xl bg-white p-6 text-brand-dark-text shadow-lg md:p-8"
        aria-labelledby="hero-title-quote-heading"
      >
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue-deep">
            <Calculator size={22} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue-deep">
              Instant estimate
            </p>
            <h2 id="hero-title-quote-heading" className="t-h5 text-brand-navy">
              Title Quote Calculator
            </h2>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-brand-muted">
          See estimated title insurance and settlement costs for your {locationName} transaction in minutes.
        </p>

        <ul className="mb-6 hidden space-y-3 text-sm text-brand-ink sm:block" aria-label="Calculator benefits">
          {[
            "Purchase and refinance quotes",
            "Local rates and transaction details",
            "No obligation to start your estimate",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check
                size={18}
                strokeWidth={2.5}
                className="mt-0.5 shrink-0 text-brand-blue-deep"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          ref={triggerRef}
          type="button"
          className="btn-primary min-h-11 w-full text-base"
          onClick={openCalculator}
          aria-haspopup="dialog"
        >
          Start My Title Quote →
        </button>
        <p className="mt-3 text-center text-xs leading-relaxed text-brand-muted">
          The calculator opens here on DMV Title Guy.
        </p>
      </aside>

      <dialog
        ref={dialogRef}
        className="m-auto h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-5xl overflow-hidden rounded-xl bg-white p-0 text-brand-dark-text shadow-2xl backdrop:bg-brand-navy/80 md:h-[calc(100dvh-3rem)] md:w-[calc(100%-3rem)]"
        aria-labelledby="title-quote-dialog-heading"
        onClose={handleClose}
        onClick={(event) => {
          if (event.currentTarget === event.target) closeCalculator();
        }}
      >
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
              DMV Title Guy
            </p>
            <h2 id="title-quote-dialog-heading" className="font-bold text-brand-navy">
              Title Quote Calculator
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCalculator}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-brand-navy hover:bg-brand-gray-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action"
            aria-label="Close title quote calculator"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="relative h-[calc(100dvh-5rem)] md:h-[calc(100dvh-7rem)]">
          {loadStatus === "loading" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white" role="status">
              <p className="text-sm font-medium text-brand-muted">Loading your title quote calculator…</p>
            </div>
          )}
          {loadStatus === "slow" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white px-6 text-center" role="alert">
              <h3 className="font-bold text-brand-navy">The calculator is taking longer than expected.</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-muted">
                Try loading it again, or call Will directly for a title quote without leaving DMV Title Guy.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn-primary" onClick={retryCalculator}>
                  Try Again
                </button>
                <a className="btn-outline" href="tel:+17038591467">
                  (703) 859-1467
                </a>
              </div>
            </div>
          )}
          {shouldLoad && (
            <iframe
              key={iframeKey}
              src={TITLECAPTURE_QUOTE_URL}
              className="h-full w-full border-0"
              title="Title quote calculator"
              allow="clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-downloads allow-forms allow-modals allow-same-origin allow-scripts allow-storage-access-by-user-activation"
              onLoad={() => setLoadStatus("ready")}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
