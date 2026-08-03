import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  generated: "src/app/[slug]/page.tsx",
  fairfax: "src/app/(marketing)/title-search-fairfax-va/page.tsx",
  vienna: "src/app/(marketing)/title-search-vienna-va/page.tsx",
  quote: "src/components/CompactTitleQuote.tsx",
};

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, file]) => [key, await readFile(file, "utf8")])
  )
);

assert.match(
  source.generated,
  /<CompactTitleQuote locationName=\{locationName\} placement=\{`location-\$\{slug\}-hero`\} \/>/,
  "Every generated city and community route must use the shared hero calculator."
);
assert.match(
  source.generated,
  /<CompactTitleQuote locationName=\{fullName\} placement=\{`county-\$\{slug\}-hero`\} \/>/,
  "Every generated county route must use the shared hero calculator."
);
assert.doesNotMatch(
  source.generated,
  /slug === ["']title-company-herndon-va["']\s*\?\s*\(\s*<CompactTitleQuote/,
  "The hero calculator must not be restricted to Herndon."
);
assert.doesNotMatch(
  source.generated,
  /<LeadCaptureForm compact location=\{`(?:location|county)-\$\{slug\}`\} \/>/,
  "Generated community heroes must not fall back to the legacy contact form."
);
assert.match(
  source.generated,
  /const DEDICATED_LOCATION_SLUGS = new Set\(\[\s*["']title-search-fairfax-va["'],\s*["']title-search-vienna-va["'],\s*\]\);/,
  "Dedicated community routes must be excluded from dynamic static generation."
);
assert.match(
  source.generated,
  /\.filter\(\(location\) => !DEDICATED_LOCATION_SLUGS\.has\(location\.slug\)\)/,
  "Dynamic static params must honor the dedicated-route exclusion list."
);

for (const [name, page] of [
  ["Fairfax", source.fairfax],
  ["Vienna", source.vienna],
]) {
  assert.match(page, /<CompactTitleQuote /, `${name}'s dedicated community route must use the hero calculator.`);
}

assert.match(source.quote, /locationName: string;/, "The shared calculator must accept local context.");
assert.match(source.quote, /placement: string;/, "The shared calculator must accept route-specific analytics context.");
assert.doesNotMatch(source.quote, /Herndon transaction/, "The shared calculator must not contain Herndon-only copy.");
assert.doesNotMatch(source.quote, /window\.location\s*=|location\.href\s*=/, "The quote flow must not navigate away from DMV Title Guy.");
assert.doesNotMatch(source.quote, /<a[^>]+titlecapture/i, "TitleCapture must remain embedded rather than an outbound link.");

console.log("Community quote fleet contract verified.");
