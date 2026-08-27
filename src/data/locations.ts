export type Tier = 1 | 2;
export type StateCode = "VA" | "MD" | "DC";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Location {
  city: string;
  slug: string;
  state: StateCode;
  county: string;
  tier: Tier;
  /** Parent market page for neighborhood/sub-area pages */
  parentSlug?: string;
  /** Tier 3 communities to mention as "also serving" */
  alsoServing?: string[];
  /** FAQ content for SEO keyword expansion (Phase 4) */
  faqs?: FaqItem[];
}

export interface County {
  name: string;
  slug: string;
  state: StateCode;
  fullName: string;
}

// ─── Tier 1 — Primary Markets ─────────────────────────────────────────────────
export const TIER1_LOCATIONS: Location[] = [
  { city: "Washington DC",    slug: "title-company-washington-dc",    state: "DC", county: "—",                              tier: 1 },
  { city: "Arlington",        slug: "title-company-arlington-va",     state: "VA", county: "Arlington County",               tier: 1 },
  { city: "Alexandria",       slug: "title-company-alexandria-va",    state: "VA", county: "Alexandria (independent city)",  tier: 1 },
  { city: "Fairfax",          slug: "title-search-fairfax-va",       state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "McLean",           slug: "title-company-mclean-va",        state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "Vienna",           slug: "title-search-vienna-va",        state: "VA", county: "Fairfax County",                 tier: 1, alsoServing: ["Oakton"], faqs: [
      { question: "What does a title company do in Vienna, VA?", answer: "A title company in Vienna performs the title search, issues title insurance, manages escrow funds, and conducts the closing settlement — ensuring the property transfers cleanly from seller to buyer." },
      { question: "How long does the closing process take in Northern Virginia?", answer: "Most closings in Northern Virginia take 30–45 days from contract to settlement. The timeline depends on your lender's underwriting speed, any title issues discovered during the search, and the closing date set in your purchase contract." },
      { question: "Do I need owner's title insurance in Virginia?", answer: "Owner's title insurance is optional but strongly recommended. It protects you against hidden title defects, forged documents, unpaid liens, and errors in public records — for a one-time premium paid at closing." },
    ] },
  { city: "Reston",           slug: "title-company-reston-va",        state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "Ashburn",          slug: "title-company-ashburn-va",       state: "VA", county: "Loudoun County",                 tier: 1 },
  { city: "Leesburg",         slug: "title-company-leesburg-va",      state: "VA", county: "Loudoun County",                 tier: 1 },
  { city: "Woodbridge",       slug: "title-company-woodbridge-va",    state: "VA", county: "Prince William County",          tier: 1, alsoServing: ["Dale City", "Lake Ridge", "Dumfries", "Occoquan"] },
  { city: "Fredericksburg",   slug: "title-company-fredericksburg-va",state: "VA", county: "Fredericksburg (independent city)", tier: 1 },
  { city: "Bethesda",         slug: "title-company-bethesda-md",      state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Chevy Chase"], faqs: [
      { question: "How does a title search work in Maryland?", answer: "In Maryland, a title company examines public records going back at least 50 years to verify clear ownership, identify any liens or encumbrances, and ensure no outstanding claims on the property before issuing title insurance." },
      { question: "What's the difference between a title company and a settlement company in Maryland?", answer: "In Maryland, the terms are often used interchangeably. A title company focuses on title insurance, while a settlement company conducts the closing. Many firms, including DMV Title Guy, handle both roles." },
      { question: "What are typical closing costs for a buyer in Bethesda, MD?", answer: "Bethesda buyer closing costs vary with lender fees, title insurance, recording charges, taxes, property value, and the transaction. Use the closing cost calculator for an educational estimate and confirm actual figures with the lender and accepted provider." },
    ] },
  { city: "Rockville",        slug: "title-company-rockville-md",     state: "MD", county: "Montgomery County",              tier: 1 },
  { city: "Silver Spring",    slug: "title-company-silver-spring-md", state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Kensington", "Takoma Park", "Wheaton"] },
  { city: "Bowie",            slug: "title-company-bowie-md",         state: "MD", county: "Prince George's County",         tier: 1, alsoServing: ["Fort Washington", "Clinton"] },
];

// ─── Tier 2 — Secondary Markets ───────────────────────────────────────────────
export const TIER2_LOCATIONS: Location[] = [
  { city: "Ballston",             slug: "title-company-ballston-va",             state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Clarendon", "Virginia Square", "Courthouse"] },
  { city: "Clarendon",            slug: "title-company-clarendon-va",            state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Ballston", "Courthouse", "Rosslyn"] },
  { city: "Rosslyn",              slug: "title-company-rosslyn-va",              state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Courthouse", "Clarendon", "Ballston"] },
  { city: "Crystal City",         slug: "title-company-crystal-city-va",         state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Pentagon City", "Rosslyn", "Shirlington"] },
  { city: "Pentagon City",        slug: "title-company-pentagon-city-va",        state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Crystal City", "Rosslyn", "Shirlington"] },
  { city: "Courthouse",           slug: "title-company-courthouse-va",           state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Clarendon", "Rosslyn", "Virginia Square"] },
  { city: "Shirlington",          slug: "title-company-shirlington-va",          state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Crystal City", "Pentagon City", "Alexandria"] },
  { city: "Virginia Square",      slug: "title-company-virginia-square-va",      state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Ballston", "Clarendon", "Courthouse"] },
  { city: "Old Town",         slug: "title-company-old-town-alexandria-va",  state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Del Ray", "Carlyle", "Eisenhower"] },
  { city: "Del Ray",          slug: "title-company-del-ray-alexandria-va",   state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Old Town", "Carlyle", "Eisenhower"] },
  { city: "Carlyle",          slug: "title-company-carlyle-alexandria-va",   state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Old Town", "Eisenhower", "Del Ray"] },
  { city: "Eisenhower",       slug: "title-company-eisenhower-alexandria-va",state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Carlyle", "Old Town", "Del Ray"] },
  { city: "Tysons",           slug: "title-company-tysons-va",           state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Merrifield", "Dunn Loring"] },
  { city: "Herndon",          slug: "title-company-herndon-va",          state: "VA", county: "Fairfax County",          tier: 2, faqs: [
      { question: "How much does title insurance cost in Herndon, VA?", answer: "Title insurance in Herndon typically costs $1,000–$2,500 for a standard residential purchase, depending on the purchase price. Virginia uses a competitive rate system, so premiums can vary by underwriter." },
      { question: "How long does a title search take in Fairfax County?", answer: "Many Fairfax County title searches can be completed in a few business days when the record chain is clean. Older properties, estates, trusts, foreclosures, unreleased liens, or complex HOA and condo matters may take longer." },
      { question: "Is a title company required for closings in Virginia?", answer: "Virginia settlement services must be handled by an appropriately licensed or authorized provider. The right provider and requirements depend on the transaction, lender, and requested services." },
      { question: "Can DMV Title Guy help with a Herndon closing?", answer: "DMV Title Guy can provide initial education and collect a request. Eligible title and settlement matters can be referred to Pruitt Title LLC for review; acceptance and scope are confirmed for the specific transaction." },
      { question: "Can I order a Herndon title search online?", answer: "You can submit a title-search or quote request online. Will will follow up with the next steps and confirm the provider, scope, property details, and timing before services begin." },
      { question: "What makes Herndon title closings different?", answer: "Herndon transactions often involve Fairfax County land records, HOA or condominium communities, older subdivisions, investor resales, new construction, and Dulles corridor employment or relocation timelines. Local title review helps surface those issues early." },
    ] },
  { city: "Great Falls",      slug: "title-company-great-falls-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Centreville",      slug: "title-company-centreville-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Chantilly",        slug: "title-company-chantilly-va",        state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Burke",            slug: "title-company-burke-va",            state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"] },
  { city: "Springfield",      slug: "title-company-springfield-va",      state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"], faqs: [
      { question: "What should I expect at closing in Springfield, VA?", answer: "In Springfield, VA, a typical closing takes 45–90 minutes. You'll sign the deed, deed of trust, closing disclosure, and other loan documents. The settlement attorney reviews everything, then coordinates funding and recording with Fairfax County." },
      { question: "Can I estimate title and closing costs online?", answer: "Yes. DMV Title Guy offers educational closing-cost calculators. The results are estimates, not a provider quote. A provider must confirm actual fees, coverage, acceptance, terms, and disclosures directly." },
      { question: "Does title insurance cover boundary disputes in Virginia?", answer: "Standard title insurance in Virginia may cover some boundary and survey issues, but it depends on the policy. An enhanced owner's policy offers broader coverage than a standard policy." },
    ] },
  { city: "Annandale",        slug: "title-company-annandale-va",        state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Falls Church",     slug: "title-company-falls-church-va",     state: "VA", county: "Falls Church / Fairfax",  tier: 2 },
  { city: "Sterling",         slug: "title-company-sterling-va",         state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "South Riding",     slug: "title-company-south-riding-va",     state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Brambleton",       slug: "title-company-brambleton-va",       state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Purcellville",     slug: "title-company-purcellville-va",     state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Middleburg",       slug: "title-company-middleburg-va",       state: "VA", county: "Loudoun County",          tier: 2, alsoServing: ["Aldie"] },
  { city: "Gainesville",      slug: "title-company-gainesville-va",      state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Haymarket",        slug: "title-company-haymarket-va",        state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Bristow",          slug: "title-company-bristow-va",          state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Manassas",         slug: "title-company-manassas-va",         state: "VA", county: "Manassas (independent city)", tier: 2 },
  { city: "Manassas Park",    slug: "title-company-manassas-park-va",    state: "VA", county: "Manassas Park (independent city)", tier: 2 },
  { city: "Stafford",         slug: "title-company-stafford-va",         state: "VA", county: "Stafford County",         tier: 2, alsoServing: ["Aquia Harbour"] },
  { city: "Spotsylvania",     slug: "title-company-spotsylvania-va",     state: "VA", county: "Spotsylvania County",     tier: 2 },
  { city: "Gaithersburg",     slug: "title-company-gaithersburg-md",     state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["Olney", "Damascus"] },
  { city: "Germantown",       slug: "title-company-germantown-md",       state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["Clarksburg"] },
  { city: "Potomac",          slug: "title-company-potomac-md",          state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["North Potomac"] },
  { city: "Hyattsville",      slug: "title-company-hyattsville-md",      state: "MD", county: "Prince George's County",  tier: 2, alsoServing: ["Greenbelt"] },
  { city: "College Park",     slug: "title-company-college-park-md",     state: "MD", county: "Prince George's County",  tier: 2, alsoServing: ["Greenbelt"] },
  { city: "Upper Marlboro",   slug: "title-company-upper-marlboro-md",   state: "MD", county: "Prince George's County",  tier: 2 },
  { city: "Laurel",           slug: "title-company-laurel-md",           state: "MD", county: "Prince George's / Howard County", tier: 2 },
];

export const ALL_LOCATIONS: Location[] = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS];

/** Display a city/state label without duplicating District of Columbia. */
export function formatLocationName(city: string, state: StateCode): string {
  if (state === "DC") {
    return city.toLowerCase().includes("dc") ? city : `${city} DC`;
  }

  return `${city}, ${state}`;
}

export function getLocationDisplayName(location: Location): string {
  return formatLocationName(location.city, location.state);
}

// ─── County Pages ──────────────────────────────────────────────────────────────
export const COUNTIES: County[] = [
  { name: "Fairfax County",          slug: "title-company-fairfax-county-va",          state: "VA", fullName: "Fairfax County, Virginia" },
  { name: "Loudoun County",          slug: "title-company-loudoun-county-va",          state: "VA", fullName: "Loudoun County, Virginia" },
  { name: "Prince William County",   slug: "title-company-prince-william-county-va",   state: "VA", fullName: "Prince William County, Virginia" },
  { name: "Montgomery County",       slug: "title-company-montgomery-county-md",       state: "MD", fullName: "Montgomery County, Maryland" },
  { name: "Prince George's County",  slug: "title-company-prince-georges-county-md",   state: "MD", fullName: "Prince George's County, Maryland" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Get locations within a given county (by name) */
export function getLocationsInCounty(countyName: string): Location[] {
  return ALL_LOCATIONS.filter((l) => l.county.startsWith(countyName.split(" County")[0]));
}

/** Get nearby cities for a given location (same county, different city, max 3) */
export function getNearbyCities(location: Location, max = 3): Location[] {
  return ALL_LOCATIONS
    .filter((l) => l.slug !== location.slug && l.county === location.county)
    .slice(0, max);
}

/** State → calculator slug */
export const CALCULATOR_SLUGS: Record<StateCode, string> = {
  VA: "virginia-closing-cost-calculator",
  MD: "maryland-closing-cost-calculator",
  DC: "dc-closing-cost-calculator",
};

/** Get county page for a given location */
export function getCountyPage(location: Location): County | undefined {
  return COUNTIES.find((c) =>
    location.county.toLowerCase().includes(c.name.split(" County")[0].toLowerCase())
  );
}

/** All location slugs (for generateStaticParams) */
export function getAllLocationSlugs(): string[] {
  return ALL_LOCATIONS.map((l) => l.slug.replace("title-company-", ""));
}

/** All county slugs */
export function getAllCountySlugs(): string[] {
  return COUNTIES.map((c) => c.slug.replace("title-company-", ""));
}

/** Find a location or county by full slug */
export function findBySlug(fullSlug: string): { type: "location"; data: Location } | { type: "county"; data: County } | null {
  const loc = ALL_LOCATIONS.find((l) => l.slug === fullSlug);
  if (loc) return { type: "location", data: loc };
  const county = COUNTIES.find((c) => c.slug === fullSlug);
  if (county) return { type: "county", data: county };
  return null;
}
