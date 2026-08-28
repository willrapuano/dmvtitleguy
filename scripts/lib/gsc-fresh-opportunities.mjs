const coreDmvTerms = [
  "washington dc",
  "district of columbia",
  "dc",
  "northern virginia",
  "nova",
  "fairfax county",
  "arlington county",
  "loudoun county",
  "prince william county",
  "montgomery county",
  "prince george s county",
  "arlington",
  "alexandria",
  "fairfax",
  "mclean",
  "mc lean",
  "tysons",
  "vienna",
  "reston",
  "herndon",
  "falls church",
  "annandale",
  "springfield",
  "burke",
  "chantilly",
  "centreville",
  "centerville",
  "oakton",
  "great falls",
  "bethesda",
  "silver spring",
  "rockville",
  "chevy chase",
  "potomac",
  "gaithersburg",
  "takoma park",
  "college park",
  "hyattsville",
  "national harbor",
  "upper marlboro",
  "bowie",
  "laurel",
  "leesburg",
  "woodbridge",
  "manassas",
];

const extendedJurisdictionTerms = [
  "maryland",
  "md",
  "virginia",
  "va",
  "baltimore",
  "richmond",
  "fredericksburg",
  "stafford",
  "charlottesville",
  "winchester",
  "hagerstown",
  "frederick",
  "annapolis",
  "anne arundel",
  "waldorf",
  "southern maryland",
  "eastern shore",
];

const outsideJurisdictionTerms = [
  "west virginia",
  "wv",
  "charleston wv",
  "pennsylvania",
  "delaware",
  "new jersey",
  "new york",
  "north carolina",
  "south carolina",
  "georgia",
  "florida",
  "ohio",
  "tennessee",
  "kentucky",
  "california",
  "texas",
];

export function normalizeQueryText(query) {
  return query
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\bd\s*\.\s*c\s*\.?/g, "dc")
    .replace(/\bm\s*\.\s*d\s*\.?/g, "md")
    .replace(/\bv\s*\.\s*a\s*\.?/g, "va")
    .replace(/\bw\s*\.\s*v\s*\.?/g, "wv")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasPhrase(normalized, phrase) {
  const tokens = normalizeQueryText(phrase).split(" ").map(escapeRegExp).join("\\s+");
  return new RegExp(`(?:^|\\s)${tokens}(?:$|\\s)`).test(normalized);
}

function hasAnyPhrase(normalized, phrases) {
  return phrases.some((phrase) => hasPhrase(normalized, phrase));
}

export function queryGeographicModifierBucket(query) {
  const value = normalizeQueryText(query);
  if (hasAnyPhrase(value, outsideJurisdictionTerms)) return "outside-dc-md-va-query-modifier";
  if (hasAnyPhrase(value, coreDmvTerms)) return "core-dmv-query-modifier";
  if (hasAnyPhrase(value, extendedJurisdictionTerms)) return "extended-dc-md-va-query-modifier";
  return "unrecognized-or-no-geographic-modifier";
}

export function brandBucket(query, brandDictionary) {
  const value = normalizeQueryText(query);
  for (const category of ["owned", "partner", "competitor"]) {
    if ((brandDictionary?.[category] || []).some((term) => hasPhrase(value, term))) return `${category}-brand`;
  }
  return "visible-known-non-brand";
}

export function intentBucket(query, geographicModifier = queryGeographicModifierBucket(query)) {
  const value = normalizeQueryText(query);
  const mentionsTitleInsurance = hasAnyPhrase(value, [
    "title insurance",
    "owners title insurance",
    "owner title insurance",
    "lenders title insurance",
    "lender title insurance",
    "owners policy",
    "owner policy",
    "lenders policy",
    "lender policy",
  ]);
  const hasPricingModifier = /(?:^|\s)(?:how\s+much|costs?|prices?|premiums?|rates?|quotes?|fees?|calculators?|estimates?|estimators?)(?:$|\s)/.test(value);
  if (mentionsTitleInsurance && hasPricingModifier) return "title-insurance-pricing";

  const mentionsProvider = hasAnyPhrase(value, [
    "title company",
    "title companies",
    "settlement company",
    "title agency",
    "title and escrow",
    "escrow company",
    "title services",
    "title closing",
    "title closings",
    "closing services",
    "settlement services",
    "settlement agent",
    "title insurer",
    "title insurance company",
    "real estate settlement",
  ]);
  if (mentionsProvider) {
    const hasCommercialModifier = geographicModifier !== "unrecognized-or-no-geographic-modifier"
      || /(?:^|\s)(?:near\s+me|near|in|best|quotes?|contact|phone|reviews?)(?:$|\s)/.test(value);
    return hasCommercialModifier ? "title-company-local-commercial" : "title-company-informational-or-ambiguous";
  }

  if (/(?:^|\s)(?:survey|surveys|boundary|boundaries|property\s+line|property\s+lines|alta\s+survey)(?:$|\s)/.test(value)) {
    return "property-survey";
  }
  return "other";
}

export function positionBand(position) {
  if (position <= 3) return "1-3";
  if (position <= 10) return "4-10";
  if (position <= 20) return "11-20";
  if (position <= 40) return "21-40";
  return "41+";
}
