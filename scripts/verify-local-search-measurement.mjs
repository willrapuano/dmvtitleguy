import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { buildLocalBatchReport, evidenceManifestSha256, normalizeLocalObservation, persistLocalBatchReport } from "./lib/local-search-measurement.mjs";

const config = JSON.parse(await readFile("config/local-search-measurement.json", "utf8"));
const observationDirectory = resolve("docs/local-search-checkpoints/observations");

assert.equal(config.policy.mode, "measure-only", "local measurement must remain read-only");
assert.equal(config.policy.automatedGoogleSerpScraping, false, "Google result scraping must not be automated");
assert.equal(config.policy.profileMutationsAuthorized, false, "measurement cannot authorize a profile edit");
assert.equal(config.businessProfilePerformance.rankAvailable, false, "GBP performance must not be represented as a rank feed");
assert.equal(config.businessProfilePerformance.automationEnabled, false, "GBP API capture must stay disabled while access and policy blockers remain");
assert.equal(config.businessProfilePerformance.contentPolicy.defaultStorageMode, "in-memory-no-storage", "GBP API Content must default to no storage");
assert.equal(config.businessProfilePerformance.contentPolicy.limitedCachePurpose, "only to improve the GBP API project's performance", "GBP API Content cache purpose is overbroad");
assert.equal(config.businessProfilePerformance.contentPolicy.maxStorageDays, 30, "GBP API Content retention exceeds Google's stated limit");
assert.equal(config.businessProfilePerformance.contentPolicy.aggregationAllowed, false, "GBP API Content cannot be aggregated under the current policy");
assert.equal(config.businessProfilePerformance.contentPolicy.committedApiContentAllowed, false, "GBP API Content must not enter committed scorecards");
assert.ok(config.businessProfilePerformance.supportedMetricsForAuthorizedTransientReview.includes("BUSINESS_BOOKINGS"), "GBP bookings enum is invalid");
assert.ok(config.businessProfilePerformance.profileDependentMetricsToProbeAfterAuthorization.includes("BUSINESS_CONVERSATIONS"), "profile-dependent message availability is not modeled");
assert.equal(config.eligibilityAndAuthorityGates.practitionerEligibilityReview.status, "required-blocking", "practitioner eligibility review is not blocking profile changes");
assert.equal(config.eligibilityAndAuthorityGates.dataSharingLinkAuthorized, false, "GA4 data sharing cannot be inferred from profile access");
assert.equal(config.targetProfile.stableIdentity.resolutionState, "resolved-public-read-only", "stable public target identity is unresolved");
assert.match(config.targetProfile.stableIdentity.value, /^ChIJ/, "target Google Place ID is invalid");
assert.equal(config.websiteAttribution.firstChannel, "google-business-profile", "GBP website attribution has no dedicated channel");
assert.match(config.websiteAttribution.profileWebsiteUrl, /utm_source=google.*utm_medium=organic.*utm_campaign=gbp.*utm_content=profile-website-button/, "GBP UTM convention changed");
assert.match(config.websiteAttribution.classifierStatus, /^production-active-qa-verified-/, "GBP classifier status is stale after production QA");
assert.match(config.websiteAttribution.verifiedDeploymentId, /^dpl_/, "GBP classifier has no verified production deployment");
assert.match(config.websiteAttribution.verifiedQaSubmissionId, /^[0-9a-f-]{36}$/i, "GBP classifier has no verified QA submission");

const observationFiles = (await readdir(observationDirectory)).filter((file) => file.endsWith(".json")).sort();
assert.ok(observationFiles.length, "no local-search observations are committed");
const observations = [];
const observationIds = new Set();
for (const file of observationFiles) {
  const observation = JSON.parse(await readFile(resolve(observationDirectory, file), "utf8"));
  assert.equal(file, `${observation.observationId}.json`, `${file} does not match observationId`);
  assert.ok(!observationIds.has(observation.observationId), `duplicate observationId: ${observation.observationId}`);
  observationIds.add(observation.observationId);
  assert.equal(observation.measurementVersion, config.measurementVersion, `${file} uses a stale measurement version`);
  assert.deepEqual(observation, normalizeLocalObservation(observation, config), `${file} is not canonical or its protocol result is stale`);
  observations.push(observation);
}

const discovery = observations.find((item) => item.observationId === "2026-08-27-user-mobile-screenshot");
assert.ok(discovery, "August 27 discovery evidence is missing");
assert.equal(discovery.protocolValidity.protocolValid, false, "the screenshot cannot be a controlled baseline without its query and geo");
assert.ok(discovery.protocolValidity.exclusionReasons.includes("missing:search.query"), "screenshot is not marked query-unknown");
assert.ok(discovery.protocolValidity.exclusionReasons.includes("target-stable-identity-mismatch"), "screenshot is not blocked because its stable identity was not captured");
assert.equal(discovery.evidence.files[0].sha256, "462e1cc655421ffddcd2d98ec94417fe2284719a34eb2baddc2409b6596bc513", "screenshot evidence hash changed");
assert.equal(discovery.target.visibleOrdinalInCapturedSequence, 3, "captured sequence changed");
assert.equal(discovery.interpretation.controlOrOwnershipInferred, false, "public evidence cannot prove profile control or ownership");

let originatingHost = false;
try {
  await access("private-seo/local-search/.evidence-origin-host");
  originatingHost = true;
} catch {
  // A clean clone can verify committed manifests without claiming it possesses private evidence.
}
if (originatingHost) {
  assert.equal((await stat("private-seo/local-search")).mode & 0o777, 0o700, "private local-search directory must be mode 0700");
  assert.equal((await stat("private-seo/local-search/evidence")).mode & 0o777, 0o700, "private evidence directory must be mode 0700");
  for (const observation of observations) {
    for (const file of observation.evidence.files) {
      const bytes = await readFile(file.privatePath);
      assert.equal(bytes.byteLength, file.bytes, `${file.privatePath} byte count changed`);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, `${file.privatePath} hash changed`);
      assert.equal((await stat(file.privatePath)).mode & 0o777, 0o600, `${file.privatePath} must be mode 0600`);
    }
  }
}

const recorderSource = await readFile("scripts/record-local-search-observation.mjs", "utf8");
assert.match(recorderSource, /at least one --evidence/, "recorder does not require file-backed evidence");
assert.match(recorderSource, /observation already exists; corrections require a new observationId/, "recorder can overwrite an existing observation");
assert.match(recorderSource, /COPYFILE_EXCL/, "recorder does not reserve evidence exclusively");
assert.match(recorderSource, /input must be under private-seo\/local-search/, "recorder accepts non-private input");
assert.doesNotMatch(recorderSource, /--force/, "recorder exposes a chain-of-custody overwrite flag");

const fixtureConfig = structuredClone(config);
fixtureConfig.targetProfile.stableIdentity = { type: "google-maps-share-url", value: "https://maps.app.goo.gl/fixture", resolutionState: "resolved-fixture" };

function validInput({
  observationId = "fixture",
  queryId = "title-company-near-me",
  marketCellId = "tysons-office",
  resultSurface = "google-local-pack",
  visibilityStatus = "visible",
  ordinal = 3,
  batchId = "2026-W35",
  capturedAt = "2026-08-26T09:15:00-04:00",
  coordinateOffset = 0,
} = {}) {
  const query = fixtureConfig.searchProtocol.queries.find((item) => item.id === queryId);
  const cell = fixtureConfig.searchProtocol.marketCells.find((item) => item.id === marketCellId);
  const contract = fixtureConfig.searchProtocol.surfaceContracts[resultSurface];
  const sequence = Array.from({ length: contract.scanDepth }, (_, index) => ({
    displayNameAsObserved: visibilityStatus === "visible" && index + 1 === ordinal ? fixtureConfig.targetProfile.displayNameAsObserved : `Fixture Business ${index + 1}`,
    stableIdentityKeyAsObserved: visibilityStatus === "visible" && index + 1 === ordinal ? fixtureConfig.targetProfile.stableIdentity.value : null,
    sponsored: false,
    openStateAsObserved: "open",
  }));
  const files = [{
    privatePath: `private-seo/local-search/evidence/${observationId}/01-${"a".repeat(16)}.jpg`,
    sha256: "a".repeat(64),
    bytes: 100,
    widthPx: 390,
    heightPx: 844,
  }];
  return {
    observationId,
    batch: { batchId, daypart: "business-hours-primary", capturedByRole: "measurement-operator" },
    capture: { receivedDate: capturedAt.slice(0, 10), capturedAt, captureTimezone: "America/New_York", source: "controlled-human-observation" },
    search: {
      query: query.query,
      queryId,
      marketCellId,
      geo: { label: cell.label, latitudeRounded3: cell.latitudeRounded3 + coordinateOffset, longitudeRounded3: cell.longitudeRounded3, method: "browser-sensor-pinned", locationProofCaptured: true },
      device: "mobile",
      browserFamily: "Chrome",
      deviceProfile: "mobile-chrome-390x844",
      browserSession: "fresh-private",
      signedInState: "signed-out",
      personalizationState: "minimized",
      locale: "en-US",
      resultSurface,
      scanDepth: contract.scanDepth,
      filtersApplied: false,
      scanStartsAtFirstResult: true,
      scanEvidenceComplete: true,
      sponsoredRowsObserved: 0,
    },
    target: {
      displayNameAsObserved: fixtureConfig.targetProfile.displayNameAsObserved,
      stableIdentityKeyAsObserved: fixtureConfig.targetProfile.stableIdentity.value,
      openStateAsObserved: "open",
      visibilityStatus,
      visibleOrdinalInCapturedSequence: visibilityStatus === "visible" ? ordinal : null,
    },
    observedSequence: sequence,
    evidence: {
      sourceType: "screenshot-bundle",
      files,
      manifestSha256: evidenceManifestSha256(files),
      verifiedAtRecordTime: true,
      recorderVersion: "record-local-search-observation-v1",
    },
  };
}

function expectInvalid(mutator, reason) {
  const input = validInput();
  mutator(input);
  const result = normalizeLocalObservation(input, fixtureConfig).protocolValidity;
  assert.equal(result.protocolValid, false, `${reason} incorrectly passed protocol validation`);
  assert.ok(result.exclusionReasons.includes(reason), `${reason} was not reported: ${result.exclusionReasons.join(", ")}`);
}

const validPack = normalizeLocalObservation(validInput(), fixtureConfig);
assert.equal(validPack.protocolValidity.protocolValid, true, validPack.protocolValidity.exclusionReasons.join(", "));
assert.match(validPack.protocolValidity.comparisonKey, /google-local-pack/);
const validFinder = normalizeLocalObservation(validInput({ resultSurface: "google-local-finder" }), fixtureConfig);
assert.equal(validFinder.protocolValidity.protocolValid, true, validFinder.protocolValidity.exclusionReasons.join(", "));
assert.notEqual(validPack.protocolValidity.comparisonKey, validFinder.protocolValidity.comparisonKey, "Pack and Finder comparison keys must differ");

expectInvalid((input) => { input.search.geo.latitudeRounded3 = 0; input.search.geo.longitudeRounded3 = 0; }, "latitude-outside-market-cell-tolerance");
expectInvalid((input) => { input.capture.source = "automated-scraper"; }, "capture-source-not-controlled-human");
expectInvalid((input) => { input.capture.capturedAt = "2099-01-01T09:00:00-05:00"; }, "capture-timestamp-in-future");
expectInvalid((input) => { input.target.displayNameAsObserved = "Different Business"; }, "target-display-name-mismatch");
expectInvalid((input) => { input.evidence.files = []; input.evidence.manifestSha256 = null; input.evidence.verifiedAtRecordTime = false; }, "evidence-files-missing");
expectInvalid((input) => { input.search.resultSurface = "google-local-pack"; input.search.scanDepth = 20; }, "scan-depth-does-not-match-surface");
expectInvalid((input) => { input.target.visibilityStatus = "not-visible"; input.target.visibleOrdinalInCapturedSequence = 3; }, "not-visible-observation-has-ordinal");
expectInvalid((input) => { input.search.filtersApplied = true; }, "filters-not-confirmed-off");
expectInvalid((input) => { input.observedSequence = []; }, "observed-sequence-does-not-cover-surface");
expectInvalid((input) => { input.observedSequence[2].stableIdentityKeyAsObserved = null; }, "target-stable-identity-sequence-mismatch");
expectInvalid((input) => { input.target.openStateAsObserved = "maybe"; }, "target-open-state-invalid");
expectInvalid((input) => { input.capture.capturedAt = "2026-08-26T18:19:00-04:00"; }, "capture-time-not-primary-window");
expectInvalid((input) => { input.observedSequence[0].sponsored = true; }, "sponsored-row-count-sequence-mismatch");
expectInvalid((input) => { input.observedSequence[0].sponsored = true; input.search.sponsoredRowsObserved = 1; }, "sponsored-rows-confound-surface");
expectInvalid((input) => { input.batch.daypart = "after-hours-diagnostic"; }, "daypart-not-in-protocol");

function batchFixtures(batchId, capturedAt, coordinateOffset = 0) {
  return fixtureConfig.searchProtocol.observationMatrix.flatMap((row) => row.eligibleCellIds.map((marketCellId, index) => normalizeLocalObservation(validInput({
    observationId: `${batchId}-${row.queryId}-${marketCellId}-${index}`,
    queryId: row.queryId,
    marketCellId,
    batchId,
    capturedAt,
    coordinateOffset,
  }), fixtureConfig)));
}

const batchObservations = batchFixtures("2026-W35", "2026-08-26T09:15:00-04:00");
const completeReport = buildLocalBatchReport(batchObservations, fixtureConfig, "2026-W35");
assert.equal(completeReport.completeness.complete, true, JSON.stringify(completeReport.completeness));
assert.equal(completeReport.completeness.expectedObservations, 12, "frozen primary matrix changed unexpectedly");
assert.equal(completeReport.decisionState, "baseline-collection-no-optimization");
assert.equal(completeReport.metrics.packPositionByComparisonKey.length, 12, "per-key pack measurements are missing");
assert.match(completeReport.comparisonKeySetSha256, /^[a-f0-9]{64}$/);
const incompleteReport = buildLocalBatchReport(batchObservations.slice(1), fixtureConfig, "2026-W35");
assert.equal(incompleteReport.completeness.complete, false, "missing samples must block decisions");
assert.equal(incompleteReport.decisionState, "incomplete-no-decision");

const invalidExtra = normalizeLocalObservation(validInput({ observationId: "invalid-extra" }), fixtureConfig);
invalidExtra.protocolValidity = { protocolValid: false, comparisonKey: null, exclusionReasons: ["adversarial-invalid-extra"] };
const invalidExtraReport = buildLocalBatchReport([...batchObservations, invalidExtra], fixtureConfig, "2026-W35");
assert.equal(invalidExtraReport.completeness.complete, false, "an extra invalid in-scope row must block the batch");
assert.ok(invalidExtraReport.completeness.invalidObservationIds.includes("invalid-extra"));

const allHistoryObservations = [
  ...batchFixtures("2026-W32", "2026-08-05T09:15:00-04:00"),
  ...batchFixtures("2026-W33", "2026-08-12T09:15:00-04:00"),
  ...batchFixtures("2026-W34", "2026-08-19T09:15:00-04:00"),
  ...batchObservations,
];
const reportW32 = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W32");
const reportW33 = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W33", [reportW32]);
const reportW34 = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W34", [reportW32, reportW33]);
const reportW35 = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W35", [reportW32, reportW33, reportW34]);
assert.equal(reportW35.decisionState, "eligible-for-like-for-like-trend-review", "four canonical consecutive batches should unlock trend review");
assert.deepEqual(reportW35.qualifyingConsecutiveBatchIds, ["2026-W32", "2026-W33", "2026-W34", "2026-W35"]);

const duplicateHistory = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W35", [reportW32, reportW32, reportW33, reportW34]);
assert.notEqual(duplicateHistory.decisionState, "eligible-for-like-for-like-trend-review", "duplicate prior reports must not unlock trend review");

const shiftedHistoryObservations = [
  ...batchFixtures("2026-W32", "2026-08-05T09:15:00-04:00"),
  ...batchFixtures("2026-W33", "2026-08-12T09:15:00-04:00"),
  ...batchFixtures("2026-W34", "2026-08-19T09:15:00-04:00", 0.001),
  ...batchObservations,
];
const shiftedW32 = buildLocalBatchReport(shiftedHistoryObservations, fixtureConfig, "2026-W32");
const shiftedW33 = buildLocalBatchReport(shiftedHistoryObservations, fixtureConfig, "2026-W33", [shiftedW32]);
const shiftedW34 = buildLocalBatchReport(shiftedHistoryObservations, fixtureConfig, "2026-W34", [shiftedW32, shiftedW33]);
const shiftedW35 = buildLocalBatchReport(shiftedHistoryObservations, fixtureConfig, "2026-W35", [shiftedW32, shiftedW33, shiftedW34]);
assert.equal(shiftedW35.decisionState, "baseline-collection-no-optimization", "a changed comparison-key set must break the consecutive trend chain");

const persistenceDirectory = await mkdtemp(join(tmpdir(), "dmv-local-report-test-"));
try {
  const savedPath = await persistLocalBatchReport(reportW34, persistenceDirectory);
  assert.equal(savedPath, resolve(persistenceDirectory, "2026-W34.json"), "report was not written to the canonical batch path");
  const savedReport = JSON.parse(await readFile(savedPath, "utf8"));
  assert.equal(savedReport.batchId, "2026-W34", "persisted filename and report batchId diverged");
  const nextReport = buildLocalBatchReport(allHistoryObservations, fixtureConfig, "2026-W35", [savedReport]);
  assert.deepEqual(nextReport.qualifyingConsecutiveBatchIds, ["2026-W34", "2026-W35"], "a persisted prior checkpoint was not consumed by the following week");
  await assert.rejects(
    persistLocalBatchReport(reportW34, persistenceDirectory),
    /batch report already exists.*immutable/,
    "checkpoint persistence allowed an overwrite",
  );
  await assert.rejects(
    persistLocalBatchReport(incompleteReport, persistenceDirectory),
    /incomplete local-search reports cannot be written/,
    "checkpoint persistence accepted an incomplete report",
  );
} finally {
  await rm(persistenceDirectory, { recursive: true, force: true });
}

const reporterSource = await readFile("scripts/report-local-search-checkpoint.mjs", "utf8");
assert.match(reporterSource, /--write/, "checkpoint reporter has no canonical persistence mode");
assert.match(reporterSource, /does not match its report batchId/, "checkpoint reporter does not validate filename/batch identity");

const runbook = await readFile("docs/local-search-measurement-2026-08-27.md", "utf8");
for (const required of ["does not support: a controlled rank", "separate from GSC CTR", "call-button clicks", "in-memory", "GA4", "eligibility", "--write", "immutable"]) {
  assert.ok(runbook.toLowerCase().includes(required.toLowerCase()), `local-search runbook is missing: ${required}`);
}

console.log(`Local-search measurement gate passed: ${config.searchProtocol.queries.length} frozen queries, ${config.searchProtocol.marketCells.length} frozen geo anchors, ${completeReport.completeness.expectedObservations} required pack samples per complete batch, and ${observationFiles.length} canonical discovery record`);
