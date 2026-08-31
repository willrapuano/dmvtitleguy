import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, realpath, rm, stat, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { legacyPathMappings } from "../config/domain-redirects.mjs";
import {
  assertApprovedCanonicalOutput,
  assertCanonicalGitState,
  assertPropertyDailyReconciliation,
  assertUniqueDimensionRows,
  buildCheckpointAnalysis,
  certifyFinalWindow,
  inclusiveDateKeys,
  resolveCheckpointWindow,
  sanitizeUrlForCanonicalArtifact,
  shouldContinuePagination,
  sortRequestRecords,
  validateDateOnly,
} from "./lib/gsc-checkpoint.mjs";
import {
  assertResponseAggregation,
  createPrivateCaptureDirectory,
  sha256,
  writePrivateArtifact,
} from "./lib/gsc-fresh-opportunities.mjs";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIRECTORY, "..");
const config = JSON.parse(await readFile(resolve(REPOSITORY_ROOT, "config", "seo-checkpoints.json"), "utf8"));

assert.equal(validateDateOnly("2026-09-02", "fixture"), "2026-09-02");
assert.throws(() => validateDateOnly("2026-02-30", "fixture"), /real calendar date/);
assert.deepEqual(inclusiveDateKeys("2026-08-27", "2026-09-02"), [
  "2026-08-27",
  "2026-08-28",
  "2026-08-29",
  "2026-08-30",
  "2026-08-31",
  "2026-09-01",
  "2026-09-02",
]);

const weekOne = resolveCheckpointWindow({
  config,
  windowName: "post-week-1",
  captureName: "2026-09-09-post-week-1-final",
  now: new Date("2026-09-09T13:00:00Z"),
});
assert.equal(weekOne.expectedCalendarDays, 7);
assert.equal(weekOne.startDate, "2026-08-27");
assert.equal(weekOne.endDate, "2026-09-02");
assert.equal(weekOne.decisionEligible, false);
assert.equal(weekOne.canonical, true);
assert.match(weekOne.canonicalOutputRelativePath, /2026-09-09-post-week-1-final\.json$/);
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "post-week-1",
  captureName: "too-early",
  now: new Date("2026-09-08T12:00:00Z"),
}), /must not be captured before 2026-09-09/);
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "post-week-1",
  startDateOverride: "2026-08-28",
  captureName: "override",
  now: new Date("2026-09-09T13:00:00Z"),
}), /reject --start overrides/);

const formalPost = resolveCheckpointWindow({
  config,
  windowName: "post",
  captureName: "2026-09-26-post-final",
  now: new Date("2026-09-26T13:00:00Z"),
});
assert.equal(formalPost.expectedCalendarDays, 28);
assert.equal(formalPost.endDate, "2026-09-23");
assert.equal(formalPost.decisionEligible, false);
assert.equal(formalPost.decisionNotBefore, "2026-09-30");
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "post",
  captureName: "post-early",
  now: new Date("2026-09-25T13:00:00Z"),
}), /must not be captured before 2026-09-26/);

const custom = resolveCheckpointWindow({
  config,
  windowName: "custom",
  startDateOverride: "2026-09-03",
  endDateOverride: "2026-09-04",
  captureName: "private-custom",
  now: new Date("2026-09-04T13:00:00Z"),
});
assert.equal(custom.canonical, false);
assert.equal(custom.canonicalOutputRelativePath, null);
assert.equal(custom.decisionEligible, false);
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "custom",
  startDateOverride: "2026-08-27",
  endDateOverride: "2026-09-02",
  captureName: "protected-week-one-custom",
  now: new Date("2026-09-08T13:00:00Z"),
}), /must not be captured before 2026-09-09/);
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "custom",
  startDateOverride: "2026-08-27",
  endDateOverride: "2026-09-23",
  captureName: "protected-post-custom",
  now: new Date("2026-09-25T13:00:00Z"),
}), /must not be captured before 2026-09-26/);
assert.throws(() => resolveCheckpointWindow({
  config,
  windowName: "custom",
  startDateOverride: "2026-08-25",
  endDateOverride: "2026-08-27",
  captureName: "contains-washout",
}), /must exclude washout date 2026-08-26/);

assert.deepEqual(certifyFinalWindow({
  window: weekOne,
  completenessMetadata: [{ firstIncompleteDate: "2026-09-03" }],
}), {
  certifiedFinal: true,
  firstIncompleteDate: "2026-09-03",
  finalDataThrough: "2026-09-02",
  expectedCalendarDays: 7,
});
assert.throws(() => certifyFinalWindow({
  window: weekOne,
  completenessMetadata: [{ firstIncompleteDate: "2026-09-02" }],
}), /incomplete beginning 2026-09-02/);

assert.doesNotThrow(() => assertResponseAggregation("byProperty", "byProperty", "fixture"));
assert.throws(() => assertResponseAggregation("byPage", "byProperty", "fixture"), /unexpected aggregation/);
assert.equal(shouldContinuePagination(25_000), true);
assert.equal(shouldContinuePagination(24_999), true);
assert.equal(shouldContinuePagination(1), true);
assert.equal(shouldContinuePagination(0), false);
assert.throws(() => shouldContinuePagination(25_001), /exceeds/);
assert.deepEqual(sortRequestRecords([
  { name: "z", request: { startRow: 0 } },
  { name: "a", request: { startRow: 25_000 } },
  { name: "a", request: { startRow: 0 } },
]).map((row) => `${row.name}:${row.request.startRow}`), ["a:0", "a:25000", "z:0"]);
assert.doesNotThrow(() => assertCanonicalGitState(true, ""));
assert.throws(() => assertCanonicalGitState(true, " M package.json"), /clean Git working tree/);
assert.doesNotThrow(() => assertCanonicalGitState(false, " M package.json"));

const dailyImpressions = [10, 15, 15, 15, 15, 15, 15];
const dailyRows = weekOne.dates.map((date, index) => ({
  keys: [date],
  clicks: index < 2 ? 1 : 0,
  impressions: dailyImpressions[index],
  ctr: 0,
  position: 20,
}));
assert.deepEqual(assertPropertyDailyReconciliation([
  { clicks: 2, impressions: 100, ctr: 0.02, position: 20 },
], dailyRows).property, {
  clicks: 2,
  impressions: 100,
  ctr: 0.02,
  position: 20,
});
assert.throws(() => assertPropertyDailyReconciliation([
  { clicks: 2, impressions: 101, ctr: 0, position: 20 },
], dailyRows), /impressions do not reconcile/);

const mcleanQuery = "title company in mclean";
const silverSpringQuery = "title company in silver spring";
const privateSentinelQuery = "sentinel-private-query-7ff2";
const canonicalMclean = "https://dmvtitleguy.io/title-company-mclean-va";
const legacyMclean = "http://www.dmvtitleguy.io/title-company-mclean-va";
const canonicalSilverSpring = "https://dmvtitleguy.io/title-company-silver-spring-md";
const redirectSilverSpring = "https://dmvtitleguy.io/title-company/silver-spring-md";
const unsafeParameterized = "https://dmvtitleguy.io/contact?email=sentinel-private-url-7ff2";

const queryRows = [
  { keys: [mcleanQuery], clicks: 1, impressions: 10, ctr: 0.1, position: 15 },
  { keys: [silverSpringQuery], clicks: 0, impressions: 10, ctr: 0, position: 7 },
  { keys: [privateSentinelQuery], clicks: 0, impressions: 5, ctr: 0, position: 30 },
];
const queryDateRows = [
  { keys: [weekOne.dates[0], mcleanQuery], clicks: 1, impressions: 5, position: 15 },
  { keys: [weekOne.dates[1], mcleanQuery], clicks: 0, impressions: 5, position: 15 },
  { keys: [weekOne.dates[0], silverSpringQuery], clicks: 0, impressions: 5, position: 7 },
  { keys: [weekOne.dates[1], silverSpringQuery], clicks: 0, impressions: 5, position: 7 },
  { keys: [weekOne.dates[0], privateSentinelQuery], clicks: 0, impressions: 5, position: 30 },
];
const pageRows = [
  { keys: [canonicalMclean], clicks: 1, impressions: 7, ctr: 1 / 7, position: 15 },
  { keys: [legacyMclean], clicks: 0, impressions: 3, ctr: 0, position: 17 },
  { keys: [canonicalSilverSpring], clicks: 0, impressions: 10, ctr: 0, position: 7 },
  { keys: [redirectSilverSpring], clicks: 0, impressions: 2, ctr: 0, position: 8 },
  { keys: [unsafeParameterized], clicks: 0, impressions: 5, ctr: 0, position: 30 },
];
const queryPageRows = [
  { keys: [mcleanQuery, canonicalMclean], clicks: 1, impressions: 7, ctr: 1 / 7, position: 15 },
  { keys: [mcleanQuery, legacyMclean], clicks: 0, impressions: 3, ctr: 0, position: 17 },
  { keys: [silverSpringQuery, canonicalSilverSpring], clicks: 0, impressions: 10, ctr: 0, position: 7 },
  { keys: [silverSpringQuery, redirectSilverSpring], clicks: 0, impressions: 2, ctr: 0, position: 8 },
  { keys: [privateSentinelQuery, unsafeParameterized], clicks: 0, impressions: 5, ctr: 0, position: 30 },
];
const queryPageDateRows = [
  { keys: [weekOne.dates[0], mcleanQuery, canonicalMclean], clicks: 1, impressions: 4, position: 15 },
  { keys: [weekOne.dates[1], mcleanQuery, canonicalMclean], clicks: 0, impressions: 3, position: 15 },
  { keys: [weekOne.dates[0], mcleanQuery, legacyMclean], clicks: 0, impressions: 2, position: 17 },
  { keys: [weekOne.dates[1], mcleanQuery, legacyMclean], clicks: 0, impressions: 1, position: 17 },
  { keys: [weekOne.dates[0], silverSpringQuery, canonicalSilverSpring], clicks: 0, impressions: 5, position: 7 },
  { keys: [weekOne.dates[1], silverSpringQuery, canonicalSilverSpring], clicks: 0, impressions: 5, position: 7 },
  { keys: [weekOne.dates[0], silverSpringQuery, redirectSilverSpring], clicks: 0, impressions: 1, position: 8 },
  { keys: [weekOne.dates[1], silverSpringQuery, redirectSilverSpring], clicks: 0, impressions: 1, position: 8 },
  { keys: [weekOne.dates[0], privateSentinelQuery, unsafeParameterized], clicks: 0, impressions: 5, position: 30 },
];

const fixture = {
  window: weekOne,
  config,
  propertyRows: [{ clicks: 2, impressions: 100, ctr: 0.02, position: 20 }],
  dailyRows,
  queryRows,
  queryDateRows,
  pageRows,
  queryPageRows,
  queryPageDateRows,
  legacyPathMappings,
  technicalStateByPath: {
    "/title-company-mclean-va": { state: "GREEN", reasons: [] },
    "/title-company-silver-spring-md": { state: "GREEN", reasons: [] },
  },
  requireTechnicalState: true,
  minimumImpressions: 5,
};
const { privateAnalysis, sanitizedAnalysis } = buildCheckpointAnalysis(fixture);
assert.equal(privateAnalysis.visibleQueryCoverage.aggregationType, "byProperty");
assert.equal(privateAnalysis.visibleQueryCoverage.impressions, 25);
assert.equal(privateAnalysis.visibleQueryCoverage.residualAnonymousOrSuppressedImpressions, 75);
assert.equal(privateAnalysis.pageLevelRoutingTotals.aggregationType, "byPage");
assert.equal(privateAnalysis.pageLevelRoutingTotals.coverageComparisonToPropertyProhibited, true);
assert.equal(privateAnalysis.allExactPageMetrics.length, 5);
assert.equal(new Set(privateAnalysis.allExactPageMetrics.map((row) => row.page)).size, 5);
assert.equal(privateAnalysis.indexedUrlDiagnostics.length, 2);
assert.equal(privateAnalysis.routingWatches.length, 1);
assert.equal(privateAnalysis.routingWatches[0].secondaryShare, 0.3);
assert.equal(privateAnalysis.redirectSourceWatches.length, 1);
assert.equal(privateAnalysis.redirectSourceWatches[0].mappedDestination, "/title-company-silver-spring-md");
assert.ok(privateAnalysis.pathIntentDocket.some((row) => row.normalizedPath === "/title-company-mclean-va" && row.status === "WATCH_ROUTING"));
assert.ok(privateAnalysis.pathIntentDocket.some((row) => row.normalizedPath === "/title-company-silver-spring-md" && row.status === "PROTECT_NO_CHANGE"));
assert.ok(!privateAnalysis.pathIntentDocket.some((row) => row.normalizedPath === "/title-company/silver-spring-md"));
assert.ok(privateAnalysis.pageLevelRoutingTotals.normalizedPathByFrozenCluster);
assert.ok(config.priorityPaths.every((path) => privateAnalysis.pathIntentDocket.some((row) => row.normalizedPath === path)));
const sanitizedFixture = JSON.stringify(sanitizedAnalysis);
assert.ok(!sanitizedFixture.includes(privateSentinelQuery), "Sanitized analysis leaked raw query text");
assert.ok(!sanitizedFixture.includes("sentinel-private-url-7ff2"), "Sanitized analysis leaked unsafe URL parameters");

const heldAnalysis = buildCheckpointAnalysis({
  ...fixture,
  queryPageRows: queryPageRows.filter((row) => row.keys[1] !== legacyMclean),
  queryPageDateRows: queryPageDateRows.filter((row) => row.keys[2] !== legacyMclean),
  technicalStateByPath: {
    ...fixture.technicalStateByPath,
    "/title-company-mclean-va": { state: "HOLD_TECHNICAL", reasons: ["google-canonical-mismatch"] },
  },
}).privateAnalysis;
assert.ok(heldAnalysis.pathIntentDocket.some((row) => row.normalizedPath === "/title-company-mclean-va" && row.status === "HOLD_TECHNICAL"));

assert.throws(() => buildCheckpointAnalysis({
  ...fixture,
  queryRows: [{ keys: ["too much"], clicks: 3, impressions: 101, position: 1 }],
  queryDateRows: [{ keys: [weekOne.dates[0], "too much"], clicks: 3, impressions: 101, position: 1 }],
}), /Visible-query clicks exceed|Visible-query impressions exceed/);
assert.throws(() => assertUniqueDimensionRows([
  { keys: ["same"] },
  { keys: ["same"] },
], "duplicate-boundary"), /duplicate dimension key/);
const duplicatePrivateSentinel = "sentinel-duplicate-query-and-url-8ee4";
let duplicateError;
try {
  assertUniqueDimensionRows([
    { keys: [duplicatePrivateSentinel, `https://dmvtitleguy.io/?token=${duplicatePrivateSentinel}`] },
    { keys: [duplicatePrivateSentinel, `https://dmvtitleguy.io/?token=${duplicatePrivateSentinel}`] },
  ], "private-duplicate");
} catch (error) {
  duplicateError = error;
}
assert.ok(duplicateError);
assert.ok(!String(duplicateError.message).includes(duplicatePrivateSentinel), "Duplicate-row error leaked private dimensions");

const unsafeTechnicalSentinel = "sentinel-technical-url-91bd";
const fullySanitizedFixture = JSON.stringify({
  ...sanitizedAnalysis,
  sitemaps: [{
    url: sanitizeUrlForCanonicalArtifact(`https://dmvtitleguy.io/sitemap.xml?token=${unsafeTechnicalSentinel}`, "https://dmvtitleguy.io"),
  }],
  priorityUrlInspection: [{
    path: "/why-choose-us",
    googleCanonical: sanitizeUrlForCanonicalArtifact(`https://dmvtitleguy.io/why-choose-us?token=${unsafeTechnicalSentinel}`, "https://dmvtitleguy.io"),
    userCanonical: sanitizeUrlForCanonicalArtifact(`https://other.example/${unsafeTechnicalSentinel}`, "https://dmvtitleguy.io"),
  }],
});
assert.ok(!fullySanitizedFixture.includes(unsafeTechnicalSentinel), "Canonical manifest fixture leaked a technical URL sentinel");
assert.ok(fullySanitizedFixture.includes('"publicUrl":null'));

const approvedOutput = assertApprovedCanonicalOutput(REPOSITORY_ROOT, "docs/gsc-checkpoints/2026-09-09-post-week-1-final.json");
assert.equal(dirname(approvedOutput), resolve(REPOSITORY_ROOT, "docs", "gsc-checkpoints"));
assert.throws(() => assertApprovedCanonicalOutput(REPOSITORY_ROOT, "../outside-final.json"), /direct child/);
assert.throws(() => assertApprovedCanonicalOutput(REPOSITORY_ROOT, "docs/gsc-checkpoints/not-final.txt"), /final JSON filename/);

const temporaryRoot = await mkdtemp(join(tmpdir(), "dmv-gsc-checkpoint-"));
try {
  const privateRootConfigured = resolve(temporaryRoot, "private-seo", "gsc");
  const captureDirectory = await createPrivateCaptureDirectory(privateRootConfigured, "fixture-capture");
  assert.equal((await stat(privateRootConfigured)).mode & 0o777, 0o700);
  assert.equal((await stat(captureDirectory)).mode & 0o777, 0o700);
  await assert.rejects(() => createPrivateCaptureDirectory(privateRootConfigured, "fixture-capture"), /EEXIST/);

  const privateRoot = await realpath(privateRootConfigured);
  await symlink(captureDirectory, join(privateRoot, "linked-capture"));
  await assert.rejects(() => createPrivateCaptureDirectory(privateRootConfigured, "linked-capture"), /EEXIST/);
  await assert.rejects(() => createPrivateCaptureDirectory(privateRootConfigured, "../escape"), /safe single path segment/);

  const artifactContent = "{\"status\":\"DESCRIPTIVE_ONLY_NO_PERFORMANCE_EDIT\"}\n";
  const artifactPath = await writePrivateArtifact(captureDirectory, "manifest-sanitized.json", artifactContent);
  assert.equal((await stat(artifactPath)).mode & 0o777, 0o600);
  assert.equal(await readFile(artifactPath, "utf8"), artifactContent);
  assert.equal(sha256(artifactContent), sha256(await readFile(artifactPath)));
  await assert.rejects(() => writePrivateArtifact(captureDirectory, "manifest-sanitized.json", "overwrite"), /EEXIST/);
  await assert.rejects(() => writePrivateArtifact(captureDirectory, "../leak.json", "leak"), /Unsafe artifact filename/);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

const checkpointSource = await readFile(resolve(SCRIPT_DIRECTORY, "snapshot-gsc-checkpoint.mjs"), "utf8");
for (const requiredSource of [
  'searchAnalytics("final-property-total", [], "final", "byProperty")',
  'searchAnalytics("final-property-daily", ["date"], "final", "byProperty")',
  'searchAnalytics("final-query", ["query"], "final", "byProperty")',
  'searchAnalytics("final-page", ["page"], "final", "byPage")',
  'searchAnalytics("final-query-page", ["query", "page"], "final", "byPage")',
  'type: "web"',
  'flag: "wx"',
  "createPrivateCaptureDirectory",
  "generatorCodeArtifacts",
]) {
  assert.ok(checkpointSource.includes(requiredSource), `Checkpoint source is missing required control: ${requiredSource}`);
}
assert.ok(!checkpointSource.includes('aggregationType: "auto"'), "Checkpoint source must not use automatic aggregation");
assert.equal(sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");

function runInvalidCli(argumentsList) {
  return spawnSync(process.execPath, [resolve(SCRIPT_DIRECTORY, "snapshot-gsc-checkpoint.mjs"), ...argumentsList], {
    cwd: REPOSITORY_ROOT,
    env: { ...process.env, GSC_SERVICE_ACCOUNT_PATH: "" },
    encoding: "utf8",
  });
}

const oddCli = runInvalidCli(["--window"]);
assert.notEqual(oddCli.status, 0);
assert.match(oddCli.stderr, /--name value pairs/);
const unknownCli = runInvalidCli(["--bogus", "value"]);
assert.notEqual(unknownCli.status, 0);
assert.match(unknownCli.stderr, /Unsupported argument/);
const overrideCli = runInvalidCli([
  "--window", "post-week-1",
  "--start", "2026-08-28",
  "--capture-name", "override",
]);
assert.notEqual(overrideCli.status, 0);
assert.match(overrideCli.stderr, /reject --start overrides/);

process.stdout.write("Verified final GSC checkpoint windows, grains, finality, exact URLs, privacy, immutability, provenance controls, and sanitized output.\n");
