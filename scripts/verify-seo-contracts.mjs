import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  layout: "src/app/layout.tsx",
  marketingLayout: "src/app/(marketing)/layout.tsx",
  sitemap: "src/app/sitemap.ts",
  robots: "src/app/robots.ts",
  schema: "src/components/SchemaMarkup.tsx",
  generatedLocations: "src/app/[slug]/page.tsx",
  locations: "src/data/locations.ts",
  domainConfig: "config/domain-redirects.mjs",
};

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, file]) => [key, await readFile(file, "utf8")])
  )
);

for (const [name, contents] of Object.entries(source)) {
  assert.doesNotMatch(
    contents,
    /https:\/\/dmvtitleguy\.com/,
    `${name} must not emit a canonical, sitemap, metadata, or schema URL on the retired .com origin.`
  );
}

for (const [name, contents] of Object.entries(source).filter(([key]) => key !== "locations")) {
  assert.match(
    contents,
    /https:\/\/dmvtitleguy\.io|canonical: `\/\$\{params\.slug\}`/,
    `${name} must identify DMVTitleGuy.io as the public origin or emit a relative canonical.`
  );
}

assert.match(
  source.generatedLocations,
  /title: "Falls Church, VA Title Company \| DMV Title Guy"/,
  "Falls Church must keep a concise, query-aligned, branded search title."
);
assert.match(
  source.generatedLocations,
  /\? "Falls Church, VA Title & Settlement Services"/,
  "Falls Church must keep a location-specific H1 instead of the generic community heading."
);
assert.match(
  source.locations,
  /city: "Falls Church"[^\n]+faqs: \[/,
  "Falls Church must keep market-specific FAQ content in the shared community source."
);
assert.match(
  source.domainConfig,
  /\["\/title-company\/falls-church-va", "\/title-company-falls-church-va"\]/,
  "The duplicate Falls Church route must redirect to the optimized canonical route."
);
assert.doesNotMatch(
  source.sitemap,
  /["']\/title-company\/falls-church-va["']/,
  "The duplicate Falls Church route must stay out of the sitemap."
);

console.log("SEO origin and Falls Church search contract verified.");
