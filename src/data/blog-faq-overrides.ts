import type { BlogFAQItem } from "@/lib/blog-portable-content";

/**
 * A legacy URL and its newer duplicate cover the same enhanced-vs-standard
 * policy comparison. Reuse the first three clean, already-published Sanity FAQ
 * answers from `title-insurance-enhanced-vs-standard`; do not invent new copy.
 */
export const BLOG_FAQ_OVERRIDES: Record<string, BlogFAQItem[]> = {
  "enhanced-title-insurance-vs-standard": [
    {
      question: "What is the difference between standard and enhanced title insurance?",
      answer:
        "Standard owner's title insurance protects against a core set of title defects that existed before closing, such as undisclosed liens, forgery, recording errors, or ownership disputes. Enhanced owner's title insurance usually includes that same baseline coverage plus broader protections for certain boundary issues, permit-related problems, legal access issues, and other risks spelled out in the policy form.",
    },
    {
      question: "Is enhanced title insurance worth it in Virginia, Maryland, or DC?",
      answer:
        "It often can be, especially if the property is older, has additions or renovations, sits on a tight lot, or has a more complex ownership history. The value depends on the specific property and premium difference, but many DMV buyers decide the broader coverage is worth the added one-time cost.",
    },
    {
      question: "Does a lender's policy include enhanced coverage?",
      answer:
        "Not automatically. A lender's title insurance policy protects the lender's interest, not the buyer's ownership interest. Whether enhanced coverage exists on the lender side depends on the policy and transaction, but buyers still need to evaluate their own owner's policy separately.",
    },
  ],
};
