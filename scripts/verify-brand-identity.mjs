import assert from "node:assert/strict";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.io";
const disclosure =
  "DMV Title Guy is the personal brand of Will Rapuano, Marketing and Business Development Officer at Pruitt Title LLC. Title and settlement services are provided by Pruitt Title LLC. Calculator results and articles are estimates and general information, not a quote or legal advice.";

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
  assert.ok(
    !html.includes('"provider":{"@type":"Organization","@id":"https://pruitt-title.com/#organization"'),
    `${path} incorrectly presents Pruitt as the provider for DMV Title Guy content`
  );
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

const locationGuide = jsonLdNodes(locationHtml).find(
  (node) => node["@type"] === "Article" && node["@id"] === `${canonicalOrigin}/title-company-arlington-va#guide`
);
assert.ok(locationGuide, "Arlington page is missing educational Article structured data");
assert.equal(locationGuide.spatialCoverage?.name, "Arlington");
assert.equal(locationGuide.author?.["@id"], `${canonicalOrigin}/about-will-rapuano#person`);

const foreclosureGuide = jsonLdNodes(serviceHtml).find(
  (node) => node["@type"] === "Article" && node.headline === "Foreclosure Title Review Guide"
);
assert.ok(foreclosureGuide, "foreclosure page is missing educational Article structured data");

console.log("Brand identity passed: DMV Title Guy content, Will Rapuano, and Pruitt Title LLC are distinct without provider conflation");
