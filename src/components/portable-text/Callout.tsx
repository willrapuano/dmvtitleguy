"use client";

const TONE_STYLES: Record<string, { wrapper: string; icon: string }> = {
  info:    { wrapper: "bg-blue-50 border-blue-400 text-blue-900",   icon: "ℹ️" },
  warning: { wrapper: "bg-yellow-50 border-yellow-400 text-yellow-900", icon: "⚠️" },
  success: { wrapper: "bg-green-50 border-green-400 text-green-900", icon: "✅" },
  tip:     { wrapper: "bg-purple-50 border-purple-400 text-purple-900", icon: "💡" },
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
          {style.icon} {value.title}
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
