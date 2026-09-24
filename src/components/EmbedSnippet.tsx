"use client";

import { useState } from "react";

// The credit link is rel="nofollow": Google's spam policies treat followed links
// distributed through widgets as link schemes. The embed earns visibility and
// referral visits, not ranking credit.
export const EMBED_SNIPPET = `<iframe id="dmvtitleguy-calculator" src="https://dmvtitleguy.io/embed/closing-costs" title="DC, Maryland and Virginia closing cost calculator" loading="lazy" style="width:100%;height:900px;border:0"></iframe>
<p style="font:13px/1.5 sans-serif;margin:6px 0 0">Closing cost calculator by <a href="https://dmvtitleguy.io/calculators?utm_source=embed&amp;utm_medium=widget&amp;utm_campaign=closing-cost-calculator" rel="nofollow">DMV Title Guy</a></p>
<script>window.addEventListener("message",function(e){if(e.origin==="https://dmvtitleguy.io"&&e.data&&e.data.type==="dmvtitleguy:height"){document.getElementById("dmvtitleguy-calculator").style.height=e.data.height+"px"}});</script>`;

export function EmbedSnippet() {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-all border border-brand-line bg-brand-gray-bg p-4 text-[13px] leading-relaxed text-brand-ink">{EMBED_SNIPPET}</pre>
      <button
        type="button"
        className="btn-primary mt-4"
        onClick={async () => {
          await navigator.clipboard.writeText(EMBED_SNIPPET);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copied" : "Copy the code"}
      </button>
    </div>
  );
}
