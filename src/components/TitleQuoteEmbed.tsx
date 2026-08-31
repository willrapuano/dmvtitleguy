import { TITLECAPTURE_QUOTE_URL } from "@/lib/titleCapture";

interface TitleQuoteEmbedProps {
  title?: string;
  subtitle?: string;
}

export default function TitleQuoteEmbed({
  title = "Get Your TitleCapture Quote",
  subtitle = "Enter the actual transaction details below for a live estimate of title insurance, settlement charges, and applicable closing items.",
}: TitleQuoteEmbedProps) {
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

        <div className="surface-card-elevated overflow-hidden p-2 sm:p-4">
          <iframe
            src={TITLECAPTURE_QUOTE_URL}
            className="block min-h-[900px] w-full border-0"
            title="TitleCapture title quote calculator for Pruitt Title LLC"
            allow="clipboard-write"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-downloads allow-forms allow-modals allow-same-origin allow-scripts allow-storage-access-by-user-activation"
          />
        </div>
      </div>
    </section>
  );
}
