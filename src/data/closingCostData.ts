/**
 * City-specific closing cost data for localized calculator pages.
 *
 * Tax rates sourced from VA/MD/DC government schedules.
 * Maryland state, Montgomery County, and Prince George's County rates
 * verified as of June 2026.
 *
 * VA:
 *  - State recordation tax: $0.25/$100 (0.25%) — all localities, buyer
 *  - State grantor tax: $0.50/$500 (0.1%) — all localities, seller
 *  - § 58.1-814 local add-on: up to $0.0833/$100, buyer, only where the locality
 *    adopted an ordinance
 *  - Northern Virginia only: two grantor-paid regional fees at $0.10/$100 each
 *    (§ 58.1-802.3 WMATA capital, § 58.1-802.4 congestion relief) = $0.20/$100
 *
 * MD:
 *  - State transfer tax: 0.5% (split buyer/seller or negotiable)
 *  - State recordation tax: varies by consideration
 *  - County transfer tax varies: Montgomery=1%, PG=1.4%, etc.
 *
 * DC:
 *  - Recordation tax: 1.1% (≤$400K) or 1.45% (>$400K)
 *  - Transfer tax: 1.1% (≤$400K) or 1.45% (>$400K)
 */

import type { StateCode } from "./locations";

export interface CityClosingCostData {
  /** URL slug: "closing-costs-arlington-va" */
  slug: string;
  city: string;
  state: StateCode;
  county: string;
  /** Median home price for default calculator value */
  medianHomePrice: number;
  /** Typical down payment percentage (for default loan calc) */
  defaultDownPaymentPct: number;

  // ── Tax Overrides (used by calculator) ──
  /** Local/additional recordation or transfer tax rate (decimal) on top of state rates */
  localTransferTaxRate: number;
  /** County transfer tax rate (MD only, decimal) — 0 for VA/DC */
  countyTransferTaxRate: number;
  /**
   * Locality recordation add-on under § 58.1-814 (VA, decimal). Capped at one-third
   * of the state rate ($0.0833/$100) and only owed where the locality adopted an
   * ordinance — see `recordationCaveat`. 0 on every entry means "no ordinance on
   * record here", not "confirmed none".
   */
  localRecordationTaxRate: number;
  /**
   * Note about local taxes shown under the calculator. Optional: the statutory
   * position is rendered from `recordationCaveat` / `regionalFeeParagraph`, so this
   * field is only for something true of this locality and not of its neighbours.
   */
  localTaxNote?: string;

  // ── Page Content ──
  /** Intro paragraph for hero section */
  intro: string;
  /** Local tax explanation section */
  localTaxExplainer: string;
  /** FAQ entries */
  faqs: { question: string; answer: string }[];
  /** Average closing cost range text */
  costRangeText: string;
}

// ─── Virginia Cities ───────────────────────────────────────────────────────────

const VA_DEFAULTS = {
  state: "VA" as StateCode,
  defaultDownPaymentPct: 20,
  countyTransferTaxRate: 0,
  // VA state recordation: 0.25%, grantor: 0.1% — already in base calculator
};

const VA_FAQS = (city: string, county: string) => [
  {
    question: `How much are closing costs in ${city}, VA?`,
    answer: `Closing costs in ${city}, VA typically range from 2% to 5% of the purchase price for buyers and 1% to 3% for sellers. For a $500,000 home, expect $10,000–$25,000 in buyer closing costs. Exact amounts depend on loan type, title insurance choices, and ${county} recording fees.`,
  },
  {
    question: `Who pays closing costs in ${city}, Virginia?`,
    answer: `Both buyers and sellers pay closing costs in Virginia. Buyers typically cover title insurance, loan fees, recording fees, and prepaid items. Sellers pay the grantor tax, their settlement fee, and agent commissions. In ${city}, some costs are negotiable between parties.`,
  },
  {
    question: `What is the grantor tax in Virginia?`,
    answer: `The Virginia grantor tax is $0.50 per $500 of the sale price (effectively 0.1%). This is paid by the seller at closing. On a $500,000 home, the grantor tax is $500.`,
  },
  {
    question: `Does ${city} have additional local transfer taxes?`,
    answer:
      regionalTransportationFeeRate(county) > 0
        ? `No local transfer tax — Virginia gives localities no power to levy one. But a purchase in ${city} does carry two state-imposed Northern Virginia regional fees totalling $0.20 per $100, payable by the seller by default and not owed on a refinance. See the local tax section above for the statutes and a worked figure.`
        : `No. ${city} has no local transfer tax, and it sits outside the Northern Virginia regional fee districts, so the $0.20 per $100 that a seller owes in Arlington, Fairfax, Loudoun or Prince William does not apply here.`,
  },
];

const MD_FAQS = (city: string, county: string) => [
  {
    question: `How much are closing costs in ${city}, MD?`,
    answer: `Closing costs in ${city}, MD typically range from 3% to 6% of the purchase price for buyers and 2% to 4% for sellers. Maryland has higher transfer taxes than many states, with both state and ${county} transfer taxes applying.`,
  },
  {
    question: `What is the transfer tax in ${county}?`,
    answer: `${county} charges a county transfer tax on real estate transactions in addition to the Maryland state transfer tax of 0.5%. The combined state + county rate makes Maryland closing costs higher than Virginia in most cases.`,
  },
  {
    question: `Who pays transfer taxes in Maryland?`,
    answer: `In Maryland, transfer taxes are typically split between buyer and seller, though this is negotiable. The state transfer tax (0.5%) and ${county} transfer tax are both calculated on the sale price.`,
  },
  {
    question: `Does ${city} have a recordation tax?`,
    answer: `Yes. Maryland charges a state recordation tax based on the sale price. In ${county}, this applies to deeds, deeds of trust, and other recorded instruments. Contact Pruitt Title for exact calculations.`,
  },
];

const DC_FAQS = [
  {
    question: "How much are closing costs in Washington DC?",
    answer: "DC closing costs are among the highest in the DMV area, typically 3% to 6% for buyers and 2% to 4% for sellers. The combined recordation and transfer taxes can exceed 2.9% on properties over $400,000.",
  },
  {
    question: "What are DC's recordation and transfer taxes?",
    answer: "DC charges both a recordation tax and a transfer tax. For properties up to $400,000, each is 1.1%. For properties over $400,000, each increases to 1.45%. Combined, that's 2.2% to 2.9% of the sale price.",
  },
  {
    question: "Who pays DC transfer taxes?",
    answer: "In DC, recordation and transfer taxes are typically split between buyer and seller, though this is negotiable. First-time DC homebuyers may qualify for a reduced recordation tax rate.",
  },
  {
    question: "Are there any DC homebuyer tax breaks?",
    answer: "Yes. First-time DC homebuyers may qualify for a reduced recordation tax rate of 0.725% (instead of 1.1%–1.45%) on their primary residence, potentially saving thousands at closing.",
  },
];

/**
 * The nine Northern Virginia jurisdictions: the counties of Arlington, Fairfax,
 * Loudoun and Prince William, and the cities of Alexandria, Fairfax, Falls Church,
 * Manassas and Manassas Park.
 *
 * These are simultaneously the Northern Virginia Transportation Authority members
 * (Va. Code § 33.2-2501) and Planning District 8 (the Northern Virginia Regional
 * Commission), and TWO separate grantor-paid fees keyed to those two descriptions
 * both land on the same nine:
 *
 *   § 58.1-802.3  regional WMATA capital fee       $0.10/$100  (NVTA members)
 *   § 58.1-802.4  regional congestion relief fee   $0.10/$100  (Planning District 8)
 *
 * One list, because when this was recorded per city it drifted: Fairfax and Loudoun
 * carried a fee, Arlington, Alexandria and Prince William did not, and all nine owe
 * both.
 */
const NOVA_JURISDICTIONS = new Set([
  "Arlington County",
  "Fairfax County",
  "Loudoun County",
  "Prince William County",
  "City of Alexandria",
  "City of Fairfax",
  "City of Falls Church",
  "City of Manassas",
  "City of Manassas Park",
]);

/** § 58.1-802.3 — $0.10 per $100, i.e. 0.1%. Grantor-paid, conveyances only. */
export const WMATA_CAPITAL_FEE_RATE = 0.001;

/** § 58.1-802.4 — $0.10 per $100. Also grantor-paid, also conveyances only. */
export const CONGESTION_RELIEF_FEE_RATE = 0.001;

/**
 * Both regional fees together — what a Northern Virginia seller actually owes.
 *
 * An earlier version of this file counted only § 58.1-802.3 and so published half
 * the real figure. The two fees are separate statutes with separate account codes at
 * the clerk's office, but they are identical in rate, payer and scope, so nothing is
 * served by making a seller add them up themselves.
 */
export const REGIONAL_TRANSPORTATION_FEE_RATE =
  WMATA_CAPITAL_FEE_RATE + CONGESTION_RELIEF_FEE_RATE;

/** The seller-paid regional fee rate for a jurisdiction, 0 where it does not apply. */
export function regionalTransportationFeeRate(county: string): number {
  return NOVA_JURISDICTIONS.has(county) ? REGIONAL_TRANSPORTATION_FEE_RATE : 0;
}

/**
 * "Fairfax County" needs no article; "City of Alexandria" and "District of Columbia"
 * do, or generated sentences open "City of Alexandria is a Northern Virginia…".
 */
function withArticle(county: string): string {
  return /^(City|Town|District) of /.test(county) ? `the ${county}` : county;
}

/** Sentence-initial form of the above. */
function capitalized(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Both regional fees explained once, rather than pasted into each city's note and
 * explainer — which is how the same facts came to render twice in consecutive
 * paragraphs on every city-basis page.
 */
export function regionalFeeParagraph(county: string, medianHomePrice?: number): string | undefined {
  if (regionalTransportationFeeRate(county) === 0) return undefined;
  const usd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const example = medianHomePrice
    ? ` On a ${usd(medianHomePrice)} sale the two together come to ` +
      `${usd(Math.round(medianHomePrice * REGIONAL_TRANSPORTATION_FEE_RATE))}.`
    : "";
  return (
    `A sale in ${withArticle(county)} carries two separate regional fees, each $0.10 per $100: the ` +
    `regional WMATA capital fee under Va. Code § 58.1-802.3, which applies because this is a ` +
    `Northern Virginia Transportation Authority member, and the regional congestion relief fee ` +
    `under § 58.1-802.4, which applies because this is Planning District 8. Both statutes place ` +
    `the fee on the grantor, though in each case the parties may agree the buyer pays part of it, ` +
    `so the default is $0.20 per $100 of the sale price on the seller.${example} Purchase closings ` +
    `only: a refinance records a deed of trust rather than a conveyance, so neither fee nor the ` +
    `grantor tax applies to one.`
  );
}

/**
 * The Virginia recordation position, also said once.
 *
 * Every Virginia entry carries `localRecordationTaxRate: 0`, and that 0 needs the
 * same caveat attached wherever it is shown. The Office of the Executive Secretary
 * circuit court fee schedule lists the § 58.1-814 local tax as "⅓ State Grantee Tax
 * … (if ordinance adopted by locality)" — so it is grantee-paid and conditional on a
 * local ordinance, and which of these nine localities adopted one is not something
 * the published schedules resolve. Pasting this into each city's `localTaxExplainer`
 * is what made five of them near-identical strings.
 */
export function recordationCaveat(state: StateCode, county: string): string | undefined {
  if (state !== "VA") return undefined;
  return (
    `Recordation tax is Virginia's state rate of $0.25 per $100 under Va. Code § 58.1-801, paid ` +
    `by the buyer. Under § 58.1-814 a locality that adopts an ordinance may add one-third of ` +
    `that ($0.0833 per $100), also charged to the buyer — so no Virginia locality levies $0.10 ` +
    `as recordation tax. Whether ${withArticle(county)} has adopted that ordinance is not ` +
    `reflected in these figures; confirm with the Circuit Court Clerk before relying on a ` +
    `recordation number.`
  );
}

/**
 * Md. Tax-Property § 13-203: 0.5% state transfer tax, reduced to 0.25% for a
 * qualifying first-time Maryland homebuyer, whose share the seller picks up.
 * Exported so the calculator and this prose cannot drift apart.
 */
export const MD_STATE_TRANSFER_TAX_RATE = 0.005;
export const MD_FIRST_TIME_TRANSFER_TAX_RATE = 0.0025;

/**
 * The Maryland county transfer tax, derived from `countyTransferTaxRate` rather than
 * written out per city. Four of the five Maryland entries did the same arithmetic in
 * prose — two of them in byte-identical notes — and every one of them restated it in
 * the explainer directly above.
 */
export function countyTransferTaxParagraph(
  state: StateCode,
  county: string,
  countyTransferTaxRate: number,
  medianHomePrice?: number
): string | undefined {
  if (state !== "MD" || countyTransferTaxRate <= 0) return undefined;
  const pct = (rate: number) => `${Number((rate * 100).toFixed(3))}%`;
  const combined = countyTransferTaxRate + MD_STATE_TRANSFER_TAX_RATE;
  const example = medianHomePrice
    ? ` On a ${medianHomePrice.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} sale that is ${Math.round(medianHomePrice * combined).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} of transfer tax before anything else.`
    : "";
  return (
    `${capitalized(withArticle(county))} levies a county transfer tax of ${pct(countyTransferTaxRate)} on top of Maryland's ` +
    `${pct(MD_STATE_TRANSFER_TAX_RATE)} state transfer tax — ${pct(combined)} combined.${example} ` +
    `Absent an agreement otherwise the county transfer tax is shared evenly between buyer and ` +
    `seller. A qualifying first-time Maryland homebuyer gets a reduced state rate of ` +
    `${pct(MD_FIRST_TIME_TRANSFER_TAX_RATE)}, which the seller then pays in full.`
  );
}

export const CITY_CALCULATOR_DATA: CityClosingCostData[] = [
  // ── Virginia Tier 1 ──
  {
    slug: "closing-costs-arlington-va",
    city: "Arlington",
    county: "Arlington County",
    medianHomePrice: 715000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "Arlington County levies no transfer tax of its own — Virginia gives localities no such power — and deeds record with the Arlington Circuit Court Clerk.",
    intro: "Estimate your closing costs for buying or selling a home in Arlington, VA. Arlington County is one of the most active real estate markets in the DMV, with a median home price around $715,000. Use our free calculator to get a detailed breakdown of buyer and seller costs.",
    localTaxExplainer: "Arlington's property values are what make its closing costs distinctive — the percentages are the same as anywhere in Virginia, but at a median near $715,000 title insurance and recordation together routinely clear $5,000 on a single transaction. The county's condo and mid-rise inventory adds a second variable: an association resale packet and its transfer fee, set by the association rather than by the county.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Arlington", "Arlington County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-alexandria-va",
    city: "Alexandria",
    county: "City of Alexandria",
    medianHomePrice: 625000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "Alexandria is an independent city, so it records through its own circuit court clerk rather than a county's. Virginia gives no locality the power to levy a transfer tax, so nothing of that kind is added here.",
    intro: "Calculate closing costs for real estate transactions in Alexandria, VA. As an independent city, Alexandria has its own recording office but follows Virginia's standard tax schedule. Median home prices hover around $625,000.",
    localTaxExplainer: "What varies most in Alexandria is property type, not the tax schedule. The city's stock runs from Old Town rowhouses to Eisenhower Valley high-rises, and the paperwork differs sharply between them: a condo purchase brings a resale packet and an association transfer fee, an older Old Town parcel brings a longer chain of title and sometimes a historic-district covenant recorded against it. Both add cost and days that no percentage table shows.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Alexandria", "City of Alexandria"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-fairfax-va",
    city: "Fairfax",
    county: "Fairfax County",
    medianHomePrice: 650000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    localTaxNote:
      "Fairfax County adds no transfer tax of its own, and deeds for the towns inside it — Vienna, Herndon, Clifton — record with the Fairfax Circuit Court Clerk rather than with the town.",
    intro: "Estimate closing costs for homes in Fairfax, VA. Fairfax County is the largest jurisdiction in Northern Virginia and its median home price is around $650,000. The tax schedule is Virginia's standard one — no county transfer tax on top.",
    localTaxExplainer: "Fairfax County is the largest recording jurisdiction in Northern Virginia, but that volume shows up in turnaround time rather than in the tax schedule: the rates are Virginia's standard ones. On a $650,000 Fairfax sale, the buyer's state recordation tax runs about $1,625 and the seller's grantor tax about $650, before title insurance, settlement fees and the clerk's per-page recording charges.",
    costRangeText: "2.5% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Fairfax", "Fairfax County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-mclean-va",
    city: "McLean",
    county: "Fairfax County",
    medianHomePrice: 1200000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    intro: "Calculate closing costs for McLean, VA real estate. McLean is one of the most affluent communities in the DMV with a median home price exceeding $1.2 million. Higher purchase prices mean closing costs require careful planning.",
    localTaxExplainer: "McLean's median sits above $1.2 million, which is the point where percentage-based line items stop being background noise: state recordation tax alone is roughly $3,000 for the buyer and grantor tax roughly $1,200 for the seller on a median-priced sale. At that size, get the split of every seller-side charge written into the contract rather than settled at the table.",
    costRangeText: "2% to 4.5% for buyers, 1% to 2.5% for sellers",
    faqs: VA_FAQS("McLean", "Fairfax County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-vienna-va",
    city: "Vienna",
    county: "Fairfax County",
    medianHomePrice: 850000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    localTaxNote: "Vienna is an incorporated town, so the town government appears on your tax bill — but not in your closing costs. It levies no transfer or recordation tax, and deeds record with Fairfax County.",
    intro: "Estimate closing costs for buying or selling a home in Vienna, VA. Located in Fairfax County, Vienna is a popular community with excellent schools and a walkable downtown. Median home prices are approximately $850,000.",
    localTaxExplainer: "What shapes a Vienna closing is the housing stock rather than the tax schedule. The market here is largely detached homes on established lots, which means fewer association documents to chase than in a Reston condo or a new Ashburn community — and usually a shorter path from contract to a clear title commitment. Where an older Vienna parcel does slow things down, it is normally an easement or an unreleased lien in the chain, not a fee.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Vienna", "Fairfax County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-reston-va",
    city: "Reston",
    county: "Fairfax County",
    medianHomePrice: 560000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    intro: "Calculate closing costs for Reston, VA real estate transactions. Reston's mix of condos, townhomes, and single-family homes creates a wide range of closing cost scenarios. Median prices are around $560,000.",
    localTaxExplainer: "Reston is unincorporated Fairfax County, and its condo and townhome inventory shapes closing costs here more than the tax rates do. A condo or association sale adds a resale packet from the association and, in most cases, a transfer or document fee the association sets — not a government charge, not capped by statute, and easy to miss when you budget from a tax table. Ask for the association's fee schedule early rather than at the settlement table.",
    costRangeText: "2.5% to 5.5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Reston", "Fairfax County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-ashburn-va",
    city: "Ashburn",
    county: "Loudoun County",
    medianHomePrice: 700000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    intro: "Estimate closing costs in Ashburn, VA. As one of the fastest-growing communities in Loudoun County, Ashburn's real estate market is competitive with median home prices around $700,000.",
    localTaxExplainer: "Ashburn is unincorporated Loudoun County, and a large share of its inventory is newer construction. Two things follow. A builder may steer the first sale toward an affiliated title company — you are free to use your own, and federal law (RESPA, 12 U.S.C. § 2608) bars a seller from making the buyer's choice of title insurer a condition of the sale. And in newer communities the HOA transfer and capital-contribution fees can exceed the state recordation tax on the same purchase, so they belong in your estimate from the start.",
    costRangeText: "2.5% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Ashburn", "Loudoun County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-leesburg-va",
    city: "Leesburg",
    county: "Loudoun County",
    medianHomePrice: 620000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0, // was $0.10 — that is a § 58.1-802.3 / 58.1-802.4 regional fee, not recordation.
    // 0 here means "no local add-on recorded", NOT "verified as none": § 58.1-814
    // permits up to $0.0833 and the locality fee schedules were not reachable.
    localTaxNote: "Leesburg is an incorporated town and the Loudoun County seat, so the Circuit Court Clerk that records your deed is in town. The town itself levies no transfer or recordation tax.",
    intro: "Calculate closing costs for Leesburg, VA properties. The county seat of Loudoun County, Leesburg combines historic charm with suburban growth. Median home prices are approximately $620,000.",
    localTaxExplainer: "Leesburg's tax schedule is Virginia's standard one; where a Leesburg closing differs is the title work behind it. The historic district and the older parcels around it carry a longer chain of title than a new Loudoun subdivision does, and a longer chain is where an unreleased deed of trust, an old easement, or a boundary described by metes and bounds rather than a recorded plat tends to surface. That is a search-and-clear question, not a tax one — but it is the part of a Leesburg closing most likely to need extra days.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Leesburg", "Loudoun County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-woodbridge-va",
    city: "Woodbridge",
    county: "Prince William County",
    medianHomePrice: 450000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "Prince William County levies no transfer tax of its own, and deeds record with the Circuit Court Clerk at the county's judicial center in Manassas.",
    intro: "Estimate closing costs for Woodbridge, VA real estate. Prince William County offers more affordable entry points into the Northern Virginia market with median home prices around $450,000.",
    localTaxExplainer: "Woodbridge is where the Northern Virginia market gets reachable, and that changes which closing costs matter. At a median near $450,000 the percentage-based taxes are a smaller number than in Fairfax or Loudoun, so fixed charges — lender fees, the survey, the settlement fee — make up more of the total than they would further north. It also means down-payment assistance and first-time buyer programs are more often in play, and those carry their own recording requirements.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Woodbridge", "Prince William County"),
    ...VA_DEFAULTS,
  },
  {
    slug: "closing-costs-fredericksburg-va",
    city: "Fredericksburg",
    county: "City of Fredericksburg",
    medianHomePrice: 380000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "Deeds here go to the Fredericksburg Circuit Court Clerk, not to Spotsylvania or Stafford County — the city is independent of both, and levies no transfer tax of its own.",
    intro: "Calculate closing costs for Fredericksburg, VA properties. As an independent city between Northern Virginia and Richmond, Fredericksburg offers competitive pricing with a median around $380,000.",
    localTaxExplainer: "Fredericksburg is the one market in our coverage area outside Northern Virginia's two regional transfer fees, and for a seller that is worth real money: the $0.20 per $100 that a Prince William or Fairfax seller owes under §§ 58.1-802.3 and 58.1-802.4 does not apply here at all — about $760 kept on a $380,000 sale. Combined with prices well under the NoVA median, the same percentage rates land on a much smaller base.",
    costRangeText: "2% to 5% for buyers, 1% to 3% for sellers",
    faqs: VA_FAQS("Fredericksburg", "City of Fredericksburg"),
    ...VA_DEFAULTS,
  },

  // ── Maryland Cities ──────────────────────────────────────────────────────────
  {
    slug: "closing-costs-bethesda-md",
    city: "Bethesda",
    state: "MD",
    county: "Montgomery County",
    medianHomePrice: 950000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0.01, // Montgomery County = 1%
    localRecordationTaxRate: 0,
    localTaxNote: "Bethesda is unincorporated Montgomery County, so no municipal transfer tax sits on top of the county's, and deeds record with the county in Rockville.",
    intro: "Estimate closing costs for Bethesda, MD real estate. Montgomery County's transfer taxes are among the highest in the DMV region. With median home prices around $950,000, precise closing cost calculations are essential.",
    localTaxExplainer: "Bethesda's median is near $950,000, which is what makes percentage-based charges bite harder here than anywhere else in the Maryland DMV — the same rate that costs a Gaithersburg buyer a few thousand dollars costs a Bethesda buyer several times that. Maryland also levies a state recordation tax on the sale price, and Maryland title insurance premiums come from rate schedules each underwriter files with the Maryland Insurance Administration, so the premium is set by the filed rate rather than negotiated at the table.",
    costRangeText: "3% to 6% for buyers, 2% to 4% for sellers",
    faqs: MD_FAQS("Bethesda", "Montgomery County"),
  },
  {
    slug: "closing-costs-rockville-md",
    city: "Rockville",
    state: "MD",
    county: "Montgomery County",
    medianHomePrice: 600000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0.01,
    localRecordationTaxRate: 0,
    localTaxNote: "Rockville is both an incorporated city and the Montgomery County seat, so the Circuit Court that records your deed is in town. The city levies no transfer tax of its own.",
    intro: "Calculate closing costs for Rockville, MD transactions. As the county seat of Montgomery County, Rockville has a diverse housing market with a median price around $600,000.",
    localTaxExplainer: "Rockville mixes established neighborhoods with new development, and new construction is where a Rockville settlement statement diverges from a resale one: a builder's first sale can carry warranty enrollment and HOA setup charges that a resale has no equivalent for, and they are itemised separately from the taxes. Ask for a builder's estimated settlement sheet early — the charges are the builder's to disclose, not the county's.",
    costRangeText: "3% to 6% for buyers, 2% to 4% for sellers",
    faqs: MD_FAQS("Rockville", "Montgomery County"),
  },
  {
    slug: "closing-costs-silver-spring-md",
    city: "Silver Spring",
    state: "MD",
    county: "Montgomery County",
    medianHomePrice: 525000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0.01,
    localRecordationTaxRate: 0,
    localTaxNote: "Silver Spring is unincorporated Montgomery County — there is no city government that could add a transfer tax, and deeds record with the county in Rockville.",
    intro: "Estimate closing costs for Silver Spring, MD homes. Located in Montgomery County just north of DC, Silver Spring offers urban living with a median home price around $525,000.",
    localTaxExplainer: "Silver Spring's draw is proximity — Metro access and a short trip into the District — which means most buyers here are also weighing Arlington or Alexandria. The difference between those options shows up at closing rather than in the list price: Virginia has no county transfer tax equivalent to Maryland's, so a Virginia purchase at the same price carries materially less transfer tax. Run both through a calculator before assuming the cheaper sticker price is the cheaper purchase.",
    costRangeText: "3% to 6% for buyers, 2% to 4% for sellers",
    faqs: MD_FAQS("Silver Spring", "Montgomery County"),
  },
  {
    slug: "closing-costs-bowie-md",
    city: "Bowie",
    state: "MD",
    county: "Prince George's County",
    medianHomePrice: 450000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0.014, // PG County = 1.4%
    localRecordationTaxRate: 0,
    localTaxNote: "Bowie is an incorporated city and adds no transfer tax of its own; deeds record with the Prince George's Circuit Court Clerk in Upper Marlboro.",
    intro: "Calculate closing costs for Bowie, MD properties. Prince George's County has the highest county transfer tax rate in the Maryland DMV at 1.4%. Median home prices in Bowie are around $450,000.",
    localTaxExplainer: "Prince George's County carries the highest county transfer tax rate in the Maryland DMV suburbs, but the rate is only half the arithmetic. Bowie's median is well under Montgomery County's, and the smaller base outweighs the higher rate: a median-priced Bowie purchase usually lands below a median-priced Rockville or Bethesda one in total dollars. Compare the dollar figures for your actual price rather than the headline percentages.",
    costRangeText: "3% to 6.5% for buyers, 2% to 4.5% for sellers",
    faqs: MD_FAQS("Bowie", "Prince George's County"),
  },
  {
    slug: "closing-costs-gaithersburg-md",
    city: "Gaithersburg",
    state: "MD",
    county: "Montgomery County",
    medianHomePrice: 525000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0.01,
    localRecordationTaxRate: 0,
    localTaxNote: "Gaithersburg is an incorporated city but levies no transfer tax of its own; deeds record with Montgomery County in Rockville.",
    intro: "Estimate closing costs for Gaithersburg, MD real estate. Part of Montgomery County, Gaithersburg has a growing housing market with median prices around $525,000.",
    localTaxExplainer: "Gaithersburg's housing stock runs from entry-level condos to executive homes, so the percentages stay flat while the dollar totals move a long way across the market. A condo purchase here adds an association resale packet and, in most cases, a transfer or document fee the association sets — a private charge, not a government one, and not capped by any statute. Get the association's fee schedule with the resale packet rather than discovering it on the settlement statement.",
    costRangeText: "3% to 6% for buyers, 2% to 4% for sellers",
    faqs: MD_FAQS("Gaithersburg", "Montgomery County"),
  },

  // ── Washington DC ────────────────────────────────────────────────────────────
  {
    slug: "closing-costs-washington-dc",
    city: "Washington",
    state: "DC",
    county: "District of Columbia",
    medianHomePrice: 650000,
    defaultDownPaymentPct: 20,
    localTransferTaxRate: 0,
    countyTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "The District has no separate county layer — recordation and transfer taxes are both levied at the district level, and deeds record with the DC Recorder of Deeds.",
    intro: "Calculate closing costs for Washington DC real estate. DC has some of the highest transfer taxes in the region — combined recordation and transfer taxes can reach 2.9% on properties over $400,000. Median home prices are approximately $650,000.",
    localTaxExplainer: "Washington DC charges both a recordation tax and a transfer tax on all real estate transactions. For properties up to $400,000, each tax is 1.1% (2.2% combined). For properties above $400,000, each increases to 1.45% (2.9% combined). These taxes are typically split between buyer and seller. First-time DC homebuyers may qualify for a reduced recordation tax rate of 0.725%, which can save $4,000+ on a $650,000 home. Because the rate steps at $400,000 rather than sliding, a contract written just over that line costs meaningfully more than one written just under it.",
    costRangeText: "3% to 6% for buyers, 2% to 4% for sellers",
    faqs: DC_FAQS,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Find city data by slug */
export function getCityCalcData(slug: string): CityClosingCostData | undefined {
  return CITY_CALCULATOR_DATA.find((c) => c.slug === slug);
}

/** All city calculator slugs (for generateStaticParams) */
export function getAllCityCalcSlugs(): string[] {
  return CITY_CALCULATOR_DATA.map((c) => c.slug.replace("closing-costs-", ""));
}

/** Get the state calculator slug for a city */
export function getStateCalcSlug(state: StateCode): string {
  const map: Record<StateCode, string> = {
    VA: "virginia-closing-cost-calculator",
    MD: "maryland-closing-cost-calculator",
    DC: "dc-closing-cost-calculator",
  };
  return map[state];
}

/** Get the state full name */
export function getStateFullName(state: StateCode): string {
  const map: Record<StateCode, string> = {
    VA: "Virginia",
    MD: "Maryland",
    DC: "Washington DC",
  };
  return map[state];
}

/** Get the location page slug for cross-linking */
export function getLocationSlug(city: string, state: StateCode): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "");
  const stateSlug = state.toLowerCase();
  return `title-company-${citySlug}-${stateSlug}`;
}
