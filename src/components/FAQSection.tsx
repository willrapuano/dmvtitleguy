"use client";

import { useState, useEffect } from "react";
import { BlogArticle } from "@/components/BlogArticle";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({
  faqs,
  includeSchema = true,
}: {
  faqs: FAQItem[];
  includeSchema?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <>
      {includeSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question?.replace(/^##\s+/, "").replace(/^#\s+/, "").trim() || "",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
      <div className="mt-14 pt-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-brand-navy mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-0 divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {faqs.map((faq, i) => (
            <details
              key={`faq-${i}`}
              className="group cursor-pointer bg-white"
              // Only set open after mount to prevent hydration mismatch
              open={mounted ? i === 0 : false}
            >
              <summary className="flex items-start justify-between gap-4 list-none [&::-webkit-details-marker]:hidden select-none px-5 py-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-brand-navy text-base leading-snug pr-4">
                  {faq.question?.replace(/^##\s+/, '').replace(/^#\s+/, '').trim() || ''}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-open:rotate-180 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-4 text-gray-700 leading-relaxed">
                <BlogArticle content={faq.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
