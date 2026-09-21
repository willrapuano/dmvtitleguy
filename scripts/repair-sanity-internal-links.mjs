import { createClient } from "@sanity/client";
import { requireSanityToken, sanityTokenSource } from "../sanity-token.mjs";

const projectId = "4s0dloxi";
const dataset = "production";
const apply = process.argv.includes("--apply");

const replacements = new Map([
  ["/title-insurance-cost-virginia", "/blog/title-insurance-cost-virginia"],
  ["/closing-costs-maryland-2026", "/blog/closing-costs-maryland-2026"],
  ["/title-and-settlement-services", "/why-choose-us"],
  ["/closing-costs-maryland", "/closing-costs/maryland"],
  ["/closing-costs-dc", "/closing-costs/dc"],
  ["/who-pays-closing-costs-in-virginia", "/blog/who-pays-closing-costs-in-virginia"],
  ["/closing-costs-in-virginia-2026", "/blog/closing-costs-in-virginia-2026"],
  ["/title-company-maryland", "/closing-costs/maryland"],
  ["/what-is-lenders-title-insurance", "/blog/what-is-lenders-title-insurance"],
  ["/lenders-title-insurance-vs-owners-title-insurance", "/blog/lenders-title-insurance-vs-owners-title-insurance"],
  ["/settlement-company-fairfax-county", "/blog/settlement-company-fairfax-county"],
  ["/blog/what-is-a-title-search", "/blog/title-search-vs-title-insurance"],
  ["/blog/what-is-title-insurance", "/title-insurance"],
  ["/blog/virginia-settlement-closing-process-explained", "/blog/what-happens-at-closing-real-estate"],
  ["/blog/title-search-process-explained", "/blog/what-does-a-title-company-do"],
  ["/title-company-vienna-va", "/title-search-vienna-va"],
  ["/title-company-fairfax-va", "/title-search-fairfax-va"],
  ["/title-quote", "/calculators/title-quote"],
]);

const replacementPairs = [...replacements].flatMap(([source, destination]) => [
  [source, destination],
  [`https://dmvtitleguy.io${source}`, `https://dmvtitleguy.io${destination}`],
  [`https://www.dmvtitleguy.io${source}`, `https://dmvtitleguy.io${destination}`],
]);

function replaceString(value) {
  const exact = replacementPairs.find(([source]) => source === value);
  if (exact) return { value: exact[1], count: 1 };

  let next = value;
  let count = 0;
  for (const [source, destination] of replacementPairs) {
    for (const [before, after] of [
      [`[LINK:${source}]`, `[LINK:${destination}]`],
      [`](${source})`, `](${destination})`],
      [`href="${source}"`, `href="${destination}"`],
      [`href='${source}'`, `href='${destination}'`],
    ]) {
      if (!next.includes(before)) continue;
      next = next.replaceAll(before, after);
      count += 1;
    }
  }
  return { value: next, count };
}

function replaceValue(value) {
  if (typeof value === "string") return replaceString(value);
  if (Array.isArray(value)) {
    let count = 0;
    const next = value.map((item) => {
      const result = replaceValue(item);
      count += result.count;
      return result.value;
    });
    return { value: next, count };
  }
  if (value && typeof value === "object") {
    let count = 0;
    const next = {};
    for (const [key, item] of Object.entries(value)) {
      const result = replaceValue(item);
      next[key] = result.value;
      count += result.count;
    }
    return { value: next, count };
  }
  return { value, count: 0 };
}

const token = requireSanityToken(projectId);
const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });
const documents = await client.fetch(
  `*[_type in ["post", "blogPost"] && !(_id in path("drafts.**"))] {
    _id, _rev, title, "slug": slug.current, body
  }`,
);

const changes = documents.flatMap((document) => {
  const result = replaceValue(document.body);
  return result.count
    ? [{ document, nextBody: result.value, count: result.count }]
    : [];
});

for (const change of changes) {
  console.log(`${change.document._id} (${change.document.slug || "no-slug"}): ${change.count} replacement(s)`);
}

if (!changes.length) {
  console.log("Sanity internal links already use final destinations");
  process.exit(0);
}

if (!apply) {
  console.log(`Dry run: ${changes.length} document(s), ${changes.reduce((sum, item) => sum + item.count, 0)} replacement(s)`);
  console.log("Run again with --apply to commit this revision-guarded transaction");
  process.exit(0);
}

let transaction = client.transaction();
for (const change of changes) {
  transaction = transaction.patch(change.document._id, {
    ifRevisionID: change.document._rev,
    set: { body: change.nextBody },
  });
}
await transaction.commit({ visibility: "sync" });

console.log(
  `Applied ${changes.reduce((sum, item) => sum + item.count, 0)} link replacement(s) across ${changes.length} document(s) using ${sanityTokenSource(projectId)}`,
);
