import assert from "node:assert/strict";
import { createSign } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { legacyPathMappings } from "../config/domain-redirects.mjs";
import {
  assertApprovedCanonicalOutput,
  assertCanonicalGitState,
  assertUniqueDimensionRows,
  buildCheckpointAnalysis,
  certifyFinalWindow,
  resolveCheckpointWindow,
  sanitizeUrlForCanonicalArtifact,
  shouldContinuePagination,
  sortRequestRecords,
} from "./lib/gsc-checkpoint.mjs";
import {
  assertResponseAggregation,
  createPrivateCaptureDirectory,
  sha256,
  writePrivateArtifact,
} from "./lib/gsc-fresh-opportunities.mjs";

const STATUS = "DESCRIPTIVE_ONLY_NO_PERFORMANCE_EDIT";
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIRECTORY, "..");
const CONFIG_PATH = resolve(REPOSITORY_ROOT, "config", "seo-checkpoints.json");
const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));

const cliArgs = process.argv.slice(2);
assert.equal(cliArgs.length % 2, 0, "Arguments must be supplied as --name value pairs");
const args = new Map();
for (let index = 0; index < cliArgs.length; index += 2) {
  const key = cliArgs[index];
  assert.ok(!args.has(key), `Duplicate argument: ${key}`);
  args.set(key, cliArgs[index + 1]);
}
const allowedArgs = new Set(["--window", "--start", "--end", "--capture-name", "--minimum-impressions"]);
for (const key of args.keys()) assert.ok(allowedArgs.has(key), `Unsupported argument: ${key}`);

const capturedAt = new Date();
const windowName = args.get("--window");
const captureName = args.get("--capture-name") || `${capturedAt.toISOString().replace(/[:.]/g, "-")}-${windowName || "missing-window"}`;
const minimumImpressions = Number(args.get("--minimum-impressions") || 5);
assert.ok(Number.isInteger(minimumImpressions) && minimumImpressions >= 1, "--minimum-impressions must be a positive integer");
const window = resolveCheckpointWindow({
  config,
  windowName,
  startDateOverride: args.get("--start"),
  endDateOverride: args.get("--end"),
  captureName,
  now: capturedAt,
});

const gitSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim();
const gitStatus = execFileSync("git", ["status", "--porcelain=v1"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim();
assertCanonicalGitState(window.canonical, gitStatus);

let canonicalOutputPath = null;
if (window.canonical) {
  canonicalOutputPath = assertApprovedCanonicalOutput(REPOSITORY_ROOT, window.canonicalOutputRelativePath);
  await lstat(canonicalOutputPath).then(
    () => assert.fail(`Canonical checkpoint artifact already exists: ${canonicalOutputPath}`),
    (error) => { if (error?.code !== "ENOENT") throw error; },
  );
}

const serviceAccountPath = process.env.GSC_SERVICE_ACCOUNT_PATH;
assert.ok(serviceAccountPath, "GSC_SERVICE_ACCOUNT_PATH is required");
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"));
assert.ok(serviceAccount.client_email && serviceAccount.private_key, "Invalid GSC service-account file");

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(serviceAccount.private_key, "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.access_token) throw new Error(`Google OAuth returned HTTP ${response.status}`);
  return body.access_token;
}

const token = await accessToken();
const propertyEncoded = encodeURIComponent(config.property);
const searchEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${propertyEncoded}/searchAnalytics/query`;
const rawRequests = [];

async function googleJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(30_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Google API ${new URL(url).pathname} returned HTTP ${response.status}: ${body.error?.message || "unknown"}`);
  return body;
}

async function searchAnalytics(name, dimensions, dataState, aggregationType) {
  const rows = [];
  const metadata = [];
  for (let startRow = 0, requestPage = 0; ; startRow += 25_000, requestPage += 1) {
    assert.ok(requestPage < 100, `${name} exceeded the pagination safety limit`);
    const request = {
      startDate: window.startDate,
      endDate: window.endDate,
      dimensions,
      dataState,
      type: "web",
      rowLimit: 25_000,
      startRow,
      aggregationType,
    };
    const body = await googleJson(searchEndpoint, { method: "POST", body: JSON.stringify(request) });
    assertResponseAggregation(body.responseAggregationType, aggregationType, name);
    const pageRows = body.rows || [];
    const continuePagination = shouldContinuePagination(pageRows.length);
    rows.push(...pageRows);
    if (body.metadata) metadata.push(body.metadata);
    const terminal = !continuePagination;
    rawRequests.push({ name, request, response: body, resultCount: pageRows.length, terminal });
    if (terminal) break;
  }
  assertUniqueDimensionRows(rows, name);
  return { rows, metadata, responseAggregationType: aggregationType };
}

const completeness = await searchAnalytics("completeness-daily-all", ["date"], "all", "byProperty");
const finalCertification = certifyFinalWindow({ window, completenessMetadata: completeness.metadata });

const [propertyTotal, finalDaily, finalQuery, finalQueryDate, finalPage, finalQueryPage, finalQueryPageDate, sitemaps] = await Promise.all([
  searchAnalytics("final-property-total", [], "final", "byProperty"),
  searchAnalytics("final-property-daily", ["date"], "final", "byProperty"),
  searchAnalytics("final-query", ["query"], "final", "byProperty"),
  searchAnalytics("final-query-date", ["date", "query"], "final", "byProperty"),
  searchAnalytics("final-page", ["page"], "final", "byPage"),
  searchAnalytics("final-query-page", ["query", "page"], "final", "byPage"),
  searchAnalytics("final-query-page-date", ["date", "query", "page"], "final", "byPage"),
  googleJson(`https://www.googleapis.com/webmasters/v3/sites/${propertyEncoded}/sitemaps`),
]);

const returnedFinalDates = [...new Set(finalDaily.rows.map((row) => String(row.keys?.[0] || "")))].sort();
assert.deepEqual(returnedFinalDates, window.dates, `Final daily rows must contain all ${window.expectedCalendarDays} requested dates`);

const canonicalOrigin = `https://${config.property.replace(/^sc-domain:/, "")}`;
const analysisInputs = {
  window,
  config,
  propertyRows: propertyTotal.rows,
  dailyRows: finalDaily.rows,
  queryRows: finalQuery.rows,
  queryDateRows: finalQueryDate.rows,
  pageRows: finalPage.rows,
  queryPageRows: finalQueryPage.rows,
  queryPageDateRows: finalQueryPageDate.rows,
  legacyPathMappings,
  minimumImpressions,
};
const provisionalAnalysis = buildCheckpointAnalysis({ ...analysisInputs, requireTechnicalState: false }).privateAnalysis;
const actionableStatuses = new Set(["PROTECT_NO_CHANGE", "POST_GATE_CANDIDATE_T1", "POST_GATE_CANDIDATE_T2"]);
const candidateInspectionPaths = provisionalAnalysis.pathIntentDocket
  .filter((row) => actionableStatuses.has(row.status))
  .map((row) => row.normalizedPath);
const inspectionPaths = [...new Set([...config.priorityPaths, ...candidateInspectionPaths])].slice(0, 25);
const inspections = [];
for (const path of inspectionPaths) {
  const result = await googleJson("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    body: JSON.stringify({ inspectionUrl: `${canonicalOrigin}${path}`, siteUrl: config.property, languageCode: "en-US" }),
  });
  inspections.push({ path, result });
}

function technicalStateForInspection(path, result) {
  const index = result.inspectionResult?.indexStatusResult || {};
  const expectedCanonical = `${canonicalOrigin}${path}`;
  const reasons = [];
  if (index.verdict !== "PASS") reasons.push(`verdict:${index.verdict || "missing"}`);
  if (index.indexingState !== "INDEXING_ALLOWED") reasons.push(`indexing:${index.indexingState || "missing"}`);
  if (index.pageFetchState !== "SUCCESSFUL") reasons.push(`fetch:${index.pageFetchState || "missing"}`);
  if (index.robotsTxtState !== "ALLOWED") reasons.push(`robots:${index.robotsTxtState || "missing"}`);
  if (index.userCanonical !== expectedCanonical) reasons.push("user-canonical-mismatch");
  if (index.googleCanonical !== expectedCanonical) reasons.push("google-canonical-mismatch");
  return { state: reasons.length ? "HOLD_TECHNICAL" : "GREEN", reasons };
}
const technicalStateByPath = Object.fromEntries(
  inspections.map(({ path, result }) => [path, technicalStateForInspection(path, result)]),
);
const { privateAnalysis, sanitizedAnalysis } = buildCheckpointAnalysis({
  ...analysisInputs,
  technicalStateByPath,
  requireTechnicalState: true,
});

const sortedRawRequests = sortRequestRecords(rawRequests);
const requestDefinitions = sortedRawRequests.map(({ name, request, response, resultCount, terminal }) => ({
  name,
  ...request,
  resultCount,
  terminal,
  responseAggregationType: response.responseAggregationType,
  metadata: response.metadata || null,
}));

const generatorCodeArtifacts = Object.fromEntries(await Promise.all([
  ["snapshot-gsc-checkpoint.mjs", fileURLToPath(import.meta.url)],
  ["lib/gsc-checkpoint.mjs", resolve(SCRIPT_DIRECTORY, "lib", "gsc-checkpoint.mjs")],
  ["lib/gsc-fresh-opportunities.mjs", resolve(SCRIPT_DIRECTORY, "lib", "gsc-fresh-opportunities.mjs")],
  ["verify-gsc-checkpoint.mjs", resolve(SCRIPT_DIRECTORY, "verify-gsc-checkpoint.mjs")],
  ["config/seo-checkpoints.json", CONFIG_PATH],
  ["config/domain-redirects.mjs", resolve(REPOSITORY_ROOT, "config", "domain-redirects.mjs")],
].map(async ([name, path]) => {
  const source = await readFile(path);
  return [name, { sha256: sha256(source), bytes: source.byteLength }];
})));
const gitShaBeforeWrite = execFileSync("git", ["rev-parse", "HEAD"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim();
const gitStatusBeforeWrite = execFileSync("git", ["status", "--porcelain=v1"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim();
if (window.canonical) {
  assert.equal(gitShaBeforeWrite, gitSha, "Git HEAD changed during the canonical checkpoint capture");
  assertCanonicalGitState(true, gitStatusBeforeWrite);
}

const privateSitemapSummary = (sitemaps.sitemap || []).map((item) => ({
  path: item.path,
  isPending: item.isPending,
  isSitemapsIndex: item.isSitemapsIndex,
  lastSubmitted: item.lastSubmitted,
  errors: item.errors,
  warnings: item.warnings,
}));
const sitemapSummary = privateSitemapSummary.map((item) => ({
  url: sanitizeUrlForCanonicalArtifact(item.path, canonicalOrigin),
  isPending: item.isPending,
  isSitemapsIndex: item.isSitemapsIndex,
  lastSubmitted: item.lastSubmitted,
  errors: item.errors,
  warnings: item.warnings,
}));
const privateInspectionSummary = inspections.map(({ path, result }) => {
  const index = result.inspectionResult?.indexStatusResult || {};
  return {
    path,
    verdict: index.verdict || null,
    coverageState: index.coverageState || null,
    indexingState: index.indexingState || null,
    pageFetchState: index.pageFetchState || null,
    robotsTxtState: index.robotsTxtState || null,
    googleCanonical: index.googleCanonical || null,
    userCanonical: index.userCanonical || null,
    lastCrawlTime: index.lastCrawlTime || null,
  };
});
const inspectionSummary = privateInspectionSummary.map((item) => ({
  path: item.path,
  verdict: item.verdict,
  coverageState: item.coverageState,
  indexingState: item.indexingState,
  pageFetchState: item.pageFetchState,
  robotsTxtState: item.robotsTxtState,
  googleCanonical: sanitizeUrlForCanonicalArtifact(item.googleCanonical, canonicalOrigin),
  userCanonical: sanitizeUrlForCanonicalArtifact(item.userCanonical, canonicalOrigin),
  lastCrawlTime: item.lastCrawlTime,
}));

const manifest = {
  property: config.property,
  status: STATUS,
  performanceEditAuthorized: false,
  capturedAt: capturedAt.toISOString(),
  capturedAtEastern: new Intl.DateTimeFormat("en-US", {
    timeZone: config.reportingTimezone,
    dateStyle: "medium",
    timeStyle: "long",
  }).format(capturedAt),
  window,
  finalCertification,
  releaseWashoutDatesExcluded: config.washoutDates,
  sourceTimezone: config.sourceTimezone,
  reportingTimezone: config.reportingTimezone,
  earliestPerformanceDecision: "2026-09-30",
  earliestConsolidationReview: "2026-10-25",
  joinGrain: "period or week x explicit normalized landing path x frozen cluster; never person x query",
  propertyAndQueryAggregation: "byProperty",
  pageAndQueryPageAggregation: "byPage; routing only; never compared to property coverage",
  exactPageUrlGrouping: true,
  canonicalNormalizationAppliedOnlyToSeparatePathDocket: true,
  queryGeographicModifierCaveat: "Query wording only; not searcher location, Local Pack geography, or Maps rank.",
  searchAnalyticsRowCaveat: "Query exports contain Google's visible top rows, not an exhaustive keyword universe; property totals remain authoritative.",
  pathMapVersion: config.pathMapVersion,
  pathMapSource: config.pathMapSource,
  brandDictionaryVersion: config.brandDictionary.version,
  opportunityClassifier: "gsc-fresh-opportunities-current-source-hash",
  gitSha,
  gitWorkingTreeDirty: Boolean(gitStatus || gitStatusBeforeWrite),
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
  releaseTimestamp: process.env.RELEASE_TIMESTAMP || "2026-08-26T22:00:00Z",
  generatorCodeArtifacts,
  requestDefinitions,
  rawQueryStorage: "repository-root/private-seo/gsc only",
  rawRetention: "13 months",
  canonicalArtifact: window.canonical,
  decisionEligible: false,
  decisionNotBefore: window.decisionNotBefore,
};

const privateInventory = {
  schemaVersion: 2,
  status: STATUS,
  performanceEditAuthorized: false,
  manifest,
  ...privateAnalysis,
  sitemaps: privateSitemapSummary,
  priorityUrlInspection: privateInspectionSummary,
};

function percent(value) {
  return `${(100 * value).toFixed(2)}%`;
}

function markdownTable(headers, rows) {
  const escape = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.map(escape).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`),
  ].join("\n");
}

const privateSummary = `# Final GSC checkpoint: ${window.windowName}\n\n**${STATUS}**\n\n- Window: ${window.startDate} through ${window.endDate} (${config.sourceTimezone})\n- Certified final: ${finalCertification.certifiedFinal}\n- Performance edit authorized: **no**\n- Earliest performance decision: September 30, 2026\n- Earliest consolidation review: October 25, 2026\n- Exact URL identity is preserved. Path-level groupings are a separate analysis layer.\n- Query wording geography is not searcher location or Local Pack/Maps rank.\n\n## Property summary\n\n- Clicks: ${privateAnalysis.propertyTotal.clicks}\n- Impressions: ${privateAnalysis.propertyTotal.impressions}\n- CTR: ${percent(privateAnalysis.propertyTotal.ctr)}\n- Average position: ${privateAnalysis.propertyTotal.position}\n- Visible-query impressions at matching by-property grain: ${privateAnalysis.visibleQueryCoverage.impressions} (${privateAnalysis.visibleQueryCoverage.visibleImpressionCoveragePct}%)\n- Residual anonymous/suppressed clicks: ${privateAnalysis.visibleQueryCoverage.residualAnonymousOrSuppressedClicks}\n\n## Daily stability\n\n${markdownTable(
  ["Pacific date", "Clicks", "Impressions", "CTR", "Position", "Share", "Final", ">30% anomaly"],
  privateAnalysis.dailyMetrics.map((row) => [row.date, row.clicks, row.impressions, percent(row.ctr), row.position, percent(row.shareOfWindowImpressions), row.final, row.anomalyOverThirtyPercent]),
)}\n\n## Ranked path × intent docket\n\n${markdownTable(
  ["Rank", "Status", "Path", "Intent", "Query modifier", "Clicks", "Impressions", "Position", "Active dates", "Reason held"],
  privateAnalysis.pathIntentDocket.map((row) => [row.rank, row.status, row.normalizedPath, row.intent, row.geography, row.clicks, row.impressions, row.position, row.activeDates, row.reasonHeld]),
)}\n\n## Top visible queries (private)\n\n${markdownTable(
  ["Query", "Intent", "Query modifier", "Clicks", "Impressions", "Position", "Active dates"],
  privateAnalysis.allClassifiedVisibleQueries
    .filter((row) => row.impressions >= minimumImpressions)
    .sort((a, b) => b.impressions - a.impressions || (a.position ?? 999) - (b.position ?? 999))
    .slice(0, 50)
    .map((row) => [row.query, row.intentBucket, row.queryGeographicModifierBucket, row.clicks, row.impressions, row.position, row.activeDates]),
)}\n\nThis finalized checkpoint freezes descriptive evidence. It cannot authorize title, metadata, H1, body-copy, internal-link, canonical, redirect, URL, or publishing changes.\n`;

const rawSearchSerialized = `${JSON.stringify(sortedRawRequests, null, 2)}\n`;
const sitemapsSerialized = `${JSON.stringify(sitemaps, null, 2)}\n`;
const inspectionsSerialized = `${JSON.stringify(inspections, null, 2)}\n`;
const inventorySerialized = `${JSON.stringify(privateInventory, null, 2)}\n`;
const privateArtifactProof = {
  "raw-search-analytics.json": { sha256: sha256(rawSearchSerialized), bytes: Buffer.byteLength(rawSearchSerialized) },
  "sitemaps.json": { sha256: sha256(sitemapsSerialized), bytes: Buffer.byteLength(sitemapsSerialized) },
  "url-inspection.json": { sha256: sha256(inspectionsSerialized), bytes: Buffer.byteLength(inspectionsSerialized) },
  "checkpoint-inventory.json": { sha256: sha256(inventorySerialized), bytes: Buffer.byteLength(inventorySerialized) },
  "summary.md": { sha256: sha256(privateSummary), bytes: Buffer.byteLength(privateSummary) },
};
const sanitizedManifest = {
  schemaVersion: 2,
  status: STATUS,
  performanceEditAuthorized: false,
  manifest,
  ...sanitizedAnalysis,
  sitemaps: sitemapSummary,
  priorityUrlInspection: inspectionSummary,
  privateArtifacts: privateArtifactProof,
};
const sanitizedManifestSerialized = `${JSON.stringify(sanitizedManifest, null, 2)}\n`;

const privateRoot = resolve(REPOSITORY_ROOT, "private-seo", "gsc");
const outputDirectory = await createPrivateCaptureDirectory(privateRoot, captureName);
await Promise.all([
  writePrivateArtifact(outputDirectory, "raw-search-analytics.json", rawSearchSerialized),
  writePrivateArtifact(outputDirectory, "sitemaps.json", sitemapsSerialized),
  writePrivateArtifact(outputDirectory, "url-inspection.json", inspectionsSerialized),
  writePrivateArtifact(outputDirectory, "checkpoint-inventory.json", inventorySerialized),
  writePrivateArtifact(outputDirectory, "manifest-sanitized.json", sanitizedManifestSerialized),
  writePrivateArtifact(outputDirectory, "summary.md", privateSummary),
]);

if (canonicalOutputPath) {
  await mkdir(dirname(canonicalOutputPath), { recursive: true });
  await writeFile(canonicalOutputPath, sanitizedManifestSerialized, { flag: "wx", mode: 0o644 });
}

const docketStatuses = privateAnalysis.pathIntentDocket.map((row) => row.status);
process.stdout.write(`${JSON.stringify({
  status: STATUS,
  performanceEditAuthorized: false,
  window: {
    name: window.windowName,
    startDate: window.startDate,
    endDate: window.endDate,
    certifiedFinal: finalCertification.certifiedFinal,
  },
  outputDirectory,
  canonicalOutputPath,
  propertyTotal: privateAnalysis.propertyTotal,
  visibleQueryCoverage: privateAnalysis.visibleQueryCoverage,
  docketStatusCounts: Object.fromEntries(
    [...new Set(docketStatuses)].sort().map((status) => [status, docketStatuses.filter((value) => value === status).length]),
  ),
  routingWatchCount: privateAnalysis.routingWatches.length,
  indexedUrlDiagnosticCount: privateAnalysis.indexedUrlDiagnostics.length,
}, null, 2)}\n`);
