export type Tier = 1 | 2;
export type StateCode = "VA" | "MD" | "DC";

export interface Location {
  city: string;
  slug: string;
  state: StateCode;
  county: string;
  tier: Tier;
  /** Tier 3 communities to mention as "also serving" */
  alsoServing?: string[];
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
  { city: "Fairfax",          slug: "title-company-fairfax-va",       state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "McLean",           slug: "title-company-mclean-va",        state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "Vienna",           slug: "title-company-vienna-va",        state: "VA", county: "Fairfax County",                 tier: 1, alsoServing: ["Oakton"] },
  { city: "Reston",           slug: "title-company-reston-va",        state: "VA", county: "Fairfax County",                 tier: 1 },
  { city: "Ashburn",          slug: "title-company-ashburn-va",       state: "VA", county: "Loudoun County",                 tier: 1 },
  { city: "Leesburg",         slug: "title-company-leesburg-va",      state: "VA", county: "Loudoun County",                 tier: 1 },
  { city: "Woodbridge",       slug: "title-company-woodbridge-va",    state: "VA", county: "Prince William County",          tier: 1, alsoServing: ["Dale City", "Lake Ridge", "Dumfries", "Occoquan"] },
  { city: "Fredericksburg",   slug: "title-company-fredericksburg-va",state: "VA", county: "Fredericksburg (independent city)", tier: 1 },
  { city: "Bethesda",         slug: "title-company-bethesda-md",      state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Chevy Chase"] },
  { city: "Rockville",        slug: "title-company-rockville-md",     state: "MD", county: "Montgomery County",              tier: 1 },
  { city: "Silver Spring",    slug: "title-company-silver-spring-md", state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Kensington", "Takoma Park", "Wheaton"] },
  { city: "Bowie",            slug: "title-company-bowie-md",         state: "MD", county: "Prince George's County",         tier: 1, alsoServing: ["Fort Washington", "Clinton"] },
];

// ─── Tier 2 — Secondary Markets ───────────────────────────────────────────────
export const TIER2_LOCATIONS: Location[] = [
  { city: "Tysons",           slug: "title-company-tysons-va",           state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Merrifield", "Dunn Loring"] },
  { city: "Herndon",          slug: "title-company-herndon-va",          state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Great Falls",      slug: "title-company-great-falls-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Centreville",      slug: "title-company-centreville-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Chantilly",        slug: "title-company-chantilly-va",        state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Burke",            slug: "title-company-burke-va",            state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"] },
  { city: "Springfield",      slug: "title-company-springfield-va",      state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"] },
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
