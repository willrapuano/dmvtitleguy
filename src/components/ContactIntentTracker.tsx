"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/client-analytics";

/**
 * Records the lead actions that never reach /api/leads, so GA4 can count them as
 * key events:
 *   click_to_call         a tel: link was tapped
 *   click_to_email        a mailto: link was tapped
 *   title_quote_interact  the visitor clicked into the TitleCapture quote iframe
 *
 * The iframe is cross-origin, so its own submissions are invisible here. Focus
 * moving into it (window blur with the iframe as activeElement) is the closest
 * signal we can see; it fires once per page view.
 */
export function ContactIntentTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackAnalyticsEvent("click_to_call", { link_url: href, link_text: link.textContent?.trim().slice(0, 80) });
      } else if (href.startsWith("mailto:")) {
        trackAnalyticsEvent("click_to_email", { link_url: href.split("?")[0], link_text: link.textContent?.trim().slice(0, 80) });
      }
    };

    let quoteTracked = false;
    const onBlur = () => {
      if (quoteTracked) return;
      // Blur fires before focus settles on the iframe in some browsers.
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLIFrameElement && active.src.includes("titlecapture.com")) {
          quoteTracked = true;
          trackAnalyticsEvent("title_quote_interact", {});
        }
      }, 0);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("blur", onBlur);
    };
  }, [pathname]);

  return null;
}
