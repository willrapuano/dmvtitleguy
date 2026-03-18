interface TitleQuoteEmbedProps {
  title?: string;
  subtitle?: string;
}

const TITLE_QUOTE_URL = "https://pruitt-title.titlecapture.com/title-quote";

export default function TitleQuoteEmbed({
  title = "Get an Instant Title & Escrow Quote",
  subtitle = "Use our live quote tool for a precise, line-by-line estimate for your transaction.",
}: TitleQuoteEmbedProps) {
  return (
    <section className="section-light">
      <div className="container-xl">
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">{title}</h2>
          <p className="text-brand-muted text-sm md:text-base">{subtitle}</p>
        </div>

        <iframe
          src={TITLE_QUOTE_URL}
          width="100%"
          style={{ border: "none", minHeight: "900px" }}
          title="Title Quote Calculator — Pruitt Title LLC"
          allow="clipboard-write"
          loading="lazy"
        />
      </div>
    </section>
  );
}
