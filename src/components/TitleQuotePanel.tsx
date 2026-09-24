import Link from "next/link";
import { TITLECAPTURE_QUOTE_URL } from "@/lib/titleCapture";

/**
 * Pruitt Title's live TitleCapture quote calculator, sized for a hero side panel.
 * Pages whose panel says "Get a Title Quote" use this rather than a contact form:
 * the calculator returns the actual title premium and settlement charges on the
 * spot, where a form only asks Will to follow up.
 */
export function TitleQuotePanel({ heading = "Get a Title Quote" }: { heading?: string }) {
  return (
    <div className="overflow-hidden bg-white shadow-xl">
      <div className="border-b border-brand-line px-6 pb-4 pt-6">
        <h2 className="t-h5 font-semibold text-brand-navy">{heading}</h2>
        <p className="mt-1 text-sm leading-relaxed text-brand-muted">
          Pruitt Title&apos;s live calculator: enter the address, price and loan for your title premium, settlement charges and taxes.
        </p>
      </div>
      <iframe
        src={TITLECAPTURE_QUOTE_URL}
        className="block h-[820px] w-full border-0"
        title="Pruitt Title quote calculator (TitleCapture)"
        allow="clipboard-write"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-downloads allow-forms allow-modals allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-popups allow-popups-to-escape-sandbox"
      />
      <p className="border-t border-brand-line px-6 py-4 text-sm leading-relaxed text-brand-muted">
        Estimates until Pruitt Title reviews the contract.{" "}
        <Link href="/contact" className="font-semibold text-brand-navy underline decoration-brand-brass underline-offset-2">
          Questions? Contact Will
        </Link>
      </p>
    </div>
  );
}
