import Link from "next/link";
import { Info, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

/**
 * Tone icons were emoji, which render differently on every platform and sit at
 * an inconsistent baseline next to the title. Real icons also let the tone read
 * by shape as well as by hue, which colour alone does not convey.
 *
 * Tones use the site palette: fog ground with a navy or brass rule. Warning keeps
 * an amber ground because it has to read as a warning, not as decoration.
 */
const TONE_STYLES: Record<string, { wrapper: string; Icon: typeof Info }> = {
  info:    { wrapper: "bg-brand-gray-bg border-brand-navy text-brand-ink",  Icon: Info },
  warning: { wrapper: "bg-amber-50 border-amber-500 text-amber-950",        Icon: AlertTriangle },
  success: { wrapper: "bg-brand-gray-bg border-brand-brass text-brand-ink", Icon: CheckCircle2 },
  tip:     { wrapper: "bg-brand-gray-bg border-brand-brass text-brand-ink", Icon: Lightbulb },
};

type Segment = { text: string; href?: string };

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?dmvtitleguy\.io(?=\/|$)/i;

// Callout links written before these routes moved; link straight to the live page
// instead of through a redirect.
const MOVED_PATHS: Record<string, string> = {
  "/closing-costs/virginia": "/virginia-closing-cost-calculator",
  "/title-company/bethesda-md": "/title-company-bethesda-md",
  "/title-company/falls-church-va": "/title-company-falls-church-va",
};

function toHref(href: string) {
  const local = href.replace(SITE_ORIGIN, "") || "/";
  return MOVED_PATHS[local] || local;
}

/**
 * Flatten a callout body into lines of text/link segments. Imported callouts
 * carry links in two shapes: the normal Portable Text one (span.marks → markDefs
 * key) and a malformed one where the mark sits on the block and the markDef has
 * no key. Rendering the body as plain text dropped both, so every "Ready to Take
 * the Next Step?" call to action on the blog rendered as unclickable text.
 */
function toLines(body: unknown): Segment[][] {
  if (!Array.isArray(body)) return String(body || "").split("\n").map((line) => [{ text: line }]);
  return body.map((block: any) => {
    const defs: any[] = (block?.markDefs || []).filter((d: any) => d?._type === "link" && d?.href);
    const blockLink = defs.length > 0 && (block?.marks?.length || defs.every((d) => !d._key)) ? defs[0].href : undefined;
    return (block?.children || []).map((span: any) => {
      const def = defs.find((d) => d._key && span?.marks?.includes(d._key));
      return { text: span?.text || "", href: def?.href || blockLink };
    });
  });
}

function Segments({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (!seg.href) return <span key={i}>{seg.text}</span>;
        const href = toHref(seg.href);
        const className = "font-semibold underline decoration-brand-brass decoration-2 underline-offset-[3px] hover:text-brand-navy";
        return href.startsWith("/") ? (
          <Link key={i} href={href} className={className}>{seg.text}</Link>
        ) : (
          <a key={i} href={href} className={className} target="_blank" rel="noopener noreferrer">{seg.text}</a>
        );
      })}
    </>
  );
}

export function Callout({ value }: { value: { tone?: string; title?: string; body?: string | any[] } }) {
  const tone = value.tone || "info";
  const style = TONE_STYLES[tone] || TONE_STYLES.info;

  // Split on bullet separator · or newline for list rendering (plain-text bodies).
  let lines = toLines(value.body);
  if (lines.length === 1 && lines[0].length === 1 && !lines[0][0].href) {
    lines = lines[0][0].text.split(/\s*·\s*/).map((text) => [{ text }]);
  }
  lines = lines.filter((line) => line.some((seg) => seg.text.trim()));
  const isList = lines.length > 1;

  return (
    <aside className={`article-callout my-6 border-l-4 px-5 py-4 ${style.wrapper}`}>
      {value.title && (
        <p className="mb-2 max-w-[68ch] text-sm font-semibold leading-relaxed">
          <style.Icon size={17} strokeWidth={2} className="mr-2 inline-block align-[-3px]" aria-hidden="true" />
          {value.title}
        </p>
      )}
      {isList ? (
        <ul className="list-none space-y-1 pl-0 text-[15px] leading-relaxed">
          {lines.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-[3px] shrink-0 text-current opacity-50">—</span>
              <span><Segments segments={line} /></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[68ch] text-[15px] leading-relaxed">{lines[0] ? <Segments segments={lines[0]} /> : null}</p>
      )}
    </aside>
  );
}
