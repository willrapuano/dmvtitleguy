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
    "owner s policy",
    "lenders policy",
    "lender policy",
    "lender s policy",
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
    const hasStructuralLocalModifier = /(?:title\s+(?:company|companies)|settlement\s+company|title\s+agency|title\s+and\s+escrow|escrow\s+company)\s+(?:in|near)\s+(?:me|[a-z0-9])/.test(value);
    const hasCommercialModifier = geographicModifier !== "unrecognized-or-no-geographic-modifier"
      || hasStructuralLocalModifier
      || /(?:^|\s)(?:near\s+me|best|quotes?|contact|phone|reviews?)(?:$|\s)/.test(value);
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

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function validateCaptureName(captureName) {
  assert.match(captureName, /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/, "--capture-name must be a safe single path segment");
}

export function validateFreshSnapshotOptions({ startDate, endDate, minimumImpressions, captureName }) {
  assert.match(startDate, /^\d{4}-\d{2}-\d{2}$/, "--start must be YYYY-MM-DD");
  assert.match(endDate, /^\d{4}-\d{2}-\d{2}$/, "--end must be YYYY-MM-DD");
  assert.ok(startDate <= endDate, "--start must be on or before --end");
  const dateSpanDays = 1 + Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000);
  assert.ok(dateSpanDays >= 2, "The hourly API request must span at least two Pacific calendar dates");
  assert.ok(dateSpanDays <= 10, "Search Console hourly data supports at most ten calendar dates per request");
  assert.ok(Number.isFinite(minimumImpressions) && minimumImpressions >= 1, "--minimum-impressions must be at least 1");
  validateCaptureName(captureName);
  return { dateSpanDays };
}

export function assertResponseAggregation(actual, expected, name) {
  assert.equal(actual, expected, `${name} returned unexpected aggregation ${actual || "missing"}`);
}

export function rowsWithinHourWindow(rows, startMs, endMs, hourKeyIndex = 0) {
  return rows.filter((row) => {
    const timestamp = Date.parse(String(row.keys?.[hourKeyIndex] || ""));
    return Number.isFinite(timestamp) && timestamp >= startMs && timestamp <= endMs;
  });
}

export function selectLatestRollingHourWindow(rows, hours = 24, hourKeyIndex = 0) {
  assert.ok(Number.isInteger(hours) && hours >= 1, "Rolling hour count must be a positive integer");
  const availableHourKeys = rows.map((row) => String(row.keys?.[hourKeyIndex] || "")).filter(Boolean).sort();
  assert.ok(availableHourKeys.length, "Search Console returned no hourly property rows");
  const lastAvailableHour = availableHourKeys.at(-1);
  const endMs = Date.parse(lastAvailableHour);
  assert.ok(Number.isFinite(endMs), "Search Console returned an invalid last available hour");
  const startMs = endMs - (hours - 1) * 60 * 60 * 1000;
  return {
    lastAvailableHour,
    startMs,
    endMs,
    endExclusiveMs: endMs + 60 * 60 * 1000,
    rows: rowsWithinHourWindow(rows, startMs, endMs, hourKeyIndex),
  };
}

export function groupRows(rows, keyFor) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFor(row);
    const group = groups.get(key) || [];
    group.push(row);
    groups.set(key, group);
  }
  return groups;
}

export function describeExactPage(page, canonicalOrigin) {
  try {
    const url = new URL(page);
    const hasVariant = Boolean(url.search || url.hash);
    let urlClass = "other-origin";
    if (url.origin === canonicalOrigin && !hasVariant) urlClass = "canonical-origin-clean-url";
    else if (url.origin === canonicalOrigin) urlClass = "canonical-origin-query-or-fragment-variant";
    else if (url.hostname.replace(/^www\./, "") === new URL(canonicalOrigin).hostname) urlClass = "legacy-scheme-or-www-origin";
    return { page, origin: url.origin, path: url.pathname || "/", urlClass };
  } catch {
    return { page, origin: null, path: null, urlClass: "invalid-url" };
  }
}

export async function createPrivateCaptureDirectory(privateRootConfigured, captureName) {
  validateCaptureName(captureName);
  await mkdir(privateRootConfigured, { recursive: true, mode: 0o700 });
  await chmod(privateRootConfigured, 0o700);
  const privateRoot = await realpath(privateRootConfigured);
  const outputDirectory = resolve(privateRoot, captureName);
  assert.equal(dirname(outputDirectory), privateRoot, "Capture directory escaped private-seo/gsc-fresh");
  await mkdir(outputDirectory, { recursive: false, mode: 0o700 });
  const outputStats = await lstat(outputDirectory);
  assert.ok(outputStats.isDirectory() && !outputStats.isSymbolicLink(), "Capture target must be a newly created real directory");
  await chmod(outputDirectory, 0o700);
  return outputDirectory;
}

export async function writePrivateArtifact(outputDirectory, name, content) {
  assert.match(name, /^[a-z0-9][a-z0-9.-]*$/, "Unsafe artifact filename");
  const path = resolve(outputDirectory, name);
  assert.equal(dirname(path), outputDirectory, "Artifact escaped capture directory");
  await writeFile(path, content, { flag: "wx", mode: 0o600 });
  await chmod(path, 0o600);
  return path;
}
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmod, lstat, mkdir, realpath, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
