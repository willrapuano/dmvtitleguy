import type { BlogFAQItem } from "@/lib/blog-portable-content";

/**
 * Code-level FAQs for posts whose CMS body has none.
 *
 * 2026-10-16: the lender's-vs-owner's and lender's-policy duplicates were 301'd to
 * these two posts. The first set carries over the duplicate's published FAQ; the
 * second uses Stewart Title's published rate manuals (VA eff. 2025-07-01, MD eff.
 * 2025-11-24) for its figures.
 */
export const BLOG_FAQ_OVERRIDES: Record<string, BlogFAQItem[]> = {
  "difference-between-lenders-and-owners-title-insurance": [
    {
      question: "What is the difference between an owner's policy and a lender's policy?",
      answer:
        "An owner's policy protects the buyer or property owner. A lender's policy protects the mortgage lender. They are separate title insurance policies created for different interests in the same transaction.",
    },
    {
      question: "Is lender's title insurance required?",
      answer:
        "If you are financing the purchase, the lender usually requires it before the loan can close. Cash buyers typically do not need a lender's policy because there is no mortgage lender involved.",
    },
    {
      question: "Is owner's title insurance required?",
      answer:
        "It is often optional from a contract standpoint, but that does not mean it is unimportant. It is the policy that protects your ownership rights and equity against covered title defects.",
    },
    {
      question: "Who pays for owner's title insurance in Virginia, Maryland, and DC?",
      answer:
        "The buyer customarily pays for the owner's policy in Virginia, Maryland and DC. It's local practice, not law, so it can be negotiated in the contract.",
    },
    {
      question: "Does a title search make owner's title insurance unnecessary?",
      answer:
        "No. A title search reduces risk, but it does not eliminate every possible issue. Title insurance exists because some defects are hidden, recorded incorrectly, or discovered only after closing.",
    },
  ],
  "lender-title-insurance": [
    {
      question: "Is lender's title insurance required?",
      answer:
        "If you are financing the purchase, the lender usually requires it before the loan can close. Cash buyers typically do not need a lender's policy because there is no mortgage lender involved.",
    },
    {
      question: "How much does lender's title insurance cost?",
      answer:
        "It depends on the loan amount and the underwriter. In Stewart Title's published Virginia schedule, a lender's policy on a $500,000 loan is $1,545 on its own, or $200 when it is issued with an owner's policy at a purchase. In Stewart's Maryland schedule, the same figures are $1,680 and $350. Other underwriters' rates differ.",
    },
    {
      question: "Does the lender's policy protect me as the buyer?",
      answer:
        "No. It protects the lender's interest in the property, up to the loan amount. Only an owner's policy protects your ownership and equity.",
    },
    {
      question: "Do I need a new lender's policy when I refinance?",
      answer:
        "Yes. A refinance is a new loan, so the new lender requires a new lender's policy. Many underwriters charge a lower refinance rate: Stewart's published refinance rate is 70% of its standard loan rate in Virginia and 60% in Maryland.",
    },
  ],
};
