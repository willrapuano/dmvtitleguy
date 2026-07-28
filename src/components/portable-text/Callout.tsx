"use client";

import { Info, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

/**
 * Tone icons were emoji, which render differently on every platform and sit at
 * an inconsistent baseline next to the title. Real icons also let the tone read
 * by shape as well as by hue, which colour alone does not convey.
 */
const TONE_STYLES: Record<string, { wrapper: string; Icon: typeof Info }> = {
  info:    { wrapper: "bg-blue-50 border-blue-400 text-blue-900",       Icon: Info },
  warning: { wrapper: "bg-yellow-50 border-yellow-400 text-yellow-900", Icon: AlertTriangle },
  success: { wrapper: "bg-green-50 border-green-400 text-green-900",    Icon: CheckCircle2 },
  tip:     { wrapper: "bg-purple-50 border-purple-400 text-purple-900", Icon: Lightbulb },
};

export function Callout({ value }: { value: { tone?: string; title?: string; body?: string | any[] } }) {
  const tone = value.tone || "info";
  const style = TONE_STYLES[tone] || TONE_STYLES.info;

  // Handle body being string, array, or other type
  let body = value.body;
  if (Array.isArray(body)) {
    // If body is an array (from PortableText), join the text from children
    body = body.map((block: any) => 
      block?.children?.map((c: any) => c.text || "").join("") || ""
    ).join("\n");
  }
  body = String(body || "");

  // Split on bullet separator · or newline for list rendering
  const items = body.split(/\s*·\s*|\n/).map(s => s.trim()).filter(Boolean);
  const isList = items.length > 1;

  return (
    <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 ${style.wrapper}`}>
      {value.title && (
        <p className="font-semibold text-sm mb-2 max-w-[68ch] leading-relaxed">
          <style.Icon size={17} strokeWidth={2} className="mr-2 inline-block align-[-3px]" aria-hidden="true" />
          {value.title}
        </p>
      )}
      {isList ? (
        <ul className="space-y-1 text-[15px] leading-relaxed list-none pl-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-[3px] text-current opacity-50 shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] leading-relaxed max-w-[68ch]">{body}</p>
      )}
    </div>
  );
}
