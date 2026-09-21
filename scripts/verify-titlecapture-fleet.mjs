import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const titleCaptureRoutes = [
  "src/app/(marketing)/calculators/title-quote/page.tsx",
  "src/app/(marketing)/dc-closing-cost-calculator/page.tsx",
  "src/app/(marketing)/maryland-closing-cost-calculator/page.tsx",
  "src/app/(marketing)/virginia-closing-cost-calculator/page.tsx",
  "src/app/(marketing)/closing-costs/dc/page.tsx",
  "src/app/(marketing)/closing-costs/maryland/page.tsx",
  "src/app/(marketing)/title-company/bethesda-md/page.tsx",
  "src/app/(marketing)/title-company/falls-church-va/page.tsx",
  "src/app/(marketing)/title-company/silver-spring-md/page.tsx",
];

const frozenCalculatorRoutes = [
  "src/app/(marketing)/title-company/alexandria-va/page.tsx",
  "src/app/(marketing)/title-company/arlington-va/page.tsx",
  "src/app/(marketing)/title-company/fairfax-va/page.tsx",
  "src/app/(marketing)/title-company/loudoun-county-va/page.tsx",
  "src/app/(marketing)/title-company/prince-william-county-va/page.tsx",
];

const [embed, compact, titleCaptureConfig, legacyCalculator, ...routeSources] = await Promise.all([
  readFile("src/components/TitleQuoteEmbed.tsx", "utf8"),
  readFile("src/components/CompactTitleQuote.tsx", "utf8"),
  readFile("src/lib/titleCapture.ts", "utf8"),
  readFile("src/components/ClosingCostCalculator.tsx", "utf8"),
  ...titleCaptureRoutes.map((file) => readFile(file, "utf8")),
  ...frozenCalculatorRoutes.map((file) => readFile(file, "utf8")),
]);
const titleCaptureSources = routeSources.slice(0, titleCaptureRoutes.length);
const frozenCalculatorSources = routeSources.slice(titleCaptureRoutes.length);

assert.match(
  titleCaptureConfig,
  /https:\/\/pruitt-title\.titlecapture\.com\/title-quote/,
  "The canonical quote URL must point to Pruitt Title's TitleCapture calculator."
);
assert.match(embed, /src=\{TITLECAPTURE_QUOTE_URL\}/, "The full quote surface must use the canonical TitleCapture URL.");
assert.match(compact, /src=\{TITLECAPTURE_QUOTE_URL\}/, "The compact quote surface must use the canonical TitleCapture URL.");
assert.match(embed, /Powered by TitleCapture/, "The quote source must be visible to visitors.");
assert.match(embed, /Results are estimates until Pruitt Title reviews/, "The quote must disclose its estimate status.");
assert.match(embed, /allow-storage-access-by-user-activation/, "The embedded vendor flow must be able to request storage access after a user action.");
assert.match(compact, /allow-storage-access-by-user-activation/, "The compact vendor flow must be able to request storage access after a user action.");
assert.doesNotMatch(embed, /<a[^>]+titlecapture/i, "The full quote flow must stay embedded on DMV Title Guy.");
assert.doesNotMatch(compact, /<a[^>]+titlecapture/i, "The compact quote flow must stay embedded on DMV Title Guy.");

for (const [index, route] of titleCaptureSources.entries()) {
  assert.match(
    route,
    /<TitleQuoteEmbed(?:\s|>)/,
    `${titleCaptureRoutes[index]} must render the shared TitleCapture quote surface.`
  );
  assert.doesNotMatch(
    route,
    /ClosingCostCalculator/,
    `${titleCaptureRoutes[index]} must not render the hand-maintained cost estimator.`
  );
}

assert.match(
  legacyCalculator,
  /export function ClosingCostCalculator/,
  "The frozen local routes must retain their pre-existing calculator implementation."
);
for (const [index, route] of frozenCalculatorSources.entries()) {
  assert.match(
    route,
    /<ClosingCostCalculator(?:\s|>)/,
    `${frozenCalculatorRoutes[index]} must preserve the live calculator during the measurement freeze.`
  );
  assert.doesNotMatch(
    route,
    /<TitleQuoteEmbed(?:\s|>)/,
    `${frozenCalculatorRoutes[index]} must not change quote surfaces during the measurement freeze.`
  );
}

console.log("TitleCapture quote fleet and frozen local calculator contracts verified.");
