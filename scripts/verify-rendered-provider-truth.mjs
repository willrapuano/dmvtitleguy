import assert from "node:assert/strict";

const origin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const sitemap = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) });
assert.equal(sitemap.status, 200, "sitemap.xml is unavailable");
const sitemapText = await sitemap.text();
const paths = [...sitemapText.matchAll(/<loc>https:\/\/dmvtitleguy\.io([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
for (const path of ["/request-title-review", "/upload-contract", "/investor-due-diligence"]) {
  if (!paths.includes(path)) paths.push(path);
}

const forbidden = [
  /\bwe (?:issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support|close|hold|disburse|prepare|record|clear|process|order|verify|explain|work with|make sure)\b/i,
  /\bour (?:team|settlement team|closing team|title team) (?:issues|handles|provides|serves|coordinates|conducts|reviews|opens|begins|delivers|turns|ensures|supports|closes|holds|disburses|prepares|records|clears|processes|orders|verifies|explains)\b/i,
  /Pruitt Title(?: LLC)? is (?:the|your)\b/i,
  /\bopen your (?:title )?order\b/i,
  /\brespond within (?:one|1) business (?:day|hour)\b/i,
  /\bturn(?:around|ed around)? in (?:24|48)[- ]?hours\b/i,
];

const queue = [...paths];
const violations = [];
await Promise.all(Array.from({ length: 10 }, async () => {
  while (queue.length) {
    const path = queue.shift();
    const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
    const html = await response.text();
    for (const pattern of forbidden) {
      if (pattern.test(html)) violations.push(`${path}: ${pattern}`);
    }
  }
}));

assert.deepEqual(violations, [], `Rendered provider claims found:\n${violations.join("\n")}`);
console.log(`Rendered provider-truth gate passed across ${paths.length} public routes`);
