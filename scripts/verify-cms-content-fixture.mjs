// Proves verify-cms-content still catches each class of error it exists for, and
// still allows the correct phrasings that sit next to them. Runs offline.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const run = spawnSync(process.execPath, [path.join(here, "verify-cms-content.mjs")], {
  env: { ...process.env, CMS_CONTENT_FIXTURE: path.join(here, "fixtures/cms-content-violations.json") },
  encoding: "utf8",
});
const out = `${run.stdout}${run.stderr}`;
assert.notEqual(run.status, 0, "the CMS content check must fail on the violations fixture");

const mustCatch = [
  ["fixture-tax-claims", "reduced 0.725% recordation rate, not an exemption"],
  ["fixture-tax-claims", "2.9% combined"],
  ["fixture-tax-claims", "on the price"],
  ["fixture-tax-claims", "$0.15 congestion fee was repealed"],
  ["fixture-identity", "site-voice claim of doing title work"],
  ["fixture-identity", "does not own a title company"],
  ["fixture-identity", "does not perform title searches"],
  ["fixture-structure", "the same callout appears twice in a row"],
  ["fixture-structure", "(callouts 2 and 4): the same callout appears twice"],
  ["fixture-structure", "missing _key"],
  ["fixture-structure", "has no body text"],
  ["fixture-drafting-leftovers", "leftover AI-assistant text"],
  ["fixture-drafting-leftovers", "content-pipeline metadata"],
];
for (const [slug, text] of mustCatch) {
  assert.ok(out.split("\n").some((line) => line.includes(`/blog/${slug}`) && line.includes(text)), `expected a failure on ${slug}: ${text}`);
}
assert.ok(!out.includes("/blog/fixture-allowed"), `correct phrasings were flagged:\n${out.split("\n").filter((l) => l.includes("fixture-allowed")).join("\n")}`);
console.log(`CMS content rules verified: ${mustCatch.length} violation classes caught, correct phrasings allowed`);
