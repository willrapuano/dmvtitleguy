// Submit URLs to IndexNow after a release.
//   node scripts/indexnow-submit.mjs https://dmvtitleguy.io/ https://dmvtitleguy.io/blog/x
//   node scripts/indexnow-submit.mjs --all      (every URL in the live sitemap)
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/lib/indexnow.ts", import.meta.url), "utf8");
const key = source.match(/INDEXNOW_KEY = "([0-9a-f]{32})"/)[1];
const host = "dmvtitleguy.io";
let urls = process.argv.slice(2);
if (urls.includes("--all")) {
  const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (urls.length === 0) throw new Error("no URLs given");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URL(s) -> HTTP ${response.status}`);
if (response.status >= 400) process.exitCode = 1;
