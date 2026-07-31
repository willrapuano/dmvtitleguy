declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLeadConversion(formType: string, pageContext?: string) {
  window.gtag?.("event", "generate_lead", {
    form_type: formType,
    page_path: window.location.pathname,
    ...(pageContext ? { page_context: pageContext } : {}),
  });
}
