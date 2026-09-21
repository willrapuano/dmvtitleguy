import assert from "node:assert/strict";
import { mkdtemp, readFile, realpath, rm, stat, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  assertResponseAggregation,
  createPrivateCaptureDirectory,
  describeExactPage,
  groupRows,
  intentBucket,
  normalizeQueryText,
  queryGeographicModifierBucket,
  rowsWithinHourWindow,
  selectLatestRollingHourWindow,
  sha256,
  validateFreshSnapshotOptions,
  writePrivateArtifact,
} from "./lib/gsc-fresh-opportunities.mjs";

const geographicFixtures = [
  ["how much is title insurance near washington, dc", "core-dmv-query-modifier"],
  ["how much is title insurance near Washington D.C.", "core-dmv-query-modifier"],
  ["title company in Silver Spring", "core-dmv-query-modifier"],
  ["title company in McLean", "core-dmv-query-modifier"],
  ["title company Northern Virginia", "core-dmv-query-modifier"],
  ["title company NOVA", "core-dmv-query-modifier"],
  ["title company dc", "core-dmv-query-modifier"],
  ["title company Leesburg", "core-dmv-query-modifier"],
  ["title company Centerville VA", "core-dmv-query-modifier"],
  ["how much is title insurance near baltimore, md", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near maryland", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near richmond va", "extended-dc-md-va-query-modifier"],
  ["title company Anne Arundel", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near charleston, wv", "outside-dc-md-va-query-modifier"],
  ["how much is title insurance near west virginia", "outside-dc-md-va-query-modifier"],
  ["title survey", "unrecognized-or-no-geographic-modifier"],
  ["title company in Chicago", "unrecognized-or-no-geographic-modifier"],
  ["title insurance is available", "unrecognized-or-no-geographic-modifier"],
  ["advanced title advice", "unrecognized-or-no-geographic-modifier"],
];

for (const [query, expected] of geographicFixtures) {
  assert.equal(queryGeographicModifierBucket(query), expected, `Geographic-modifier fixture failed: ${query}`);
}

for (const query of [
  "title insurance costs",
  "title insurance rates",
  "title insurance fees",
  "title insurance premiums",
  "title insurance quotes",
  "title insurance calculator",
  "title insurance estimate",
  "title insurance estimator",
  "owner’s policy premium",
  "lender's policy rates",
]) {
  assert.equal(intentBucket(query), "title-insurance-pricing", `Pricing fixture failed: ${query}`);
}

assert.equal(intentBucket("title company in McLean"), "title-company-local-commercial");
assert.equal(intentBucket("best title company near me"), "title-company-local-commercial");
assert.equal(intentBucket("title companies near me"), "title-company-local-commercial");
assert.equal(intentBucket("Tysons VA title services"), "title-company-local-commercial");
assert.equal(intentBucket("Herndon VA title closings"), "title-company-local-commercial");
assert.equal(intentBucket("closing services Falls Church Virginia"), "title-company-local-commercial");
assert.equal(intentBucket("settlement agent Northern Virginia"), "title-company-local-commercial");
assert.equal(intentBucket("title insurer Washington DC"), "title-company-local-commercial");
assert.equal(intentBucket("how to start a title company"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("what is a title company"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("what are title services"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("how to invest in a title company"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("what does a title company do in a refinance"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("title survey"), "property-survey");
assert.equal(normalizeQueryText("Washington D.C."), "washington dc");

process.stdout.write(`Verified ${geographicFixtures.length + 25} GSC opportunity-classifier fixtures.\n`);

assert.deepEqual(validateFreshSnapshotOptions({
  startDate: "2026-08-27",
  endDate: "2026-08-28",
  minimumImpressions: 10,
  captureName: "valid-capture_01",
}), { dateSpanDays: 2 });
assert.throws(() => validateFreshSnapshotOptions({
  startDate: "2026-08-27",
  endDate: "2026-08-27",
  minimumImpressions: 10,
  captureName: "single-day",
}), /at least two Pacific calendar dates/);
assert.throws(() => validateFreshSnapshotOptions({
  startDate: "2026-08-01",
  endDate: "2026-08-28",
  minimumImpressions: 10,
  captureName: "too-long",
}), /at most ten calendar dates/);
assert.throws(() => validateFreshSnapshotOptions({
  startDate: "2026-08-27",
  endDate: "2026-08-28",
  minimumImpressions: 10,
  captureName: "../public",
}), /safe single path segment/);

assert.doesNotThrow(() => assertResponseAggregation("byProperty", "byProperty", "fixture"));
assert.throws(() => assertResponseAggregation("byPage", "byProperty", "fixture"), /unexpected aggregation/);

const firstHourMs = Date.parse("2026-08-27T00:00:00-07:00");
const hourlyRows = Array.from({ length: 30 }, (_, index) => ({
  keys: [new Date(firstHourMs + index * 60 * 60 * 1000).toISOString()],
  clicks: index === 29 ? 1 : 0,
  impressions: index + 1,
  ctr: 0,
  position: 10,
}));
const rollingWindow = selectLatestRollingHourWindow(hourlyRows, 24);
assert.equal(rollingWindow.rows.length, 24);
assert.equal(rollingWindow.rows[0].keys[0], hourlyRows[6].keys[0]);
assert.equal(rollingWindow.rows.at(-1).keys[0], hourlyRows[29].keys[0]);
assert.equal(rollingWindow.endMs - rollingWindow.startMs, 23 * 60 * 60 * 1000);
assert.equal(rowsWithinHourWindow(hourlyRows, rollingWindow.startMs, rollingWindow.endMs).length, 24);

const exactUrlRows = [
  { keys: ["hour", "https://dmvtitleguy.io/"] },
  { keys: ["hour", "http://www.dmvtitleguy.io/"] },
];
assert.equal(groupRows(exactUrlRows, (row) => row.keys[1]).size, 2, "Exact URL grouping must not collapse origins");
assert.equal(describeExactPage("https://dmvtitleguy.io/", "https://dmvtitleguy.io").urlClass, "canonical-origin-clean-url");
assert.equal(describeExactPage("https://dmvtitleguy.io/?source=test", "https://dmvtitleguy.io").urlClass, "canonical-origin-query-or-fragment-variant");
assert.equal(describeExactPage("http://www.dmvtitleguy.io/", "https://dmvtitleguy.io").urlClass, "legacy-scheme-or-www-origin");
assert.equal(sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");

const temporaryRoot = await mkdtemp(join(tmpdir(), "dmv-gsc-opportunity-"));
try {
  const privateRootConfigured = resolve(temporaryRoot, "private-seo", "gsc-fresh");
  const captureDirectory = await createPrivateCaptureDirectory(privateRootConfigured, "fixture-capture");
  assert.equal((await stat(privateRootConfigured)).mode & 0o777, 0o700);
  assert.equal((await stat(captureDirectory)).mode & 0o777, 0o700);
  await assert.rejects(() => createPrivateCaptureDirectory(privateRootConfigured, "fixture-capture"), /EEXIST/);

  const privateRoot = await realpath(privateRootConfigured);
  await symlink(captureDirectory, join(privateRoot, "linked-capture"));
  await assert.rejects(() => createPrivateCaptureDirectory(privateRootConfigured, "linked-capture"), /EEXIST/);

  const artifactPath = await writePrivateArtifact(captureDirectory, "proof.json", "{\"ok\":true}\n");
  assert.equal((await stat(artifactPath)).mode & 0o777, 0o600);
  assert.equal(await readFile(artifactPath, "utf8"), "{\"ok\":true}\n");
  await assert.rejects(() => writePrivateArtifact(captureDirectory, "proof.json", "overwrite"), /EEXIST/);
  await assert.rejects(() => writePrivateArtifact(captureDirectory, "../leak.json", "leak"), /Unsafe artifact filename/);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

process.stdout.write("Verified rolling-window selection, aggregation guards, exact-URL grouping, path containment, immutable writes, modes, and hashes.\n");
