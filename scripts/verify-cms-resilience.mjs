import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const querySource = await readFile(new URL("../src/lib/sanity-queries.ts", import.meta.url), "utf8");

assert.ok(!/revalidate\s*:\s*0/.test(querySource), "Sanity fetches must not force no-store behavior");
assert.match(querySource, /SANITY_REVALIDATE_SECONDS\s*=\s*3600/, "Sanity revalidation must remain explicit");

for (const path of ["/blog", "/blog/firpta-explained-dmv"]) {
  const response = await fetch(`${targetOrigin}${path}`, { signal: AbortSignal.timeout(30_000) });
  const cacheControl = response.headers.get("cache-control") || "";
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  assert.ok(!/no-store|private/i.test(cacheControl), `${path} is not cache-resilient: ${cacheControl || "missing Cache-Control"}`);
  assert.match(cacheControl, /s-maxage|max-age/i, `${path} lacks a cache lifetime: ${cacheControl || "missing Cache-Control"}`);
  console.log(`${path}: ${cacheControl}`);
}

console.log("CMS resilience gate passed: blog routes retain an hourly cache window");

