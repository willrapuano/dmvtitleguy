import { BlogArticle } from "@/components/BlogArticle";
import { blogFAQQuestionKey, blogFAQSchemaText, type BlogFAQItem } from "@/lib/blog-portable-content";
import { serializeJsonLd } from "@/lib/json-ld";

function cleanQuestion(question: string): string {
  return question.replace(/^##\s+/, "").replace(/^#\s+/, "").trim();
}

export function FAQSection({
  faqs,
  includeSchema = true,
}: {
  faqs: BlogFAQItem[];
  includeSchema?: boolean;
}) {
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
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: cleanQuestion(faq.question),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: blogFAQSchemaText(faq.answer),
                },
              })),
            }),
          }}
        />
      )}
      <section
        className="mt-14 border-t border-gray-100 pt-10"
        aria-labelledby="article-faq-heading"
        data-blog-faq-section
      >
        <h2 id="article-faq-heading" className="t-h4 mb-8 text-brand-navy">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
          {faqs.map((faq) => (
            <details
              key={blogFAQQuestionKey(faq.question)}
              className="group cursor-pointer bg-white"
              data-blog-faq-item
              data-blog-question-key={blogFAQQuestionKey(faq.question)}
            >
              <summary className="flex items-start justify-between gap-4 list-none [&::-webkit-details-marker]:hidden select-none px-5 py-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-brand-navy text-base leading-snug pr-4">
                  {cleanQuestion(faq.question)}
                </span>
                <span aria-hidden="true" className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue-deep group-open:rotate-180 transition-transform motion-reduce:transition-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" focusable="false">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </span>
              </summary>
              <div className="faq-answer px-5 pb-4 text-gray-700 leading-relaxed">
                <BlogArticle content={faq.answer} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
