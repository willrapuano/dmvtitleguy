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
  siteMetadata: "src/lib/site-metadata.ts",
  brandIdentity: "src/lib/brand-identity.ts",
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

for (const [name, contents] of Object.entries(source).filter(
  ([key]) => !["locations", "siteMetadata"].includes(key)
)) {
  assert.match(
    contents,
    /https:\/\/dmvtitleguy\.io|\bSITE_URL\b|canonical: `\/\$\{params\.slug\}`/,
    `${name} must identify DMVTitleGuy.io as the public origin or emit a relative canonical.`
  );
}

assert.match(
  source.generatedLocations,
  /title: "Falls Church VA Title Company Guide \| DMV Title Guy"/,
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
  source.marketingLayout,
  /name: SITE_NAME/,
  "WebSite schema must use the canonical DMV Title Guy identity constant."
);
assert.match(
  source.marketingLayout,
  /"@id": PRUITT_TITLE\.id/,
  "Marketing schema must preserve Pruitt Title as a distinct organization entity."
);
assert.match(
  source.siteMetadata,
  /SITE_NAME = "Pruitt Title \| DMV Title Guy"/,
  "Shared metadata must use the same Pruitt Title and DMV Title Guy site identity."
);

const frozenLocationRoutes = [
  "/title-company/alexandria-va",
  "/title-company/arlington-va",
  "/title-company/fairfax-va",
  "/title-company/loudoun-county-va",
  "/title-company/prince-william-county-va",
];

const consolidatedLocationRoutes = [
  ["/title-company/falls-church-va", "/title-company-falls-church-va"],
  ["/title-company/silver-spring-md", "/title-company-silver-spring-md"],
];

for (const [duplicate, canonical] of consolidatedLocationRoutes) {
  assert.ok(
    source.domainConfig.includes(`["${duplicate}", "${canonical}"]`),
    `${duplicate} must redirect permanently to ${canonical}.`
  );
  assert.ok(
    !source.sitemap.includes(`"${duplicate}"`) && !source.sitemap.includes(`'${duplicate}'`),
    `${duplicate} must stay out of the sitemap.`
  );
}

for (const route of frozenLocationRoutes) {
  assert.ok(
    !source.domainConfig.includes(`["${route}",`),
    `${route} must remain directly reachable during the measurement freeze.`
  );
  assert.ok(
    source.sitemap.includes(`"${route}"`) || source.sitemap.includes(`'${route}'`),
    `${route} must remain in the sitemap during the measurement freeze.`
  );
  const pageSource = await readFile(`src/app/(marketing)${route}/page.tsx`, "utf8");
  assert.ok(
    pageSource.includes(`canonical: "${route}"`) || pageSource.includes(`canonical: '${route}'`),
    `${route} must remain self-canonical during the measurement freeze.`
  );
}

console.log("SEO origin, brand identity, frozen-route, and location consolidation contracts verified.");
