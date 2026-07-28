import type { ReactNode } from "react";

/**
 * The section header used across the marketing pages.
 *
 * Most sections previously opened with a centred stack — heading, decorative
 * dash, centred paragraph — repeated verbatim, which is what made the pages read
 * as one template rather than a designed site. This pairs a small-caps label with
 * a display heading and left-aligns by default, so sections share a left edge.
 *
 * `index` is optional on purpose. A numeral should only appear where order is
 * real information — a sequence of steps, or a spine the reader is meant to
 * follow — never as decoration on an unordered set.
 */
export function SectionHead({
  index,
  label,
  title,
  lede,
  center = false,
  className = "",
}: {
  index?: string;
  label?: string;
  title: ReactNode;
  lede?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {label && (
        <p
          className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue-deep ${
            center ? "justify-center" : ""
          }`}
        >
          {index && <span className="font-display text-sm tabular-nums">{index}</span>}
          <span aria-hidden="true" className="h-px w-8 bg-brand-blue-deep/40" />
          {label}
        </p>
      )}
      <h2 className={`t-h2 text-brand-navy ${label ? "mt-4" : ""}`}>{title}</h2>
      {lede && (
        <p
          className={`mt-4 max-w-[62ch] leading-relaxed text-brand-muted ${center ? "mx-auto" : ""}`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
