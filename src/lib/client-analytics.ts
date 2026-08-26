declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  window.gtag?.("event", eventName, {
    page_path: window.location.pathname,
    ...parameters,
  });
}

export function trackLeadConversion(formType: string, pageContext?: string) {
  trackAnalyticsEvent("generate_lead", {
    form_type: formType,
    ...(pageContext ? { page_context: pageContext } : {}),
  });
}
