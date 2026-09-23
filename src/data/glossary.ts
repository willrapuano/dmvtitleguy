/**
 * Real-estate and settlement terms with no existing page on this site.
 *
 * Scope is deliberately narrow. Terms that already have a page (title
 * insurance, FIRPTA, escrow, surveys) are linked from here via `seeAlso`
 * instead of getting a second, competing glossary page — two URLs chasing one
 * query split the signal between them.
 *
 * The differentiator is jurisdiction: each entry leads with the plain answer,
 * then says what changes across DC, Maryland and Virginia.
 *
 * Compliance constraints (see docs/DMVTITLEGUY-SITE-BRIEF.md): nothing here may
 * imply legal advice. Entries describe how transactions customarily work and
 * where practice varies; they do not tell a reader what to do, and each page
 * carries a note pointing legal questions to an attorney.
 */

export type StateCode = "DC" | "MD" | "VA";

export interface JurisdictionNote {
  state: StateCode;
  /** What is specifically true of this term in this jurisdiction. */
  note: string;
}

export interface GlossaryFaq {
  question: string;
  answer: string;
}

export interface GlossaryTerm {
  /** URL segment, e.g. "contingent" -> /glossary/contingent */
  slug: string;
  /** Display heading, e.g. "Contingent" */
  term: string;
  /** Other phrasings this entry answers, used for on-page copy and internal search. */
  aliases?: string[];
  /** One-sentence answer. Written to stand alone as a featured snippet. */
  shortAnswer: string;
  /** The fuller explanation: 2–4 paragraphs, plain language. */
  body: string[];
  /** How the term behaves differently across DC, MD and VA — the reason to rank. */
  jurisdictions?: JurisdictionNote[];
  /** Questions people actually search alongside the term. */
  faqs?: GlossaryFaq[];
  /** Related entries by slug, for internal linking. */
  related?: string[];
  /** Existing site pages this term should hand off to. */
  seeAlso?: { label: string; href: string }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "contingent",
    term: "Contingent",
    aliases: [
      "contingent meaning",
      "what does contingent mean",
      "what does contingent mean in real estate",
      "contingent definition",
      "what is contingent",
      "what does contingent mean on a house",
    ],
    shortAnswer:
      "A contingent listing has an accepted offer, but the sale still depends on one or more conditions being met — most often the buyer's financing, appraisal, home inspection, or the sale of their current home.",
    body: [
      "\"Contingent\" is the status a listing takes on once a seller has accepted an offer that still carries conditions. The contract is signed and binding, but it contains escape hatches: specific things that must happen by specific dates, or the buyer can walk away and keep their deposit. Until every one of those conditions is satisfied or waived, the sale is not certain.",
      "The four conditions that appear most often are financing (the buyer's loan is actually approved, not merely pre-qualified), appraisal (the property appraises at or above the contract price), inspection (the buyer accepts the property's condition, or the parties agree on repairs), and home-sale (the buyer's existing home closes first). Each has its own deadline written into the contract, and each is a real point at which a deal can end.",
      "This is why a contingent listing is different from a pending one. Contingent means conditions are still outstanding. Pending generally means they have been cleared and the file is moving toward settlement. A buyer watching a contingent property is watching something that genuinely might come back on the market — which is why some listings accept backup offers while contingent.",
      "From the settlement side, the contingency period is when the title search happens. If the search turns up an unreleased lien, an old deed of trust that was never marked satisfied, or a boundary problem, that discovery lands while the contingencies are still live — which is precisely when there is still room to resolve it before closing.",
    ],
    jurisdictions: [
      {
        state: "VA",
        note: "Northern Virginia contracts commonly use the standard NVAR forms, where inspection is structured as a defined contingency period with a specific number of days. Virginia is a deed-of-trust state and closings are conducted by a settlement agent rather than an attorney, so the contingency clock and the title work run in parallel from the same file.",
      },
      {
        state: "MD",
        note: "Maryland contracts frequently carry a financing contingency tied to a stated loan type and rate ceiling, and Maryland's statutory disclosure or disclaimer election sits alongside the inspection contingency. Montgomery and Prince George's County transactions also commonly involve HOA or condo document review periods, which run on their own statutory clock separate from the inspection deadline.",
      },
      {
        state: "DC",
        note: "District contracts routinely include a condominium or cooperative document review period, and DC's rules around tenant purchase rights can add a step that has no equivalent across the river. A tenant-occupied property in the District may require that the tenant's right of first refusal be resolved before the sale can proceed, which functions in practice as an additional condition on the deal.",
      },
    ],
    faqs: [
      {
        question: "Can you still make an offer on a contingent house?",
        answer:
          "Often yes. Many sellers continue to accept backup offers while a listing is contingent, precisely because the contingencies might not clear. A backup offer takes effect only if the first contract falls through, and it does not obligate the seller to end the existing deal.",
      },
      {
        question: "How long does a house stay contingent?",
        answer:
          "It depends on which conditions are outstanding. Inspection contingencies are usually the shortest, often a week to ten days. Financing contingencies typically run until shortly before closing, so a listing can sit contingent for most of a 30–45 day settlement timeline.",
      },
      {
        question: "What is the difference between contingent and pending?",
        answer:
          "Contingent means conditions in the contract are still outstanding and the sale could still fall through. Pending generally means those conditions have been met or waived and the transaction is proceeding to settlement. Pending deals fail less often, though neither status is final until the deed records.",
      },
      {
        question: "Does contingent mean the house is sold?",
        answer:
          "No. A contingent listing has an accepted, binding contract, but the sale is not complete and the property has not transferred. Ownership changes only at settlement, when the deed is recorded in the land records of the county or city where the property sits.",
      },
    ],
    related: ["tenancy"],
    seeAlso: [
      { label: "What a title search actually finds", href: "/title-insurance" },
      { label: "Property surveys in DC, MD and VA", href: "/blog/types-of-property-surveys-dc-md-va" },
      { label: "How escrow works at a DMV closing", href: "/blog/escrow-companies-near-me-dmv" },
      { label: "Estimate closing costs", href: "/calculators" },
    ],
  },

  {
    slug: "tenancy",
    term: "Tenancy",
    aliases: ["types of tenancy", "tenancy meaning", "how to hold title"],
    shortAnswer:
      "Tenancy describes how two or more people hold title together — and it determines what happens to a share when one owner dies, and whether a creditor of one owner can reach the property.",
    body: [
      "How title is held is decided at settlement, written into the deed, and easy to overlook in the volume of closing paperwork. It is also one of the few decisions in a transaction whose consequences arrive decades later, usually at the worst possible moment.",
      "Tenants in common each hold a distinct share, which can be unequal, and each share passes under that owner's will or by intestacy when they die. There is no automatic transfer to the co-owner. This is the usual form for unrelated buyers, investment partners, or family members contributing different amounts.",
      "Joint tenants with right of survivorship hold equal shares, and when one dies their interest passes automatically to the survivors outside of probate. The survivorship language has to be explicit in the deed — a deed that simply names two people without it may not create survivorship at all.",
      "Tenancy by the entirety is available only to married couples and is the form with real teeth in this region. Neither spouse can convey their interest alone, survivorship is automatic, and a creditor of only one spouse generally cannot reach the property. For a married couple, this distinction is not paperwork — it is asset protection.",
    ],
    jurisdictions: [
      {
        state: "VA",
        note: "Virginia recognizes tenancy by the entirety for married couples, with the creditor protection that comes with it, and requires explicit survivorship language to create a joint tenancy with right of survivorship.",
      },
      {
        state: "MD",
        note: "Maryland recognizes tenancy by the entirety and applies a presumption in favor of it for married couples taking title together, which means the protective form often applies unless the deed says otherwise.",
      },
      {
        state: "DC",
        note: "The District recognizes tenancy by the entirety and extends it to domestic partners registered under DC law — a distinction that matters here and does not exist in the same form in either Maryland or Virginia.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between joint tenancy and tenancy in common?",
        answer:
          "Joint tenancy with right of survivorship passes a deceased owner's interest automatically to the surviving owners, outside probate. Tenancy in common does not — each share passes through the deceased owner's estate. Joint tenancy also requires equal shares, while tenancy in common allows unequal ones.",
      },
      {
        question: "Can a married couple hold title as tenants in common?",
        answer:
          "Yes, and sometimes there are reasons to. But doing so gives up the survivorship and creditor protection that tenancy by the entirety provides in DC, Maryland and Virginia, so it is a choice worth making deliberately with an attorney rather than by default.",
      },
      {
        question: "Can you change how title is held after closing?",
        answer:
          "Title can generally be changed by recording a new deed, but doing so can carry tax, lender and creditor consequences that are not obvious. It is a step to take with legal advice rather than as a form-filling exercise.",
      },
    ],
    related: ["contingent"],
    seeAlso: [
      { label: "Title insurance overview", href: "/title-insurance" },
      { label: "How settlement works", href: "/why-choose-us" },
    ],
  },
];

/** Every term slug, for route generation and sitemap inclusion. */
export const GLOSSARY_SLUGS = GLOSSARY_TERMS.map((t) => t.slug);

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

/** Alphabetical, for the index page. */
export function glossaryAlphabetical(): GlossaryTerm[] {
  return [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));
}

export const STATE_NAMES: Record<StateCode, string> = {
  DC: "Washington, DC",
  MD: "Maryland",
  VA: "Virginia",
};
