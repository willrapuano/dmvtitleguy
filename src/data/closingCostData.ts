/**
 * City-specific closing cost data for localized calculator pages.
 *
 * Tax rates sourced from VA/MD/DC government schedules (2024–2025).
 * These are estimates — actual rates may change. Always verify with
 * the locality before quoting clients.
 *
 * VA:
 *  - State recordation tax: $0.25/$100 (0.25%) — all localities
 *  - State grantor tax: $0.50/$500 (0.1%) — all localities
 *  - Some localities add a local recordation/transfer tax on top
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
  /** Additional locality recordation tax (VA, decimal) — some cities add $0.15/$100 */
  localRecordationTaxRate: number;
  /** Note about local taxes shown under calculator */
  localTaxNote: string;

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
    answer: `${county} may have additional local recordation taxes on top of Virginia's state rate. Contact Pruitt Title LLC for the exact rates applicable to your transaction in ${city}.`,
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
    question: "How much are closing costs in Washington, DC?",
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

export const CITY_CALCULATOR_DATA: CityClosingCostData[] = [
  // ── Virginia Tier 1 ──
  {
    slug: "closing-costs-arlington-va",
    city: "Arlington",
    county: "Arlington County",
    medianHomePrice: 715000,
    localTransferTaxRate: 0,
    localRecordationTaxRate: 0,
    localTaxNote: "Arlington County does not levy additional local transfer taxes beyond Virginia's state grantor tax (0.1%) and recordation tax (0.25%).",
    intro: "Estimate your closing costs for buying or selling a home in Arlington, VA. Arlington County is one of the most active real estate markets in the DMV, with a median home price around $715,000. Use our free calculator to get a detailed breakdown of buyer and seller costs.",
    localTaxExplainer: "Arlington County follows standard Virginia tax rates with no additional local transfer taxes. The primary costs are the state recordation tax ($0.25 per $100) paid by buyers and the grantor tax ($0.50 per $500) paid by sellers. Arlington's high property values mean these percentages translate to significant dollar amounts — title insurance and recordation fees alone can exceed $5,000 on a typical transaction.",
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
    localTaxNote: "Alexandria (independent city) does not add local transfer taxes beyond Virginia's state rates. Standard grantor tax (0.1%) and recordation tax (0.25%) apply.",
    intro: "Calculate closing costs for real estate transactions in Alexandria, VA. As an independent city, Alexandria has its own recording office but follows Virginia's standard tax schedule. Median home prices hover around $625,000.",
    localTaxExplainer: "Alexandria is an independent city in Virginia, meaning it operates its own circuit court clerk's office for recording. However, the tax rates mirror the state standard: recordation tax at $0.25 per $100 for buyers and grantor tax at $0.50 per $500 for sellers. Alexandria's mix of condos, townhomes, and single-family homes means closing costs can vary widely based on property type and HOA transfer fees.",
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
    localRecordationTaxRate: 0.001, // Fairfax County adds $0.10/$100
    localTaxNote: "Fairfax County adds a local recordation tax of $0.10 per $100 (0.1%) on top of Virginia's state recordation tax. This applies to deeds and deeds of trust.",
    intro: "Estimate closing costs for homes in Fairfax, VA. Fairfax County is the largest jurisdiction in Northern Virginia and adds a local recordation tax on top of Virginia's state rates. Median home prices are around $650,000.",
    localTaxExplainer: "Fairfax County levies an additional local recordation tax of $0.10 per $100 of consideration, bringing the combined recordation tax to $0.35 per $100 (0.35%). This applies to both the deed and the deed of trust. On a $650,000 purchase, that's an extra $650 in recordation taxes compared to jurisdictions without a local add-on. The seller still pays the standard Virginia grantor tax of $0.50 per $500.",
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
    localRecordationTaxRate: 0.001,
    localTaxNote: "McLean is in Fairfax County, which adds a local recordation tax of $0.10 per $100 on top of state rates.",
    intro: "Calculate closing costs for McLean, VA real estate. McLean is one of the most affluent communities in the DMV with a median home price exceeding $1.2 million. Higher purchase prices mean closing costs require careful planning.",
    localTaxExplainer: "McLean falls within Fairfax County, which charges an additional recordation tax of $0.10 per $100 beyond the state rate. With McLean's premium home values — many transactions exceed $1 million — this local tax adds meaningful cost. On a $1.2M home, Fairfax County's local recordation tax alone adds $1,200. Title insurance premiums also scale with property value, making a precise closing cost estimate essential for McLean buyers and sellers.",
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
    localRecordationTaxRate: 0.001,
    localTaxNote: "Vienna is in Fairfax County, which adds a local recordation tax of $0.10 per $100 on top of state rates.",
    intro: "Estimate closing costs for buying or selling a home in Vienna, VA. Located in Fairfax County, Vienna is a popular community with excellent schools and a walkable downtown. Median home prices are approximately $850,000.",
    localTaxExplainer: "Vienna is within Fairfax County's jurisdiction, so the local recordation tax of $0.10 per $100 applies in addition to Virginia's state rate. The Town of Vienna itself does not levy separate real estate transfer taxes. Pruitt Title LLC is headquartered at 1900 Gallows Rd Suite 230 in Vienna — we handle closings here every day and know the local process inside and out.",
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
    localRecordationTaxRate: 0.001,
    localTaxNote: "Reston is in Fairfax County, which adds a local recordation tax of $0.10 per $100 on top of state rates.",
    intro: "Calculate closing costs for Reston, VA real estate transactions. Reston's mix of condos, townhomes, and single-family homes creates a wide range of closing cost scenarios. Median prices are around $560,000.",
    localTaxExplainer: "Reston falls within Fairfax County, so the additional local recordation tax of $0.10 per $100 applies. An important note for Reston buyers: many Reston properties are within the Reston Association, which charges HOA transfer fees (typically $200–$500) that appear on your closing statement as an additional cost. These are separate from government taxes but still impact your bottom line.",
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
    localRecordationTaxRate: 0.001, // Loudoun County adds $0.10/$100
    localTaxNote: "Ashburn is in Loudoun County, which adds a local recordation tax of $0.10 per $100 on top of Virginia's state rate.",
    intro: "Estimate closing costs in Ashburn, VA. As one of the fastest-growing communities in Loudoun County, Ashburn's real estate market is competitive with median home prices around $700,000.",
    localTaxExplainer: "Ashburn is located in Loudoun County, which levies an additional local recordation tax of $0.10 per $100. Combined with Virginia's state recordation tax, the total rate is $0.35 per $100. Loudoun County's rapid growth means new construction transactions are common — these can have different closing cost profiles (no existing title to search, builder concessions, etc.).",
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
    localRecordationTaxRate: 0.001,
    localTaxNote: "Leesburg is in Loudoun County, which adds a local recordation tax of $0.10 per $100 on top of state rates.",
    intro: "Calculate closing costs for Leesburg, VA properties. The county seat of Loudoun County, Leesburg combines historic charm with suburban growth. Median home prices are approximately $620,000.",
    localTaxExplainer: "Leesburg falls under Loudoun County's tax jurisdiction, adding a local recordation tax of $0.10 per $100 on top of Virginia's state rate. The Town of Leesburg does not impose additional transfer taxes. Leesburg's historic district may have properties with complex title histories requiring extended title searches — factor in potential additional title examination fees.",
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
    localTaxNote: "Woodbridge is in Prince William County, which does not currently levy additional local recordation or transfer taxes beyond Virginia's state rates.",
    intro: "Estimate closing costs for Woodbridge, VA real estate. Prince William County offers more affordable entry points into the Northern Virginia market with median home prices around $450,000.",
    localTaxExplainer: "Woodbridge is in Prince William County, which follows Virginia's standard tax schedule without additional local transfer or recordation taxes. This makes Prince William County slightly less expensive at closing compared to Fairfax or Loudoun counties. Standard Virginia rates apply: recordation tax at $0.25 per $100 (buyer) and grantor tax at $0.50 per $500 (seller).",
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
    localTaxNote: "Fredericksburg (independent city) follows standard Virginia tax rates with no additional local transfer taxes.",
    intro: "Calculate closing costs for Fredericksburg, VA properties. As an independent city between Northern Virginia and Richmond, Fredericksburg offers competitive pricing with a median around $380,000.",
    localTaxExplainer: "Fredericksburg is an independent city in Virginia and does not add local transfer or recordation taxes beyond the state rates. With more affordable home prices compared to NoVA, closing costs in dollar terms are typically lower — though the percentages remain the same. Virginia's standard recordation tax (0.25%) and grantor tax (0.1%) apply.",
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
    localTaxNote: "Montgomery County charges a 1% county transfer tax on top of Maryland's 0.5% state transfer tax, for a combined transfer tax of 1.5%.",
    intro: "Estimate closing costs for Bethesda, MD real estate. Montgomery County's transfer taxes are among the highest in the DMV region. With median home prices around $950,000, precise closing cost calculations are essential.",
    localTaxExplainer: "Bethesda is in Montgomery County, which levies a 1% county transfer tax on all real estate transactions. Combined with Maryland's 0.5% state transfer tax, the total transfer tax rate is 1.5% of the sale price. On a $950,000 home, that's $14,250 in transfer taxes alone — typically split between buyer and seller. Maryland also charges a state recordation tax based on the sale price. Title insurance rates in Maryland are filed with the state insurance administration.",
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
    localTaxNote: "Montgomery County charges a 1% county transfer tax on top of Maryland's 0.5% state transfer tax.",
    intro: "Calculate closing costs for Rockville, MD transactions. As the county seat of Montgomery County, Rockville has a diverse housing market with a median price around $600,000.",
    localTaxExplainer: "Rockville is the county seat of Montgomery County, which charges a 1% county transfer tax. Combined with Maryland's state transfer tax (0.5%), the total transfer tax burden is 1.5%. Rockville has a mix of older homes and new developments — new construction may have different closing cost structures due to builder warranties and transfer tax exemptions on first sales. The City of Rockville does not impose additional municipal transfer taxes.",
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
    localTaxNote: "Silver Spring is in Montgomery County, which charges a 1% county transfer tax on top of Maryland's 0.5% state transfer tax.",
    intro: "Estimate closing costs for Silver Spring, MD homes. Located in Montgomery County just north of DC, Silver Spring offers urban living with a median home price around $525,000.",
    localTaxExplainer: "Silver Spring is within Montgomery County's jurisdiction, subject to the county's 1% transfer tax plus Maryland's 0.5% state transfer tax (1.5% total). Silver Spring's proximity to DC and Metro access makes it a popular alternative — but Maryland's higher transfer taxes mean closing costs are generally more than comparable Virginia jurisdictions. Budget accordingly, especially as a first-time buyer.",
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
    localTaxNote: "Prince George's County charges a 1.4% county transfer tax — the highest county rate in the Maryland DMV — on top of the 0.5% state transfer tax.",
    intro: "Calculate closing costs for Bowie, MD properties. Prince George's County has the highest county transfer tax rate in the Maryland DMV at 1.4%. Median home prices in Bowie are approximately $450,000.",
    localTaxExplainer: "Bowie is in Prince George's County, which levies a 1.4% county transfer tax — the highest in the Maryland DMV suburbs. Combined with Maryland's 0.5% state transfer tax, the total is 1.9%. On a $450,000 home, that's $8,550 in transfer taxes. Despite the higher tax rate, Bowie's more affordable home prices often result in lower absolute closing costs compared to Montgomery County communities.",
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
    localTaxNote: "Montgomery County charges a 1% county transfer tax on top of Maryland's 0.5% state transfer tax.",
    intro: "Estimate closing costs for Gaithersburg, MD real estate. Part of Montgomery County, Gaithersburg has a growing housing market with median prices around $525,000.",
    localTaxExplainer: "Gaithersburg falls under Montgomery County's 1% county transfer tax plus Maryland's 0.5% state rate (1.5% combined). The City of Gaithersburg does not add municipal transfer taxes. Gaithersburg's diverse housing stock — from entry-level condos to executive homes — means closing cost percentages stay similar but dollar amounts vary significantly.",
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
    localTaxNote: "DC charges both a recordation tax and a transfer tax. Properties ≤$400K: 1.1% each (2.2% combined). Properties >$400K: 1.45% each (2.9% combined).",
    intro: "Calculate closing costs for Washington, DC real estate. DC has some of the highest transfer taxes in the region — combined recordation and transfer taxes can reach 2.9% on properties over $400,000. Median home prices are approximately $650,000.",
    localTaxExplainer: "Washington, DC charges both a recordation tax and a transfer tax on all real estate transactions. For properties up to $400,000, each tax is 1.1% (2.2% combined). For properties above $400,000, each increases to 1.45% (2.9% combined). These taxes are typically split between buyer and seller. First-time DC homebuyers may qualify for a reduced recordation tax rate of 0.725%, which can save $4,000+ on a $650,000 home. DC does not have a separate county government — all taxes are at the district level.",
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
