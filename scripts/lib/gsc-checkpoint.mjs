import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import {
  brandBucket,
  describeExactPage,
  groupRows,
  intentBucket,
  normalizeQueryText,
  positionBand,
  queryGeographicModifierBucket,
  sha256,
  validateCaptureName,
} from "./gsc-fresh-opportunities.mjs";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

export function validateDateOnly(value, label) {
  assert.match(value || "", DATE_PATTERN, `${label} must be YYYY-MM-DD`);
  const parsed = new Date(`${value}T00:00:00Z`);
  assert.ok(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value, `${label} must be a real calendar date`);
  return value;
}

export function dateInTimezone(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function inclusiveDateKeys(startDate, endDate) {
  validateDateOnly(startDate, "startDate");
  validateDateOnly(endDate, "endDate");
  assert.ok(startDate <= endDate, "startDate must be on or before endDate");
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Array.from({ length: Math.round((end - start) / DAY_MS) + 1 }, (_, index) => (
    new Date(start + index * DAY_MS).toISOString().slice(0, 10)
  ));
}

export function resolveCheckpointWindow({
  config,
  windowName,
  startDateOverride,
  endDateOverride,
  captureName,
  now = new Date(),
}) {
  assert.ok(windowName, "--window is required");
  validateCaptureName(captureName);
  const configured = config.windows?.[windowName];
  const isCanonical = windowName !== "custom";

  if (isCanonical) {
    assert.ok(configured, `Unknown configured window: ${windowName}`);
    assert.equal(startDateOverride, undefined, "Configured windows reject --start overrides");
    assert.equal(endDateOverride, undefined, "Configured windows reject --end overrides");
  } else {
    assert.equal(configured, undefined, "custom must not be configured as a canonical window");
    assert.ok(startDateOverride && endDateOverride, "Custom private captures require --start and --end");
  }

  const startDate = validateDateOnly(configured?.startDate || startDateOverride, "startDate");
  const endDate = validateDateOnly(configured?.endDate || endDateOverride, "endDate");
  const dates = inclusiveDateKeys(startDate, endDate);
  assert.ok(dates.length <= 480, "Checkpoint windows may not exceed 480 calendar days");
  for (const washoutDate of config.washoutDates || []) {
    validateDateOnly(washoutDate, "washoutDate");
    assert.ok(!dates.includes(washoutDate), `Checkpoint window must exclude washout date ${washoutDate}`);
  }

  const protectedWindow = isCanonical
    ? null
    : Object.entries(config.windows || {}).find(([, candidate]) => (
      candidate.startDate === startDate && candidate.endDate === endDate
    )) || null;
  const effectiveGate = configured || protectedWindow?.[1] || null;
  if (configured?.expectedCalendarDays != null) {
    assert.equal(dates.length, configured.expectedCalendarDays, `${windowName} must contain ${configured.expectedCalendarDays} calendar days`);
  }
  if (effectiveGate?.notBefore) {
    validateDateOnly(effectiveGate.notBefore, "notBefore");
    const today = dateInTimezone(now, config.reportingTimezone);
    assert.ok(today >= effectiveGate.notBefore, `${windowName} must not be captured before ${effectiveGate.notBefore} ${config.reportingTimezone}`);
  }

  return {
    windowName,
    startDate,
    endDate,
    dates,
    expectedCalendarDays: dates.length,
    purpose: configured?.purpose || "custom-private-diagnostic",
    protectedWindowName: protectedWindow?.[0] || null,
    decisionEligible: false,
    decisionNotBefore: configured?.decisionNotBefore || null,
    canonical: isCanonical,
    canonicalOutputRelativePath: isCanonical
      ? `docs/gsc-checkpoints/${configured.notBefore}-${windowName}-final.json`
      : null,
  };
}

export function firstIncompleteDateFromMetadata(metadata = []) {
  return metadata
    .map((item) => item?.firstIncompleteDate || item?.first_incomplete_date)
    .filter(Boolean)
    .sort()[0] || null;
}

export function certifyFinalWindow({ window, completenessMetadata }) {
  const firstIncompleteDate = firstIncompleteDateFromMetadata(completenessMetadata);
  if (firstIncompleteDate) {
    validateDateOnly(firstIncompleteDate, "firstIncompleteDate");
    assert.ok(firstIncompleteDate > window.endDate, `Requested final window is incomplete beginning ${firstIncompleteDate}`);
  }
  return {
    certifiedFinal: true,
    firstIncompleteDate,
    finalDataThrough: window.endDate,
    expectedCalendarDays: window.expectedCalendarDays,
  };
}

export function metric(rows) {
  const value = rows.reduce((sum, row) => ({
    clicks: sum.clicks + Number(row.clicks || 0),
    impressions: sum.impressions + Number(row.impressions || 0),
    weightedPosition: sum.weightedPosition + Number(row.position || 0) * Number(row.impressions || 0),
  }), { clicks: 0, impressions: 0, weightedPosition: 0 });
  return {
    clicks: value.clicks,
    impressions: value.impressions,
    ctr: value.impressions ? Number((value.clicks / value.impressions).toFixed(6)) : 0,
    position: value.impressions ? Number((value.weightedPosition / value.impressions).toFixed(2)) : null,
  };
}

export function assertUniqueDimensionRows(rows, name) {
  const seen = new Set();
  for (const [index, row] of rows.entries()) {
    const key = JSON.stringify(row.keys || []);
    assert.ok(
      !seen.has(key),
      `${name} returned a duplicate dimension key at row ${index} (fingerprint ${sha256(key).slice(0, 16)})`,
    );
    seen.add(key);
  }
}

export function assertCanonicalGitState(canonical, gitStatus) {
  if (canonical) assert.equal(gitStatus, "", "Canonical checkpoint captures require a clean Git working tree");
}

export function shouldContinuePagination(resultCount, rowLimit = 25_000) {
  assert.ok(Number.isInteger(resultCount) && resultCount >= 0, "Pagination result count must be a nonnegative integer");
  assert.ok(Number.isInteger(rowLimit) && rowLimit >= 1, "Pagination row limit must be a positive integer");
  assert.ok(resultCount <= rowLimit, "Pagination result count exceeds the requested row limit");
  return resultCount > 0;
}

export function sortRequestRecords(records) {
  return [...records].sort((a, b) => a.name.localeCompare(b.name) || a.request.startRow - b.request.startRow);
}

export function sanitizeUrlForCanonicalArtifact(value, canonicalOrigin) {
  if (!value) return { publicUrl: null, urlClass: "missing", fingerprint: null, hasQuery: false, hasFragment: false };
  const fingerprint = sha256(String(value));
  try {
    const url = new URL(String(value));
    const hasQuery = Boolean(url.search);
    const hasFragment = Boolean(url.hash);
    const cleanCanonical = url.origin === canonicalOrigin
      && url.protocol === "https:"
      && !url.username
      && !url.password
      && !hasQuery
      && !hasFragment;
    return {
      publicUrl: cleanCanonical ? `${url.origin}${url.pathname}` : null,
      urlClass: cleanCanonical ? "canonical-origin-clean-url" : describeExactPage(String(value), canonicalOrigin).urlClass,
      fingerprint,
      hasQuery,
      hasFragment,
    };
  } catch {
    return { publicUrl: null, urlClass: "invalid-url", fingerprint, hasQuery: false, hasFragment: false };
  }
}

export function dailyMetricsForWindow(rows, window) {
  assertUniqueDimensionRows(rows, "final-daily");
  const byDate = new Map(rows.map((row) => [String(row.keys?.[0] || ""), row]));
  for (const date of byDate.keys()) assert.ok(window.dates.includes(date), `final-daily returned date outside the requested window: ${date}`);
  return window.dates.map((date) => ({
    date,
    ...metric(byDate.has(date) ? [byDate.get(date)] : []),
    sourceRowPresent: byDate.has(date),
    final: true,
  }));
}

export function assertPropertyDailyReconciliation(propertyRows, dailyRows) {
  const property = metric(propertyRows);
  const daily = metric(dailyRows);
  assert.equal(daily.clicks, property.clicks, "Final daily clicks do not reconcile to the property total");
  assert.equal(daily.impressions, property.impressions, "Final daily impressions do not reconcile to the property total");
  assert.equal(daily.ctr, property.ctr, "Final daily CTR does not reconcile to the property total");
  assert.equal(daily.position, property.position, "Final daily position does not reconcile to the property total");
  return { property, daily };
}

function frozenClusterFor(query, clusters) {
  const value = ` ${normalizeQueryText(query)} `;
  for (const [cluster, terms] of Object.entries(clusters || {})) {
    if (terms.some((term) => value.includes(` ${normalizeQueryText(term)} `))) return cluster;
  }
  return "unclassified";
}

function groupedMetricObject(rows, keyFor) {
  return Object.fromEntries(
    [...groupRows(rows, keyFor).entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, values]) => [key, metric(values)]),
  );
}

function activeDateSets(rows, keyFor) {
  const result = new Map();
  for (const row of rows) {
    const key = keyFor(row);
    const dates = result.get(key) || new Set();
    dates.add(String(row.keys?.[0] || ""));
    result.set(key, dates);
  }
  return result;
}

function signalStatus({
  intent,
  geography,
  impressions,
  clicks,
  position,
  activeDates,
  landingPageFit,
  routingConflict,
  technicalState,
  requireTechnicalState,
}) {
  const outside = geography === "outside-dc-md-va-query-modifier";
  const coreCommercial = intent === "title-company-local-commercial" && geography === "core-dmv-query-modifier";
  const educational = ["title-insurance-pricing", "property-survey", "title-company-informational-or-ambiguous"].includes(intent)
    && geography !== "outside-dc-md-va-query-modifier";
  if (outside) return "EXCLUDE_OUTSIDE_SCOPE";
  let baseStatus = "INSUFFICIENT_EVIDENCE";
  if (coreCommercial && impressions >= 5 && activeDates >= 2 && position != null && position <= 10) baseStatus = "PROTECT_NO_CHANGE";
  else if (coreCommercial && impressions >= 5 && activeDates >= 2 && position > 10 && position <= 20) baseStatus = "POST_GATE_CANDIDATE_T1";
  else if (educational && impressions >= 10 && activeDates >= 2 && position >= 4 && position <= 20) baseStatus = "POST_GATE_CANDIDATE_T1";
  else if (impressions >= 20 && clicks >= 1 && position >= 4 && position <= 20 && intent !== "other") baseStatus = "POST_GATE_CANDIDATE_T1";
  else if (coreCommercial && impressions >= 5 && position > 20 && position <= 40) baseStatus = "POST_GATE_CANDIDATE_T2";
  else if (educational && impressions >= 15 && position > 20 && position <= 40) baseStatus = "POST_GATE_CANDIDATE_T2";
  if (!["PROTECT_NO_CHANGE", "POST_GATE_CANDIDATE_T1", "POST_GATE_CANDIDATE_T2"].includes(baseStatus)) return baseStatus;
  if (!landingPageFit || routingConflict) return "WATCH_ROUTING";
  if (requireTechnicalState && technicalState !== "GREEN") return "HOLD_TECHNICAL";
  return baseStatus;
}

function reasonForStatus(status) {
  return {
    PROTECT_NO_CHANGE: "First-page core-DMV commercial signal; preserve as a control.",
    POST_GATE_CANDIDATE_T1: "Strong page-one/page-two signal queued for the September 30 gate; no edit authorized.",
    POST_GATE_CANDIDATE_T2: "Secondary relevant signal queued behind tier-one candidates; no edit authorized.",
    WATCH_ROUTING: "Landing-page fit, redirect mapping, or query routing is unresolved; no edit authorized.",
    HOLD_TECHNICAL: "The ranking signal is held until indexing, fetch, robots, and canonical checks are green.",
    EXCLUDE_OUTSIDE_SCOPE: "Query wording identifies demand outside DC, Maryland, and Virginia prioritization.",
    INSUFFICIENT_EVIDENCE: "The finalized window does not meet the frozen descriptive signal thresholds.",
  }[status];
}

function pathForCanonicalPage(page, canonicalOrigin, legacyPathMap) {
  const descriptor = describeExactPage(page, canonicalOrigin);
  if (descriptor.urlClass !== "canonical-origin-clean-url") {
    return { descriptor, normalizedPath: null, rankingEligible: false, pathMapStatus: "not-clean-canonical-url" };
  }
  const sourcePath = descriptor.path.replace(/\/$/, "") || "/";
  const mappedDestination = legacyPathMap.get(sourcePath) || null;
  return {
    descriptor,
    normalizedPath: mappedDestination || sourcePath,
    rankingEligible: !mappedDestination,
    pathMapStatus: mappedDestination ? "legacy-redirect-source" : "direct-canonical-path",
    mappedDestination,
  };
}

function landingPageFitsQuery(query, normalizedPath, intent) {
  const normalizedQuery = ` ${normalizeQueryText(query)} `;
  const normalizedPathWords = normalizeQueryText(normalizedPath.replaceAll("/", " "));
  if (intent === "property-survey") return /(?:^| )surveys?(?: |$)/.test(normalizedPathWords);
  if (intent === "title-insurance-pricing") {
    return /(?:cost|costs|calculator|quote|fee|fees|premium|premiums|rate|rates|enhanced|standard|policy)/.test(normalizedPathWords);
  }
  if (intent === "title-company-informational-or-ambiguous") {
    return /(?:title company|title companies|settlement|escrow|what does)/.test(normalizedPathWords);
  }
  if (intent !== "title-company-local-commercial") return false;
  const genericTokens = new Set([
    "blog", "title", "company", "companies", "search", "settlement", "services", "service", "closing", "closings",
    "real", "estate", "escrow", "agent", "insurance", "in", "near", "va", "md", "dc",
  ]);
  const locationTokens = normalizedPathWords.split(" ").filter((token) => token && !genericTokens.has(token));
  return locationTokens.length > 0 && locationTokens.every((token) => normalizedQuery.includes(` ${token} `));
}

export function buildCheckpointAnalysis({
  window,
  config,
  propertyRows,
  dailyRows,
  queryRows,
  queryDateRows,
  pageRows,
  queryPageRows,
  queryPageDateRows,
  legacyPathMappings = [],
  technicalStateByPath = {},
  requireTechnicalState = false,
  minimumImpressions = 5,
}) {
  for (const [name, rows] of Object.entries({ propertyRows, queryRows, queryDateRows, pageRows, queryPageRows, queryPageDateRows })) {
    assertUniqueDimensionRows(rows, name);
  }
  const daily = dailyMetricsForWindow(dailyRows, window);
  const { property } = assertPropertyDailyReconciliation(propertyRows, dailyRows);
  const visibleQuery = metric(queryRows);
  assert.ok(visibleQuery.clicks <= property.clicks, "Visible-query clicks exceed same-grain property clicks");
  assert.ok(visibleQuery.impressions <= property.impressions, "Visible-query impressions exceed same-grain property impressions");

  const queryActiveDates = activeDateSets(queryDateRows, (row) => String(row.keys?.[1] || ""));
  const queryPageActiveDates = activeDateSets(
    queryPageDateRows,
    (row) => JSON.stringify([String(row.keys?.[1] || ""), String(row.keys?.[2] || "")]),
  );
  const queryMetrics = queryRows.map((row) => {
    const query = String(row.keys?.[0] || "");
    const geography = queryGeographicModifierBucket(query);
    const value = metric([row]);
    return {
      query,
      ...value,
      activeDates: queryActiveDates.get(query)?.size || 0,
      brandBucket: brandBucket(query, config.brandDictionary),
      intentBucket: intentBucket(query, geography),
      queryGeographicModifierBucket: geography,
      frozenCluster: frozenClusterFor(query, config.clusters),
      positionBand: positionBand(value.position ?? Number.POSITIVE_INFINITY),
    };
  });

  const canonicalOrigin = `https://${config.property.replace(/^sc-domain:/, "")}`;
  const legacyPathMap = new Map(legacyPathMappings.map(([source, destination]) => [source.replace(/\/$/, "") || "/", destination]));
  const exactPageMetrics = pageRows.map((row) => {
    const page = String(row.keys?.[0] || "");
    const pathDescription = pathForCanonicalPage(page, canonicalOrigin, legacyPathMap);
    return {
      ...pathDescription.descriptor,
      normalizedPath: pathDescription.normalizedPath,
      rankingEligible: pathDescription.rankingEligible,
      pathMapStatus: pathDescription.pathMapStatus,
      mappedDestination: pathDescription.mappedDestination || null,
      ...metric([row]),
    };
  });
  const exactQueryPageMetrics = queryPageRows.map((row) => {
    const query = String(row.keys?.[0] || "");
    const page = String(row.keys?.[1] || "");
    const geography = queryGeographicModifierBucket(query);
    const pathDescription = pathForCanonicalPage(page, canonicalOrigin, legacyPathMap);
    const value = metric([row]);
    return {
      query,
      ...pathDescription.descriptor,
      normalizedPath: pathDescription.normalizedPath,
      rankingEligible: pathDescription.rankingEligible,
      pathMapStatus: pathDescription.pathMapStatus,
      mappedDestination: pathDescription.mappedDestination || null,
      ...value,
      activeDates: queryPageActiveDates.get(JSON.stringify([query, page]))?.size || 0,
      brandBucket: brandBucket(query, config.brandDictionary),
      intentBucket: intentBucket(query, geography),
      queryGeographicModifierBucket: geography,
      frozenCluster: frozenClusterFor(query, config.clusters),
      positionBand: positionBand(value.position ?? Number.POSITIVE_INFINITY),
      landingPageFit: pathDescription.rankingEligible
        ? landingPageFitsQuery(query, pathDescription.normalizedPath, intentBucket(query, geography))
        : false,
    };
  });

  const queryPages = groupRows(exactQueryPageMetrics, (row) => row.query);
  const routingWatches = queryMetrics
    .filter((row) => row.impressions >= 10 && row.brandBucket === "visible-known-non-brand")
    .map((row) => {
      const pages = (queryPages.get(row.query) || []).sort((a, b) => b.impressions - a.impressions || a.position - b.position);
      const byPageTotal = metric(pages);
      const secondaryShare = byPageTotal.impressions && pages[1] ? Number((pages[1].impressions / byPageTotal.impressions).toFixed(4)) : 0;
      return {
        query: row.query,
        queryByProperty: { clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position },
        byPageRoutingMetric: byPageTotal,
        pages,
        secondaryShare,
        status: "WATCH_ROUTING",
        label: "watch—not cannibalization",
      };
    })
    .filter((row) => row.pages.length >= 2 && row.secondaryShare >= 0.2)
    .sort((a, b) => b.queryByProperty.impressions - a.queryByProperty.impressions);
  const routingConflictQueries = new Set(routingWatches.map((row) => row.query));
  const redirectSourceWatches = exactQueryPageMetrics
    .filter((row) => row.pathMapStatus === "legacy-redirect-source")
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position);

  const canonicalCells = exactQueryPageMetrics.filter((row) => row.rankingEligible);
  const docketGroups = groupRows(
    canonicalCells,
    (row) => JSON.stringify([row.normalizedPath, row.intentBucket, row.queryGeographicModifierBucket]),
  );
  const pathIntentDocket = [...docketGroups.values()].map((rows) => {
    const value = metric(rows);
    const activeDates = new Set(rows.flatMap((row) => {
      const key = JSON.stringify([row.query, row.page]);
      return [...(queryPageActiveDates.get(key) || [])];
    })).size;
    const fitImpressions = rows.filter((row) => row.landingPageFit).reduce((sum, row) => sum + row.impressions, 0);
    const fitShare = value.impressions ? fitImpressions / value.impressions : 0;
    const landingPageFit = fitShare >= 0.8;
    const routingConflict = rows.some((row) => routingConflictQueries.has(row.query));
    const technical = technicalStateByPath[rows[0].normalizedPath] || { state: "UNKNOWN", reasons: ["not-inspected"] };
    const status = signalStatus({
      intent: rows[0].intentBucket,
      geography: rows[0].queryGeographicModifierBucket,
      ...value,
      activeDates,
      landingPageFit,
      routingConflict,
      technicalState: technical.state,
      requireTechnicalState,
    });
    return {
      status,
      normalizedPath: rows[0].normalizedPath,
      intent: rows[0].intentBucket,
      geography: rows[0].queryGeographicModifierBucket,
      ...value,
      activeDates,
      fit: landingPageFit ? "CONFIRMED" : "UNRESOLVED",
      fitShare: Number(fitShare.toFixed(4)),
      routingConflict,
      technicalState: technical.state,
      technicalReasons: technical.reasons || [],
      reasonHeld: reasonForStatus(status),
    };
  });

  for (const priorityPath of config.priorityPaths || []) {
    if (!pathIntentDocket.some((row) => row.normalizedPath === priorityPath)) {
      pathIntentDocket.push({
        status: "INSUFFICIENT_EVIDENCE",
        normalizedPath: priorityPath,
        intent: "no-visible-row",
        geography: "unrecognized-or-no-geographic-modifier",
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: null,
        activeDates: 0,
        fit: "NO_VISIBLE_ROW",
        fitShare: 0,
        routingConflict: false,
        technicalState: technicalStateByPath[priorityPath]?.state || "UNKNOWN",
        technicalReasons: technicalStateByPath[priorityPath]?.reasons || ["not-inspected"],
        reasonHeld: reasonForStatus("INSUFFICIENT_EVIDENCE"),
      });
    }
  }
  const statusOrder = new Map([
    ["PROTECT_NO_CHANGE", 0],
    ["POST_GATE_CANDIDATE_T1", 1],
    ["POST_GATE_CANDIDATE_T2", 2],
    ["HOLD_TECHNICAL", 3],
    ["WATCH_ROUTING", 4],
    ["INSUFFICIENT_EVIDENCE", 5],
    ["EXCLUDE_OUTSIDE_SCOPE", 6],
  ]);
  pathIntentDocket.sort((a, b) => (
    (statusOrder.get(a.status) ?? 99) - (statusOrder.get(b.status) ?? 99)
    || b.impressions - a.impressions
    || (a.position ?? 999) - (b.position ?? 999)
    || a.normalizedPath.localeCompare(b.normalizedPath)
  ));
  pathIntentDocket.forEach((row, index) => { row.rank = index + 1; });

  const indexedUrlDiagnostics = exactPageMetrics
    .filter((row) => row.urlClass !== "canonical-origin-clean-url")
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
  const dailyWithShare = daily.map((row) => ({
    ...row,
    shareOfWindowImpressions: property.impressions ? Number((row.impressions / property.impressions).toFixed(6)) : 0,
    anomalyOverThirtyPercent: property.impressions ? row.impressions / property.impressions > 0.3 : false,
  }));

  const visibleQueryCoverage = {
    ...visibleQuery,
    aggregationType: "byProperty",
    totalClicks: property.clicks,
    totalImpressions: property.impressions,
    visibleClickCoveragePct: property.clicks ? Number((100 * visibleQuery.clicks / property.clicks).toFixed(2)) : 0,
    visibleImpressionCoveragePct: property.impressions ? Number((100 * visibleQuery.impressions / property.impressions).toFixed(2)) : 0,
    residualAnonymousOrSuppressedClicks: property.clicks - visibleQuery.clicks,
    residualAnonymousOrSuppressedImpressions: property.impressions - visibleQuery.impressions,
  };
  const normalizedPathByFrozenCluster = groupedMetricObject(
    canonicalCells,
    (row) => `${row.normalizedPath}::${row.frozenCluster}`,
  );

  const privateAnalysis = {
    propertyTotal: property,
    dailyMetrics: dailyWithShare,
    visibleQueryCoverage,
    queryOnlyAnalysisAggregates: {
      aggregationType: "byProperty",
      brandBuckets: groupedMetricObject(queryMetrics, (row) => row.brandBucket),
      intentBuckets: groupedMetricObject(queryMetrics, (row) => row.intentBucket),
      queryGeographicModifierBuckets: groupedMetricObject(queryMetrics, (row) => row.queryGeographicModifierBucket),
      intentByGeographicModifier: groupedMetricObject(queryMetrics, (row) => `${row.intentBucket}::${row.queryGeographicModifierBucket}`),
      frozenClusters: groupedMetricObject(queryMetrics, (row) => row.frozenCluster),
      positionBands: groupedMetricObject(queryMetrics, (row) => row.positionBand),
    },
    pageLevelRoutingTotals: {
      aggregationType: "byPage",
      exactPageMetric: metric(exactPageMetrics),
      exactQueryPageMetric: metric(exactQueryPageMetrics),
      normalizedPathByFrozenCluster,
      coverageComparisonToPropertyProhibited: true,
    },
    allClassifiedVisibleQueries: queryMetrics,
    allExactPageMetrics: exactPageMetrics,
    allExactQueryPageCells: exactQueryPageMetrics,
    pathIntentDocket,
    routingWatches,
    redirectSourceWatches,
    indexedUrlDiagnostics,
  };

  const sanitizedAnalysis = {
    propertyTotal: property,
    dailyMetrics: dailyWithShare,
    visibleQueryCoverage,
    queryOnlyAnalysisAggregates: privateAnalysis.queryOnlyAnalysisAggregates,
    pageLevelRoutingTotals: privateAnalysis.pageLevelRoutingTotals,
    pathIntentDocket,
    routingWatchCount: routingWatches.length,
    redirectSourceWatchCount: redirectSourceWatches.length,
    indexedUrlDiagnosticClassCounts: groupedMetricObject(indexedUrlDiagnostics, (row) => row.urlClass),
    counts: {
      visibleQueryRows: queryMetrics.length,
      exactPageRows: exactPageMetrics.length,
      exactQueryPageCells: exactQueryPageMetrics.length,
      routingWatches: routingWatches.length,
      redirectSourceWatches: redirectSourceWatches.length,
      indexedUrlDiagnostics: indexedUrlDiagnostics.length,
      pathsOnDocket: new Set(pathIntentDocket.map((row) => row.normalizedPath)).size,
      rowsAtReportingFloor: queryMetrics.filter((row) => row.impressions >= minimumImpressions).length,
    },
  };

  return { privateAnalysis, sanitizedAnalysis };
}

export function assertApprovedCanonicalOutput(repositoryRoot, relativePath) {
  const approvedRoot = resolve(repositoryRoot, "docs", "gsc-checkpoints");
  const outputPath = resolve(repositoryRoot, relativePath);
  assert.equal(dirname(outputPath), approvedRoot, "Canonical checkpoint output must be a direct child of docs/gsc-checkpoints");
  assert.match(outputPath, /-final\.json$/, "Canonical checkpoint output must use a final JSON filename");
  return outputPath;
}
