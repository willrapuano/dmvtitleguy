import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, open, unlink } from "node:fs/promises";
import { basename, resolve } from "node:path";

const UNKNOWN_VALUES = new Set(["", "unknown", "unrecorded", "not-recorded"]);

function valueAtPath(value, path) {
  return path.split(".").reduce((current, key) => current?.[key], value);
}

function isKnown(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return !UNKNOWN_VALUES.has(value.trim().toLowerCase());
  return true;
}

function cleanText(value, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : null;
}

function numericValue(value) {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") return null;
  if (typeof value === "string" && value.trim() !== value) return null;
  if (!new Set(["string", "number"]).has(typeof value)) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function integerValue(value) {
  const number = numericValue(value);
  return Number.isInteger(number) ? number : null;
}

function roundedCoordinate(value) {
  const number = numericValue(value);
  return number === null ? null : Number(number.toFixed(3));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function evidenceManifestSha256(files) {
  const manifest = files.map((file) => ({ privatePath: file.privatePath, sha256: file.sha256, bytes: file.bytes }));
  return sha256(JSON.stringify(manifest));
}

function queryDefinition(input, config) {
  return config.searchProtocol.queries.find((item) => item.id === input.search?.queryId) || null;
}

function marketCell(input, config) {
  return config.searchProtocol.marketCells.find((item) => item.id === input.search?.marketCellId) || null;
}

function comparisonKey(input, config) {
  return [
    config.measurementVersion,
    input.search.queryId,
    input.search.marketCellId,
    `${Number(input.search.geo.latitudeRounded3).toFixed(3)},${Number(input.search.geo.longitudeRounded3).toFixed(3)}`,
    input.search.resultSurface,
    input.search.deviceProfile,
    input.search.locale,
    input.batch.daypart,
    "filters-none",
  ].join("|");
}

function zonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((item) => item.type !== "literal").map((item) => [item.type, item.value]));
}

function isoWeekId(year, month, day) {
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86_400_000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function assessLocalObservation(input, config) {
  const reasons = [];
  for (const field of config.searchProtocol.requiredProtocolFields) {
    if (!isKnown(valueAtPath(input, field))) reasons.push(`missing:${field}`);
  }

  const definition = queryDefinition(input, config);
  if (isKnown(input.search?.queryId) && !definition) reasons.push("query-id-not-in-frozen-universe");
  if (definition && cleanText(input.search?.query)?.toLowerCase() !== definition.query.toLowerCase()) reasons.push("query-does-not-match-query-id");

  const cell = marketCell(input, config);
  if (isKnown(input.search?.marketCellId) && !cell) reasons.push("market-cell-not-in-frozen-universe");
  if (definition && cell) {
    const matrix = config.searchProtocol.observationMatrix.find((item) => item.queryId === definition.id);
    if (!matrix?.eligibleCellIds.includes(cell.id)) reasons.push("query-cell-pair-not-in-frozen-matrix");
    const latitude = numericValue(input.search?.geo?.latitudeRounded3);
    const longitude = numericValue(input.search?.geo?.longitudeRounded3);
    const tolerance = config.searchProtocol.coordinateToleranceDegrees;
    if (latitude !== null && Math.abs(latitude - cell.latitudeRounded3) > tolerance) reasons.push("latitude-outside-market-cell-tolerance");
    if (longitude !== null && Math.abs(longitude - cell.longitudeRounded3) > tolerance) reasons.push("longitude-outside-market-cell-tolerance");
  }

  if (input.capture?.source !== "controlled-human-observation") reasons.push("capture-source-not-controlled-human");
  if (input.search?.signedInState !== "signed-out") reasons.push("search-session-not-signed-out");
  if (input.search?.browserSession !== "fresh-private") reasons.push("browser-session-not-fresh-private");
  if (input.search?.filtersApplied !== false) reasons.push("filters-not-confirmed-off");
  if (input.search?.scanStartsAtFirstResult !== true) reasons.push("scan-start-not-confirmed");
  if (input.search?.scanEvidenceComplete !== true) reasons.push("scan-evidence-incomplete");
  if (input.search?.geo?.locationProofCaptured !== true) reasons.push("location-proof-not-captured");

  const capturedAt = input.capture?.capturedAt;
  if (isKnown(capturedAt)) {
    const parsed = Date.parse(capturedAt);
    if (!Number.isFinite(parsed) || !/(Z|[+-]\d{2}:\d{2})$/.test(capturedAt)) reasons.push("capture-timestamp-invalid-or-timezone-missing");
    else if (parsed > Date.now() + 5 * 60 * 1000) reasons.push("capture-timestamp-in-future");
    else if (input.batch?.daypart === config.searchProtocol.cadence.primaryDaypart) {
      const parts = zonedParts(new Date(parsed), config.searchProtocol.cadence.timezone);
      const [startHour, startMinute] = config.searchProtocol.cadence.localTimeWindow.split("-")[0].split(":").map(Number);
      const [endHour, endMinute] = config.searchProtocol.cadence.localTimeWindow.split("-")[1].split(":").map(Number);
      const minutes = Number(parts.hour) * 60 + Number(parts.minute);
      if (parts.weekday !== config.searchProtocol.cadence.dayOfWeek) reasons.push("capture-day-not-primary-cadence");
      if (minutes < startHour * 60 + startMinute || minutes > endHour * 60 + endMinute) reasons.push("capture-time-not-primary-window");
      if (input.batch?.batchId !== isoWeekId(parts.year, parts.month, parts.day)) reasons.push("batch-id-does-not-match-capture-week");
      if (input.capture?.captureTimezone !== config.searchProtocol.cadence.timezone) reasons.push("capture-timezone-does-not-match-primary-cadence");
    }
  }
  if (isKnown(input.capture?.captureTimezone)) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: input.capture.captureTimezone }).format();
    } catch {
      reasons.push("capture-timezone-invalid");
    }
  }
  if (isKnown(input.batch?.daypart) && !config.searchProtocol.cadence.allowedDayparts.includes(input.batch.daypart)) reasons.push("daypart-not-in-protocol");

  const latitude = numericValue(input.search?.geo?.latitudeRounded3);
  const longitude = numericValue(input.search?.geo?.longitudeRounded3);
  if (latitude !== null && (latitude < -90 || latitude > 90)) reasons.push("latitude-out-of-range");
  if (longitude !== null && (longitude < -180 || longitude > 180)) reasons.push("longitude-out-of-range");
  if (isKnown(input.search?.geo?.method) && !config.searchProtocol.allowedGeoMethods.includes(input.search.geo.method)) reasons.push("geo-method-not-in-protocol");

  const deviceProfile = config.searchProtocol.deviceProfiles.find((item) => item.id === input.search?.deviceProfile);
  if (isKnown(input.search?.deviceProfile) && !deviceProfile) reasons.push("device-profile-not-in-protocol");
  if (deviceProfile && (input.search.device !== deviceProfile.device || input.search.browserFamily !== deviceProfile.browserFamily)) reasons.push("device-details-do-not-match-profile");
  if (isKnown(input.search?.locale) && !/^[a-z]{2}-[A-Z]{2}$/.test(input.search.locale)) reasons.push("locale-invalid");

  const surface = config.searchProtocol.surfaceContracts[input.search?.resultSurface];
  if (isKnown(input.search?.resultSurface) && !surface) reasons.push("result-surface-not-in-protocol");
  const scanDepth = integerValue(input.search?.scanDepth);
  if (surface && scanDepth !== surface.scanDepth) reasons.push("scan-depth-does-not-match-surface");
  const sponsoredRows = integerValue(input.search?.sponsoredRowsObserved);
  if (sponsoredRows !== null && sponsoredRows < 0) reasons.push("sponsored-row-count-invalid");

  const targetIdentity = config.targetProfile.stableIdentity;
  if (!targetIdentity.type || !targetIdentity.value) reasons.push("target-stable-identity-unresolved-in-config");
  if (input.target?.displayNameAsObserved !== config.targetProfile.displayNameAsObserved) reasons.push("target-display-name-mismatch");
  if (targetIdentity.value && input.target?.stableIdentityKeyAsObserved !== targetIdentity.value) reasons.push("target-stable-identity-mismatch");
  if (isKnown(input.target?.openStateAsObserved) && !config.searchProtocol.allowedOpenStates.includes(input.target.openStateAsObserved)) reasons.push("target-open-state-invalid");

  const status = input.target?.visibilityStatus;
  const ordinal = integerValue(input.target?.visibleOrdinalInCapturedSequence);
  const sequence = Array.isArray(input.observedSequence) ? input.observedSequence : [];
  const sponsoredSequenceRows = sequence.filter((item) => item?.sponsored === true).length;
  if (sponsoredRows !== sponsoredSequenceRows) reasons.push("sponsored-row-count-sequence-mismatch");
  if (surface?.sponsoredRowsAllowed === false && sponsoredSequenceRows > 0) reasons.push("sponsored-rows-confound-surface");
  if (surface && sequence.length !== surface.scanDepth) reasons.push("observed-sequence-does-not-cover-surface");
  if (sequence.some((item) => !isKnown(item?.displayNameAsObserved))) reasons.push("observed-sequence-identity-missing");
  if (status === "visible") {
    if (!Number.isInteger(ordinal) || ordinal < 1 || (scanDepth !== null && ordinal > scanDepth)) reasons.push("visible-ordinal-invalid");
    if (Number.isInteger(ordinal) && sequence[ordinal - 1]?.displayNameAsObserved !== config.targetProfile.displayNameAsObserved) reasons.push("target-ordinal-sequence-mismatch");
    if (Number.isInteger(ordinal) && targetIdentity.value && sequence[ordinal - 1]?.stableIdentityKeyAsObserved !== targetIdentity.value) reasons.push("target-stable-identity-sequence-mismatch");
  } else if (status === "not-visible") {
    if (ordinal !== null) reasons.push("not-visible-observation-has-ordinal");
    if (sequence.some((item) => item.displayNameAsObserved === config.targetProfile.displayNameAsObserved)) reasons.push("not-visible-observation-contains-target");
  } else {
    reasons.push("visibility-status-invalid");
  }

  const files = Array.isArray(input.evidence?.files) ? input.evidence.files : [];
  if (!files.length) reasons.push("evidence-files-missing");
  for (const file of files) {
    if (!/^private-seo\/local-search\/evidence\//.test(file.privatePath || "")) reasons.push("evidence-path-not-private");
    if (!/^[a-f0-9]{64}$/i.test(file.sha256 || "")) reasons.push("evidence-file-sha256-invalid");
    if (!Number.isInteger(file.bytes) || file.bytes < 1) reasons.push("evidence-file-size-invalid");
  }
  if (!/^[a-f0-9]{64}$/i.test(input.evidence?.manifestSha256 || "")) reasons.push("evidence-manifest-sha256-invalid");
  if (files.length && input.evidence?.manifestSha256 !== evidenceManifestSha256(files)) reasons.push("evidence-manifest-hash-mismatch");
  if (input.evidence?.verifiedAtRecordTime !== true) reasons.push("evidence-not-recorder-verified");
  if (input.evidence?.recorderVersion !== "record-local-search-observation-v1") reasons.push("evidence-recorder-version-invalid");

  const exclusionReasons = [...new Set(reasons)].sort();
  const protocolValid = exclusionReasons.length === 0;
  return { protocolValid, comparisonKey: protocolValid ? comparisonKey(input, config) : null, exclusionReasons };
}

export function normalizeLocalObservation(input, config) {
  const observation = {
    schemaVersion: 1,
    measurementVersion: config.measurementVersion,
    observationId: cleanText(input.observationId, 160),
    purpose: cleanText(input.purpose, 300) || "local-search-visibility-observation",
    batch: {
      batchId: cleanText(input.batch?.batchId, 100),
      daypart: cleanText(input.batch?.daypart, 80),
      capturedByRole: cleanText(input.batch?.capturedByRole, 120),
    },
    capture: {
      receivedDate: cleanText(input.capture?.receivedDate, 10),
      capturedAt: cleanText(input.capture?.capturedAt, 40),
      displayedDeviceTime: cleanText(input.capture?.displayedDeviceTime, 20),
      captureTimezone: cleanText(input.capture?.captureTimezone, 80),
      source: cleanText(input.capture?.source, 120),
    },
    search: {
      query: cleanText(input.search?.query, 200),
      queryId: cleanText(input.search?.queryId, 100),
      marketCellId: cleanText(input.search?.marketCellId, 100),
      geo: {
        label: cleanText(input.search?.geo?.label, 200),
        latitudeRounded3: roundedCoordinate(input.search?.geo?.latitudeRounded3),
        longitudeRounded3: roundedCoordinate(input.search?.geo?.longitudeRounded3),
        method: cleanText(input.search?.geo?.method, 100),
        locationProofCaptured: input.search?.geo?.locationProofCaptured === true ? true : input.search?.geo?.locationProofCaptured === false ? false : null,
      },
      device: cleanText(input.search?.device, 40),
      browserFamily: cleanText(input.search?.browserFamily, 80),
      deviceProfile: cleanText(input.search?.deviceProfile, 100),
      browserSession: cleanText(input.search?.browserSession, 80),
      signedInState: cleanText(input.search?.signedInState, 40),
      personalizationState: cleanText(input.search?.personalizationState, 80),
      locale: cleanText(input.search?.locale, 40),
      resultSurface: cleanText(input.search?.resultSurface, 100),
      scanDepth: integerValue(input.search?.scanDepth),
      filtersApplied: input.search?.filtersApplied === true ? true : input.search?.filtersApplied === false ? false : null,
      scanStartsAtFirstResult: input.search?.scanStartsAtFirstResult === true ? true : input.search?.scanStartsAtFirstResult === false ? false : null,
      scanEvidenceComplete: input.search?.scanEvidenceComplete === true ? true : input.search?.scanEvidenceComplete === false ? false : null,
      sponsoredRowsObserved: integerValue(input.search?.sponsoredRowsObserved),
      visibleControls: Array.isArray(input.search?.visibleControls) ? input.search.visibleControls.map((item) => cleanText(item, 80)).filter(Boolean).slice(0, 20) : [],
    },
    target: {
      displayNameAsObserved: cleanText(input.target?.displayNameAsObserved, 200),
      stableIdentityKeyAsObserved: cleanText(input.target?.stableIdentityKeyAsObserved, 500),
      addressAsObserved: cleanText(input.target?.addressAsObserved, 240),
      categoryAsObserved: cleanText(input.target?.categoryAsObserved, 120),
      ratingAsObserved: numericValue(input.target?.ratingAsObserved),
      reviewCountAsObserved: integerValue(input.target?.reviewCountAsObserved),
      openStateAsObserved: cleanText(input.target?.openStateAsObserved, 80),
      visibilityStatus: cleanText(input.target?.visibilityStatus, 40),
      visibleOrdinalInCapturedSequence: integerValue(input.target?.visibleOrdinalInCapturedSequence),
    },
    observedSequence: Array.isArray(input.observedSequence) ? input.observedSequence.slice(0, 30).map((item, index) => ({
      visibleOrdinalInCapturedSequence: index + 1,
      displayNameAsObserved: cleanText(item?.displayNameAsObserved, 200),
      stableIdentityKeyAsObserved: cleanText(item?.stableIdentityKeyAsObserved, 500),
      sponsored: item?.sponsored === true,
      openStateAsObserved: cleanText(item?.openStateAsObserved, 80),
      ratingAsObserved: numericValue(item?.ratingAsObserved),
      reviewCountAsObserved: integerValue(item?.reviewCountAsObserved),
    })) : [],
    evidence: {
      sourceType: cleanText(input.evidence?.sourceType, 100),
      files: Array.isArray(input.evidence?.files) ? input.evidence.files.slice(0, 30).map((file) => ({
        privatePath: cleanText(file?.privatePath, 500),
        sha256: cleanText(file?.sha256, 64)?.toLowerCase() || null,
        bytes: integerValue(file?.bytes),
        widthPx: integerValue(file?.widthPx),
        heightPx: integerValue(file?.heightPx),
      })) : [],
      manifestSha256: cleanText(input.evidence?.manifestSha256, 64)?.toLowerCase() || null,
      verifiedAtRecordTime: input.evidence?.verifiedAtRecordTime === true,
      recorderVersion: cleanText(input.evidence?.recorderVersion, 100),
    },
    interpretation: {
      supportedStatement: cleanText(input.interpretation?.supportedStatement, 500),
      prohibitedStatement: cleanText(input.interpretation?.prohibitedStatement, 500),
      controlOrOwnershipInferred: false,
    },
  };
  const withValidity = { ...observation, protocolValidity: assessLocalObservation(observation, config) };
  return { ...withValidity, integrity: { metadataSha256: sha256(JSON.stringify(withValidity)) } };
}

function previousIsoWeek(batchId) {
  const match = /^(\d{4})-W(\d{2})$/.exec(batchId || "");
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  const january4 = new Date(Date.UTC(year, 0, 4));
  const january4Weekday = january4.getUTCDay() || 7;
  const monday = new Date(january4);
  monday.setUTCDate(january4.getUTCDate() - january4Weekday + 1 + (week - 1) * 7 - 7);
  return isoWeekId(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate());
}

function localBatchSnapshot(observations, config, batchId) {
  const primarySurface = Object.entries(config.searchProtocol.surfaceContracts).find(([, contract]) => contract.primary)?.[0];
  const expected = config.searchProtocol.observationMatrix.flatMap((row) => row.eligibleCellIds.map((marketCellId) => ({
    queryId: row.queryId,
    marketCellId,
    resultSurface: primarySurface,
    key: `${row.queryId}|${marketCellId}|${primarySurface}`,
  })));
  const rows = observations.filter((item) => item.batch?.batchId === batchId
    && item.batch?.daypart === config.searchProtocol.cadence.primaryDaypart
    && item.search?.resultSurface === primarySurface);
  const validRows = rows.filter((item) => item.protocolValidity?.protocolValid);
  const rowsByKey = new Map();
  for (const row of validRows) {
    const key = `${row.search.queryId}|${row.search.marketCellId}|${row.search.resultSurface}`;
    const list = rowsByKey.get(key) || [];
    list.push(row);
    rowsByKey.set(key, list);
  }
  const missing = expected.filter((item) => !rowsByKey.has(item.key));
  const duplicates = [...rowsByKey.entries()].filter(([, list]) => list.length > 1).map(([key]) => key);
  const invalidObservationIds = rows.filter((item) => !item.protocolValidity?.protocolValid).map((item) => item.observationId);
  const complete = missing.length === 0
    && duplicates.length === 0
    && invalidObservationIds.length === 0
    && rows.length === expected.length
    && validRows.length === expected.length;
  const visible = validRows.filter((item) => item.target.visibilityStatus === "visible");
  const positionCounts = { "1": 0, "2": 0, "3": 0 };
  for (const row of visible) positionCounts[String(row.target.visibleOrdinalInCapturedSequence)] += 1;
  const relatedNames = new Set(config.relatedProfiles.map((item) => item.displayNameAsObserved));
  const relatedProfileAppearances = validRows.reduce((sum, row) => sum + row.observedSequence.filter((item) => relatedNames.has(item.displayNameAsObserved)).length, 0);
  const measurements = validRows.map((row) => ({
    comparisonKey: row.protocolValidity.comparisonKey,
    observationId: row.observationId,
    queryId: row.search.queryId,
    marketCellId: row.search.marketCellId,
    visibilityStatus: row.target.visibilityStatus,
    packPosition: row.target.visibilityStatus === "visible" ? row.target.visibleOrdinalInCapturedSequence : null,
    targetOpenState: row.target.openStateAsObserved,
    sponsoredRowsObserved: row.search.sponsoredRowsObserved,
    relatedProfilesObserved: row.observedSequence.filter((item) => relatedNames.has(item.displayNameAsObserved)).map((item) => item.displayNameAsObserved),
  })).sort((left, right) => left.comparisonKey.localeCompare(right.comparisonKey));
  const comparisonKeySetSha256 = complete ? sha256(JSON.stringify(measurements.map((item) => item.comparisonKey))) : null;
  const sourceObservations = validRows.map((row) => ({
    observationId: row.observationId,
    metadataSha256: row.integrity?.metadataSha256 || null,
  })).sort((left, right) => left.observationId.localeCompare(right.observationId));
  const provenance = {
    measurementVersion: config.measurementVersion,
    lane: "controlled-local-pack",
    batchId,
    expectedObservations: expected.length,
    comparisonKeySetSha256,
    sourceObservations,
  };

  return {
    complete,
    expected,
    rows,
    validRows,
    missing,
    duplicates,
    invalidObservationIds,
    visible,
    positionCounts,
    relatedProfileAppearances,
    measurements,
    comparisonKeySetSha256,
    sourceObservations,
    provenanceSha256: sha256(JSON.stringify(provenance)),
  };
}

export function buildLocalBatchReport(observations, config, batchId, previousReports = []) {
  const snapshot = localBatchSnapshot(observations, config, batchId);
  const reportCounts = new Map();
  for (const report of previousReports) reportCounts.set(report.batchId, (reportCounts.get(report.batchId) || 0) + 1);
  const eligiblePrior = new Map();
  for (const report of previousReports) {
    if (reportCounts.get(report.batchId) !== 1
      || report.batchId === batchId
      || report.schemaVersion !== 1
      || report.measurementVersion !== config.measurementVersion
      || report.lane !== "controlled-local-pack"
      || !report.completeness?.complete) continue;
    const recomputed = localBatchSnapshot(observations, config, report.batchId);
    if (!recomputed.complete
      || recomputed.comparisonKeySetSha256 !== snapshot.comparisonKeySetSha256
      || report.comparisonKeySetSha256 !== recomputed.comparisonKeySetSha256
      || report.provenanceSha256 !== recomputed.provenanceSha256) continue;
    eligiblePrior.set(report.batchId, report);
  }

  const qualifyingBatchIds = snapshot.complete ? [batchId] : [];
  let cursor = previousIsoWeek(batchId);
  while (cursor && eligiblePrior.has(cursor)) {
    qualifyingBatchIds.unshift(cursor);
    cursor = previousIsoWeek(cursor);
  }
  const completeBatches = qualifyingBatchIds.length;

  return {
    schemaVersion: 1,
    measurementVersion: config.measurementVersion,
    batchId,
    generatedAt: new Date().toISOString(),
    lane: "controlled-local-pack",
    completeness: {
      complete: snapshot.complete,
      expectedObservations: snapshot.expected.length,
      receivedObservations: snapshot.rows.length,
      protocolValidObservations: snapshot.validRows.length,
      missing: snapshot.missing,
      duplicateKeys: snapshot.duplicates,
      invalidObservationIds: snapshot.invalidObservationIds,
    },
    metrics: {
      packTopThreeInclusionCount: snapshot.visible.length,
      packTopThreeInclusionShare: snapshot.complete ? Number((snapshot.visible.length / snapshot.expected.length).toFixed(4)) : null,
      packPositionCounts: snapshot.positionCounts,
      packPositionByComparisonKey: snapshot.measurements,
      relatedProfileAppearances: snapshot.relatedProfileAppearances,
    },
    comparisonKeySetSha256: snapshot.comparisonKeySetSha256,
    provenanceSha256: snapshot.provenanceSha256,
    sourceObservations: snapshot.sourceObservations,
    qualifyingConsecutiveBatchIds: qualifyingBatchIds,
    decisionState: !snapshot.complete
      ? "incomplete-no-decision"
      : completeBatches < config.decisionRules.minimumCompleteBaselineBatches
        ? "baseline-collection-no-optimization"
        : completeBatches < config.decisionRules.trendBatchesBeforeOptimization
          ? "directional-only-no-optimization"
          : "eligible-for-like-for-like-trend-review",
    comparisonRule: "Compare only rows with identical protocolValidity.comparisonKey; this report never combines Local Pack, Local Finder, Maps, GSC, or GBP Performance metrics.",
  };
}

export async function persistLocalBatchReport(report, batchDirectory) {
  if (!report || report.schemaVersion !== 1 || report.lane !== "controlled-local-pack") {
    throw new Error("only canonical controlled-local-pack reports can be written");
  }
  if (!/^\d{4}-W\d{2}$/.test(report.batchId || "")) {
    throw new Error("report batchId must use ISO week form YYYY-Www");
  }
  if (!report.completeness?.complete) {
    throw new Error("incomplete local-search reports cannot be written");
  }
  if (!/^[a-f0-9]{64}$/.test(report.comparisonKeySetSha256 || "")
    || !/^[a-f0-9]{64}$/.test(report.provenanceSha256 || "")) {
    throw new Error("report comparison/provenance hashes are missing or invalid");
  }

  const directory = resolve(batchDirectory);
  const filename = `${report.batchId}.json`;
  const outputPath = resolve(directory, filename);
  if (basename(outputPath) !== filename) throw new Error("report output filename is invalid");
  await mkdir(directory, { recursive: true, mode: 0o755 });

  const temporaryPath = resolve(directory, `.${report.batchId}.${randomUUID()}.tmp`);
  let temporaryCreated = false;
  try {
    const handle = await open(temporaryPath, "wx", 0o600);
    temporaryCreated = true;
    try {
      await handle.writeFile(`${JSON.stringify(report, null, 2)}\n`, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await link(temporaryPath, outputPath);
  } catch (error) {
    if (error?.code === "EEXIST" && (error?.dest === outputPath || error?.path === outputPath)) {
      throw new Error(`batch report already exists: ${filename}; reports are immutable`);
    }
    throw error;
  } finally {
    if (temporaryCreated) await unlink(temporaryPath).catch(() => {});
  }

  return outputPath;
}
