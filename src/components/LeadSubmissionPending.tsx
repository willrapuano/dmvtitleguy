"use client";

import { useEffect, useRef } from "react";

/** Terminal for this attempt: do not encourage a second, potentially duplicate submission. */
export function LeadSubmissionPending() {
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    statusRef.current?.focus();
  }, []);

  return (
    <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} className="rounded-xl bg-white p-5 text-center shadow-lg sm:p-8">
      <h3 className="t-h5 text-brand-navy mb-2">Delivery is not yet confirmed.</h3>
      <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
        Please do not submit again. If you need to confirm your request, call Will at{" "}
        <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
      </p>
    </div>
  );
}
