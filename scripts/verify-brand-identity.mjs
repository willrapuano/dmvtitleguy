import assert from "node:assert/strict";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.io";
const disclosure =
  "DMV Title Guy is a personal educational and business-development website operated by Will Rapuano. It is separate from Pruitt Title LLC’s corporate website and is not a title insurer, title agency, escrow company, or settlement provider. Will is Marketing and Business Development Officer at Pruitt Title. If you request transaction services, your information may be referred to Pruitt Title for its independent review. If Pruitt accepts the request, it confirms scope, pricing, terms, and required disclosures directly.";

function jsonLdNodes(html) {
  const documents = Array.from(
    html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
    (match) => JSON.parse(match[1])
  );

  return documents.flatMap((document) => document["@graph"] || [document]);
}

async function load(path) {
  const response = await fetch(`${targetOrigin}${path}`, {
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  return response.text();
}

const [homeHtml, aboutHtml, locationHtml, serviceHtml] = await Promise.all([
  load("/"),
  load("/about-will-rapuano"),
  load("/title-company-arlington-va"),
  load("/foreclosure-title-review"),
]);

for (const [path, html] of [
  ["/", homeHtml],
  ["/about-will-rapuano", aboutHtml],
  ["/title-company-arlington-va", locationHtml],
  ["/foreclosure-title-review", serviceHtml],
]) {
  assert.ok(html.includes(disclosure), `${path} is missing the relationship disclosure`);
  assert.ok(!html.includes('"@type":["LocalBusiness","LegalService"]'), `${path} still conflates DMV Title Guy with a local title company`);
  assert.ok(!html.includes('"@type":"LocalBusiness"'), `${path} contains unsupported LocalBusiness markup`);
  assert.ok(!html.includes('"@type":"LegalService"'), `${path} contains unsupported LegalService markup`);
}

const homeNodes = jsonLdNodes(homeHtml);
const website = homeNodes.find((node) => node["@type"] === "WebSite" && node.name === "DMV Title Guy");
const will = homeNodes.find((node) => node["@type"] === "Person" && node.name === "Will Rapuano");
const pruitt = homeNodes.find((node) => node["@type"] === "Organization" && node.name === "Pruitt Title LLC");

assert.ok(website, "homepage is missing the DMV Title Guy WebSite entity");
assert.equal(website.creator?.["@id"], `${canonicalOrigin}/about-will-rapuano#person`);
assert.ok(will, "homepage is missing Will Rapuano’s Person entity");
assert.equal(will.jobTitle, "Marketing and Business Development Officer");
assert.equal(will.worksFor?.["@id"], "https://pruitt-title.com/#organization");
assert.ok(pruitt, "homepage is missing the distinct Pruitt Title LLC Organization entity");
assert.equal(pruitt.url, "https://pruitt-title.com/");

const aboutCanonical = aboutHtml.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
assert.equal(aboutCanonical, `${canonicalOrigin}/about-will-rapuano`);
assert.ok(
  jsonLdNodes(aboutHtml).some((node) => node["@type"] === "ProfilePage"),
  "about page is missing ProfilePage structured data"
);

const locationService = jsonLdNodes(locationHtml).find(
  (node) => node["@type"] === "Service" && node["@id"] === `${canonicalOrigin}/title-company-arlington-va#service`
);
assert.ok(locationService, "Arlington page is missing Service structured data");
assert.equal(locationService.provider?.name, "Pruitt Title LLC");
assert.equal(locationService.provider?.url, "https://pruitt-title.com/");
assert.equal(locationService.areaServed?.name, "Arlington");

const foreclosureService = jsonLdNodes(serviceHtml).find(
  (node) => node["@type"] === "Service" && node.name === "Foreclosure Title Review"
);
assert.ok(foreclosureService, "service page is missing Service structured data");
assert.equal(foreclosureService.provider?.name, "Pruitt Title LLC");

console.log("Brand identity passed: DMV Title Guy, Will Rapuano, and Pruitt Title LLC are distinct and correctly related");
