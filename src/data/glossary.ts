/**
 * Real-estate and settlement terms, as a generated content axis.
 *
 * Why this exists: the incumbent that dominates organic search in this niche
 * ranks for ~430 definitional and topical keywords against ~36 local ones, and
 * the definitional set is where its coverage is widest. But it is coverage
 * without depth — it sits at position 45–93 on terms drawing 1,500–29,000
 * searches a month. Those positions are not a moat, they are an opening: the
 * generic definition is already written a hundred times over, so a page that
 * merely defines the word joins the pile at position 60.
 *
 * The differentiator here is jurisdiction. A settlement professional working
 * DC, Maryland and Virginia every week knows how each term actually behaves in
 * each of the three, and that is the part the generic pages cannot write. Every
 * entry therefore leads with the plain answer and then says what changes across
 * the DMV — because that is both the honest reason this page deserves to rank
 * and the reason a reader in Bethesda or Arlington stays on it.
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
    related: ["title-insurance", "escrow", "tenancy"],
    seeAlso: [
      { label: "What a title search actually finds", href: "/title-insurance" },
      { label: "Estimate closing costs", href: "/calculators" },
    ],
  },

  {
    slug: "title-insurance",
    term: "Title Insurance",
    aliases: [
      "what is title insurance",
      "title insurance definition",
      "title insurance meaning",
    ],
    shortAnswer:
      "Title insurance protects against ownership problems that already existed when you bought the property but were not discovered during the title search — forged signatures, unreleased liens, recording errors, or unknown heirs.",
    body: [
      "Almost every other insurance policy covers what might go wrong in the future. Title insurance is the opposite: it covers what already went wrong in the past but has not yet surfaced. The premium is paid once, at settlement, and the coverage lasts as long as you or your heirs hold an interest in the property.",
      "The title search is the first line of defense. A searcher examines the recorded history of the property — deeds, deeds of trust, judgments, tax records, easements — looking for anything that would cloud clear ownership. Most problems are found here and cleared before closing. Title insurance exists for the ones a search cannot find: a deed signed by someone impersonating the owner, an heir nobody knew existed, a clerk indexing a lien under a misspelled name.",
      "There are two policies and they protect different people. The lender's policy is almost always required by the mortgage lender and protects only the lender's interest, decreasing as the loan is paid down. The owner's policy is optional, protects the buyer's equity, and is the one that actually covers the homeowner. A buyer who takes only the lender's policy is insuring their bank and not themselves.",
      "The practical value shows up rarely but decisively. Most owners never make a claim. The ones who do are usually facing something they could not have prevented and did not cause — and are facing it against a property they have already paid for.",
    ],
    jurisdictions: [
      {
        state: "VA",
        note: "Virginia title insurance rates are filed by the underwriters rather than promulgated by the state, so pricing can differ between companies for identical coverage. Virginia also recognizes a reissue rate: when the property was insured within a defined prior period, a portion of the earlier premium can reduce the new one, and the savings are real on a refinance.",
      },
      {
        state: "MD",
        note: "Maryland likewise allows filed rates with reissue credit, and Maryland closings customarily bundle title work with the settlement conducted by a licensed title agent. Because Maryland recordation and transfer taxes are themselves a substantial line item, the title premium is often a smaller share of a Maryland buyer's total closing costs than buyers expect.",
      },
      {
        state: "DC",
        note: "In the District, the recordation and transfer tax structure — and the first-time buyer recordation reduction available to qualifying purchasers — tends to dominate the closing statement. Title premiums in DC follow filed rates, and reissue credit can apply where a prior policy exists on the same property.",
      },
    ],
    faqs: [
      {
        question: "Do I need owner's title insurance?",
        answer:
          "It is optional in DC, Maryland and Virginia, and it is the only policy that protects the buyer rather than the lender. The lender's policy required by your mortgage covers the lender's interest alone. Whether the owner's policy is worth its one-time premium is a decision worth discussing with your settlement agent while reviewing the actual title search results.",
      },
      {
        question: "How much does title insurance cost?",
        answer:
          "Premiums are based on the policy amount — generally the purchase price for an owner's policy and the loan amount for a lender's policy — and vary by underwriter and jurisdiction. A reissue rate can reduce the premium substantially when the property was insured recently. A settlement quote will show the exact figure for your transaction.",
      },
      {
        question: "How long does title insurance last?",
        answer:
          "An owner's policy lasts as long as you or your heirs retain an interest in the property. There is no renewal and no recurring premium. A lender's policy lasts for the life of that specific loan and ends when the loan is paid off or refinanced.",
      },
    ],
    related: ["contingent", "escrow", "tenancy"],
    seeAlso: [
      { label: "Title insurance overview", href: "/title-insurance" },
      { label: "Get a title quote", href: "/calculators/title-quote" },
    ],
  },

  {
    slug: "firpta",
    term: "FIRPTA",
    aliases: ["firpta meaning", "what is firpta", "firpta withholding"],
    shortAnswer:
      "FIRPTA is the Foreign Investment in Real Property Tax Act, which requires a buyer to withhold a percentage of the sale price when purchasing US real estate from a foreign seller, and remit it to the IRS.",
    body: [
      "FIRPTA shifts a tax collection duty onto the buyer. When the seller of US real property is a foreign person for tax purposes, the buyer is generally required to withhold a portion of the gross sale price at settlement and send it to the IRS, rather than paying the full proceeds to the seller. The withholding is not the tax itself — it is a deposit against whatever the seller ultimately owes.",
      "The obligation sits with the buyer, which surprises people. In practice the settlement agent handles the mechanics, but the liability for getting it wrong is the buyer's. That is why the question of the seller's status comes up early in a transaction rather than at the closing table.",
      "Rates depend on the sale price and the buyer's intended use of the property, and reduced rates or exemptions can apply — for example where the price falls below a threshold and the buyer will use the property as a residence. Sellers who expect their actual tax to be less than the withholding can apply to the IRS for a withholding certificate, though the application takes time and needs to start well before settlement.",
      "The determination that matters is tax residency, not citizenship or immigration status. A non-citizen who meets the substantial presence test may not be a foreign person for FIRPTA purposes; a citizen living abroad generally still is not. This is a question for the seller's tax advisor, and settlement agents rely on the seller's own certification rather than making the determination.",
    ],
    jurisdictions: [
      {
        state: "DC",
        note: "FIRPTA is federal and applies identically across the District, Maryland and Virginia. What differs regionally is frequency: the DC metro's international buyer and seller population — diplomatic, institutional and corporate — means FIRPTA questions arise here far more often than in most US markets, and experienced local settlement agents encounter them routinely.",
      },
    ],
    faqs: [
      {
        question: "Who is responsible for FIRPTA withholding?",
        answer:
          "The buyer carries the legal obligation, even though the settlement agent typically executes the withholding and remittance as part of closing. This is why a buyer's representation confirms the seller's status early rather than discovering the issue at the table.",
      },
      {
        question: "Does FIRPTA apply if the seller is a green card holder?",
        answer:
          "Generally no. A lawful permanent resident is typically not a foreign person for these purposes. Tax residency is the operative test rather than citizenship, and a seller's tax advisor should make that determination rather than the settlement agent.",
      },
      {
        question: "Can FIRPTA withholding be reduced?",
        answer:
          "Sometimes. Reduced rates and exemptions exist based on sale price and the buyer's intended use, and a seller may apply to the IRS for a withholding certificate when the expected tax is less than the standard withholding. Applications should begin well before the settlement date.",
      },
    ],
    related: ["title-insurance", "escrow"],
    seeAlso: [{ label: "Talk through a transaction", href: "/contact" }],
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
    related: ["title-insurance", "contingent"],
    seeAlso: [{ label: "How settlement works", href: "/why-choose-us" }],
  },

  {
    slug: "escrow",
    term: "Escrow",
    aliases: ["what is escrow", "escrow meaning", "escrow account"],
    shortAnswer:
      "Escrow is money or documents held by a neutral third party until the conditions of a transaction are met — in a home purchase, the deposit held between contract and settlement, and later the lender account that pays taxes and insurance.",
    body: [
      "The word covers two different things, which is most of why it confuses people. In a purchase, escrow is the deposit — the buyer's earnest money, held by a neutral party rather than by the seller, and released only according to the contract. After closing, escrow usually means the account the mortgage servicer maintains to collect and pay property taxes and homeowner's insurance.",
      "The purchase escrow exists to make the deposit meaningful without making it dangerous. The seller gets evidence the buyer is serious; the buyer gets assurance the money will not simply vanish if the deal ends legitimately. Neither side can unilaterally take the funds, and the holder is bound by the contract and by regulation.",
      "Where deposits actually get contentious is a dispute over who is entitled to them. If a buyer walks and both sides claim the deposit, the escrow holder does not decide — it cannot release the funds without agreement or a court order. Deposits have sat unresolved for a long time on that basis.",
      "The escrow holder is generally the settlement agent, title company, or brokerage, depending on the contract. Funds are held in a separate account, not mixed with operating money, and this segregation is a licensing requirement rather than a courtesy.",
    ],
    jurisdictions: [
      {
        state: "MD",
        note: "Maryland regulates trust and escrow accounts for title agents closely, including segregation and audit requirements — the practical reason a Maryland deposit sits in a dedicated account rather than a general one.",
      },
      {
        state: "VA",
        note: "Virginia's Consumer Real Estate Settlement Protection Act governs settlement agents and escrow handling, setting the standards a Virginia settlement agent must meet to hold funds.",
      },
      {
        state: "DC",
        note: "District settlement agents are licensed and subject to escrow handling requirements as well; the underlying principle across all three jurisdictions is the same, and only the regulator differs.",
      },
    ],
    faqs: [
      {
        question: "Who holds the earnest money deposit?",
        answer:
          "Whoever the contract names — commonly the settlement agent, the title company, or the listing brokerage. The holder must keep the funds in a segregated escrow account and can only disburse them according to the contract or on written agreement of the parties.",
      },
      {
        question: "What happens to the deposit if the deal falls through?",
        answer:
          "It depends on why. If a buyer terminates properly under a live contingency, the deposit is typically returned. If the parties disagree about who is entitled to it, the escrow holder cannot pick a side and the funds stay put until there is a written agreement or a court order.",
      },
      {
        question: "Is escrow the same as an escrow account on my mortgage?",
        answer:
          "No, though they share a name. The purchase escrow holds the deposit before closing. A mortgage escrow account is maintained afterward by the loan servicer to collect and pay property taxes and insurance along with the monthly payment.",
      },
    ],
    related: ["contingent", "title-insurance"],
    seeAlso: [{ label: "Estimate your closing costs", href: "/calculators" }],
  },

  {
    slug: "land-survey",
    term: "Land Survey",
    aliases: ["property survey", "types of surveys", "boundary survey", "what is a land survey"],
    shortAnswer:
      "A land survey establishes where a property's legal boundaries actually run, and what structures, easements, and encroachments sit on it — the questions a title search alone cannot answer.",
    body: [
      "A title search reads the record. A survey reads the ground. The two answer different questions, and a transaction can have a perfectly clean title and still have a fence three feet onto the neighbor's land.",
      "The lightest version is a location drawing or house-location survey, which shows the improvements relative to the boundaries and is often what a lender wants. A full boundary survey involves setting or verifying corner markers and produces a definitive line. An ALTA/NSPS survey is the detailed commercial standard, combining boundary work with title-related items and typically required for commercial financing.",
      "What surveys most often surface are encroachments and easements. A shed over the line, a driveway that serves the neighbor, a utility easement running through the back yard — these appear on a survey and can be invisible in the recorded record. Some are trivial. Some change what a buyer can build.",
      "Whether a survey is required varies by transaction and lender rather than by rule, and an owner's title policy may carry a survey exception unless a current survey is provided — meaning boundary problems can sit outside coverage precisely when nobody ordered the survey.",
    ],
    jurisdictions: [
      {
        state: "VA",
        note: "Northern Virginia lenders frequently ask for a house-location survey on purchase transactions, and long-established neighborhoods inside the Beltway are where old fence lines and boundary discrepancies most often turn up.",
      },
      {
        state: "MD",
        note: "Maryland purchases commonly involve a location drawing rather than a full boundary survey, with the survey exception on the title policy addressed accordingly.",
      },
      {
        state: "DC",
        note: "District lots are frequently defined by square and lot numbers within the DC surveyor's records, and rowhouse party walls make encroachment and easement questions a routine part of District transactions rather than an exception.",
      },
    ],
    faqs: [
      {
        question: "Do I need a survey to buy a house?",
        answer:
          "It depends on the lender and the transaction rather than on a universal rule. Many purchases proceed with a location drawing; some lenders require more. A current survey can also remove the survey exception from an owner's title policy, which is a separate reason to consider one.",
      },
      {
        question: "What is the difference between a boundary survey and a location drawing?",
        answer:
          "A location drawing shows where improvements sit relative to the boundaries and is generally lighter and less costly. A boundary survey verifies or sets the actual corner markers and produces a definitive line, which is what you want if the boundary itself is in question.",
      },
      {
        question: "What happens if a survey shows an encroachment?",
        answer:
          "It depends on what and whose. Options in practice range from an agreement between neighbors, to an easement, to relocating the improvement, to title coverage in some circumstances. Which of those applies is a question for counsel and your settlement agent together.",
      },
    ],
    related: ["title-insurance", "tenancy"],
    seeAlso: [{ label: "Order a title review", href: "/request-title-review" }],
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
