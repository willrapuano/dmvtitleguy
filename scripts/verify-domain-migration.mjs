const targetOrigin = (process.env.TARGET_ORIGIN || "https://dmvtitleguy.com").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.com";
const checkLegacyRedirects = process.env.CHECK_LEGACY_REDIRECTS === "1";

const checks = [];

async function fetchText(path, init) {
  const response = await fetch(`${targetOrigin}${path}`, init);
  const text = await response.text();
  return { response, text };
}

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

for (const path of ["/", "/blog", "/contact", "/calculators/title-quote", "/title-company-for-realtors", "/subscribe"]) {
  try {
    const { response } = await fetchText(path);
    record(`${path} is reachable`, response.ok, `HTTP ${response.status}`);
  } catch (error) {
    record(`${path} is reachable`, false, error.message);
  }
}

try {
  const { response, text } = await fetchText("/blog");
  const canonical = text.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  record("blog canonical uses .com", response.ok && canonical === `${canonicalOrigin}/blog`, canonical || "missing");
} catch (error) {
  record("blog canonical uses .com", false, error.message);
}

try {
  const { response, text } = await fetchText("/robots.txt");
  record("robots points to .com sitemap", response.ok && text.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), `HTTP ${response.status}`);
} catch (error) {
  record("robots points to .com sitemap", false, error.message);
}

try {
  const { response, text } = await fetchText("/sitemap.xml");
  const urls = Array.from(text.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  const foreignUrls = urls.filter((url) => !url.startsWith(`${canonicalOrigin}/`) && url !== canonicalOrigin);
  record("sitemap contains only .com URLs", response.ok && urls.length > 0 && foreignUrls.length === 0, `${urls.length} URLs`);
} catch (error) {
  record("sitemap contains only .com URLs", false, error.message);
}

if (checkLegacyRedirects) {
  for (const path of ["/", "/blog", "/blog/mechanic-lien-agent-virginia?source=migration-test"]) {
    try {
      const response = await fetch(`https://dmvtitleguy.io${path}`, { redirect: "manual" });
      const location = response.headers.get("location") || "";
      const expected = `${canonicalOrigin}${path}`;
      record(`legacy redirect preserves ${path}`, [301, 307, 308].includes(response.status) && location === expected, `HTTP ${response.status} → ${location || "missing"}`);
    } catch (error) {
      record(`legacy redirect preserves ${path}`, false, error.message);
    }
  }
} else {
  console.log("SKIP  legacy redirects — set CHECK_LEGACY_REDIRECTS=1 after production cutover");
}

if (checks.some((check) => !check.ok)) process.exitCode = 1;
