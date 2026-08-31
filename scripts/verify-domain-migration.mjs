import {
  canonicalOrigin,
  legacyPathMappings,
  redirectingHosts,
  slashForms,
} from "../config/domain-redirects.mjs";

const targetOrigin = (process.env.TARGET_ORIGIN || canonicalOrigin).replace(/\/$/, "");
const checkLegacyRedirects = process.env.CHECK_LEGACY_REDIRECTS === "1";
const checks = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function withQuery(origin, pathname) {
  const url = new URL(pathname, `${origin}/`);
  url.searchParams.set("source", "migration-test");
  return url.toString();
}

async function fetchManual(url) {
  return fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
}

async function checkDirect(path) {
  try {
    const response = await fetchManual(`${targetOrigin}${path}`);
    record(
      `${path} is directly reachable`,
      response.status === 200,
      `HTTP ${response.status}${response.headers.get("location") ? ` → ${response.headers.get("location")}` : ""}`
    );
    return response;
  } catch (error) {
    record(`${path} is directly reachable`, false, error.message);
  }
}

async function checkCanonical(path, expectedOrigin = canonicalOrigin) {
  try {
    const response = await fetchManual(`${targetOrigin}${path}`);
    const text = await response.text();
    const canonicals = Array.from(
      text.matchAll(/<link rel="canonical" href="([^"]+)"/gi),
      (match) => match[1]
    );
    const expected = `${expectedOrigin}${path === "/" ? "" : path}`;
    record(
      `${path} canonical`,
      response.status === 200 && canonicals.length === 1 && canonicals[0] === expected,
      canonicals.join(", ") || "missing"
    );
  } catch (error) {
    record(`${path} canonical`, false, error.message);
  }
}

async function checkRedirect(name, from, expected) {
  try {
    const response = await fetchManual(from);
    const rawLocation = response.headers.get("location") || "";
    const resolvedLocation = rawLocation ? new URL(rawLocation, from).toString() : "";
    const permanent = response.status === 301 || response.status === 308;
    let finalStatus = 0;
    let finalLocation = "";
    if (permanent && resolvedLocation === expected) {
      const final = await fetchManual(expected);
      finalStatus = final.status;
      finalLocation = final.headers.get("location") || "";
    }
    record(
      name,
      permanent && resolvedLocation === expected && finalStatus === 200 && !finalLocation,
      `HTTP ${response.status} → ${rawLocation || "missing"}${finalStatus ? ` → HTTP ${finalStatus}` : ""}${finalLocation ? ` → ${finalLocation}` : ""}`
    );
  } catch (error) {
    record(name, false, error.message);
  }
}

async function checkEveryMapping(origin, expectedOrigin, label) {
  for (const [source, destination] of legacyPathMappings) {
    for (const sourceForm of slashForms(source)) {
      await checkRedirect(
        `${label} ${sourceForm} maps in one hop`,
        withQuery(origin, sourceForm),
        withQuery(expectedOrigin, destination)
      );
    }
  }
  await checkRedirect(
    `${label} /my-blog/{slug} maps in one hop`,
    withQuery(origin, "/my-blog/mechanic-lien-agent-virginia"),
    withQuery(expectedOrigin, "/blog/mechanic-lien-agent-virginia")
  );
}

for (const path of ["/", "/blog", "/contact", "/calculators/title-quote", "/title-company-for-realtors", "/subscribe"]) {
  await checkDirect(path);
}

await checkCanonical("/");
await checkCanonical("/blog");
await checkCanonical("/contact");
await checkCanonical("/blog/mechanic-lien-agent-virginia");
await checkEveryMapping(targetOrigin, targetOrigin, "canonical host");

try {
  const response = await fetchManual(`${targetOrigin}/robots.txt`);
  const text = await response.text();
  record(
    "robots points to canonical sitemap",
    response.status === 200 && text.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
    `HTTP ${response.status}`
  );
} catch (error) {
  record("robots points to canonical sitemap", false, error.message);
}

try {
  const response = await fetchManual(`${targetOrigin}/sitemap.xml`);
  const text = await response.text();
  const urls = Array.from(text.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  const uniqueUrls = new Set(urls);
  const foreignUrls = urls.filter(
    (url) => !url.startsWith(`${canonicalOrigin}/`) && url !== canonicalOrigin
  );
  record(
    "sitemap URLs are unique and canonical-host-only",
    response.status === 200 && urls.length > 0 && uniqueUrls.size === urls.length && foreignUrls.length === 0,
    `${urls.length} URLs, ${uniqueUrls.size} unique`
  );

  for (const canonicalUrl of uniqueUrls) {
    const path = new URL(canonicalUrl).pathname;
    const localUrl = `${targetOrigin}${path}`;
    const page = await fetchManual(localUrl);
    const html = await page.text();
    const canonicals = Array.from(
      html.matchAll(/<link rel="canonical" href="([^"]+)"/gi),
      (match) => match[1]
    );
    record(
      `sitemap ${path} is direct and self-canonical`,
      page.status === 200 && !page.headers.get("location") && canonicals.length === 1 && canonicals[0] === canonicalUrl,
      `HTTP ${page.status}; ${canonicals.length === 1 ? canonicals[0] : `${canonicals.length} canonicals`}`
    );
  }
} catch (error) {
  record("sitemap validation", false, error.message);
}

if (checkLegacyRedirects) {
  for (const host of redirectingHosts) {
    await checkEveryMapping(`https://${host}`, canonicalOrigin, host);
  }
} else {
  console.log("SKIP  legacy host redirects — set CHECK_LEGACY_REDIRECTS=1 after production cutover");
}

if (checks.some((check) => !check.ok)) process.exitCode = 1;
