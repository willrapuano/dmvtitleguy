import assert from "node:assert/strict";
import { createSign } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertResponseAggregation,
  brandBucket,
  createPrivateCaptureDirectory,
  describeExactPage,
  groupRows,
  intentBucket,
  positionBand,
  queryGeographicModifierBucket,
  rowsWithinHourWindow,
  selectLatestRollingHourWindow,
  sha256,
  validateFreshSnapshotOptions,
  writePrivateArtifact,
} from "./lib/gsc-fresh-opportunities.mjs";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(SCRIPT_DIRECTORY, "..");
const config = JSON.parse(await readFile(resolve(REPOSITORY_ROOT, "config/seo-checkpoints.json"), "utf8"));
const SOURCE_TIMEZONE = config.sourceTimezone;
const REPORTING_TIMEZONE = config.reportingTimezone;
const STATUS = "DESCRIPTIVE ONLY — NO SEO CHANGE";
const CANONICAL_ORIGIN = `https://${config.property.replace(/^sc-domain:/, "")}`;

const cliArgs = process.argv.slice(2);
assert.equal(cliArgs.length % 2, 0, "Arguments must be supplied as --name value pairs");
const args = new Map();
for (let index = 0; index < cliArgs.length; index += 2) args.set(cliArgs[index], cliArgs[index + 1]);
const allowedArgs = new Set(["--start", "--end", "--minimum-impressions", "--capture-name"]);
for (const key of args.keys()) assert.ok(allowedArgs.has(key), `Unsupported argument: ${key}`);

function dateInTimezone(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function displayInTimezone(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "long",
  }).format(date);
}

const capturedAt = new Date();
const defaultEndDate = dateInTimezone(capturedAt, SOURCE_TIMEZONE);
const defaultStartDate = dateInTimezone(new Date(capturedAt.getTime() - 24 * 60 * 60 * 1000), SOURCE_TIMEZONE);
const startDate = args.get("--start") || defaultStartDate;
const endDate = args.get("--end") || defaultEndDate;
const minimumImpressions = Number(args.get("--minimum-impressions") || 10);
const captureName = args.get("--capture-name") || capturedAt.toISOString().replace(/[:.]/g, "-");

validateFreshSnapshotOptions({ startDate, endDate, minimumImpressions, captureName });

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
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error(`Google OAuth returned HTTP ${response.status}`);
  return body.access_token;
}

const token = await accessToken();
const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.property)}/searchAnalytics/query`;
const rawRequests = [];

async function searchAnalytics(name, dimensions, dataState, aggregationType) {
  const rows = [];
  const metadata = [];
  for (let startRow = 0; ; startRow += 25_000) {
    const request = {
      startDate,
      endDate,
      dimensions,
      dataState,
      type: "web",
      rowLimit: 25_000,
      startRow,
      aggregationType,
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30_000),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Google Search Analytics returned HTTP ${response.status}: ${body.error?.message || "unknown"}`);
    }
    assertResponseAggregation(body.responseAggregationType, aggregationType, name);
    const pageRows = body.rows || [];
    rows.push(...pageRows);
    if (body.metadata) metadata.push(body.metadata);
    rawRequests.push({ name, request, response: body });
    if (pageRows.length < 25_000) break;
  }
  return { rows, metadata, responseAggregationType: aggregationType };
}

const [daily, hourlyProperty, hourlyQueries, hourlyPages, hourlyQueryPages] = await Promise.all([
  searchAnalytics("fresh-daily-completeness", ["date"], "all", "byProperty"),
  searchAnalytics("rolling-hourly-property", ["hour"], "hourly_all", "byProperty"),
  searchAnalytics("rolling-hourly-query", ["hour", "query"], "hourly_all", "byProperty"),
  searchAnalytics("rolling-hourly-page", ["hour", "page"], "hourly_all", "byPage"),
  searchAnalytics("rolling-hourly-query-page", ["hour", "query", "page"], "hourly_all", "byPage"),
]);

const rollingWindow = selectLatestRollingHourWindow(hourlyProperty.rows, 24);
const lastAvailableHour = rollingWindow.lastAvailableHour;
const rollingStartMs = rollingWindow.startMs;
const rollingEndMs = rollingWindow.endMs;
const rollingEndExclusiveMs = rollingWindow.endExclusiveMs;
const rollingStartDate = dateInTimezone(new Date(rollingStartMs), SOURCE_TIMEZONE);
const rollingEndDate = dateInTimezone(new Date(rollingEndMs), SOURCE_TIMEZONE);
assert.ok(rollingStartDate >= startDate && rollingEndDate <= endDate, "Requested dates do not contain the latest 24 API-available hours");

const selectedPropertyRows = rollingWindow.rows;
const selectedQueryRows = rowsWithinHourWindow(hourlyQueries.rows, rollingStartMs, rollingEndMs);
const selectedPageRows = rowsWithinHourWindow(hourlyPages.rows, rollingStartMs, rollingEndMs);
const selectedQueryPageRows = rowsWithinHourWindow(hourlyQueryPages.rows, rollingStartMs, rollingEndMs);

function metric(rows) {
  const aggregate = rows.reduce((sum, row) => ({
    clicks: sum.clicks + Number(row.clicks || 0),
    impressions: sum.impressions + Number(row.impressions || 0),
    weightedPosition: sum.weightedPosition + Number(row.position || 0) * Number(row.impressions || 0),
  }), { clicks: 0, impressions: 0, weightedPosition: 0 });
  return {
    clicks: aggregate.clicks,
    impressions: aggregate.impressions,
    ctr: aggregate.impressions ? Number((aggregate.clicks / aggregate.impressions).toFixed(6)) : 0,
    position: aggregate.impressions ? Number((aggregate.weightedPosition / aggregate.impressions).toFixed(2)) : null,
  };
}

function groupedMetrics(rows, field) {
  return Object.fromEntries([...groupRows(rows, (row) => row[field]).entries()].map(([key, values]) => [key, metric(values)]));
}

const propertyMetric = metric(selectedPropertyRows);
const visibleQueryMetric = metric(selectedQueryRows);
assert.ok(visibleQueryMetric.clicks <= propertyMetric.clicks, "Visible-query clicks exceed property clicks at the same aggregation grain");
assert.ok(visibleQueryMetric.impressions <= propertyMetric.impressions, "Visible-query impressions exceed property impressions at the same aggregation grain");

const queryMetrics = [...groupRows(selectedQueryRows, (row) => String(row.keys?.[1] || "")).entries()].map(([query, rows]) => {
  const queryModifier = queryGeographicModifierBucket(query);
  const value = metric(rows);
  return {
    query,
    ...value,
    brandBucket: brandBucket(query, config.brandDictionary),
    intentBucket: intentBucket(query, queryModifier),
    queryGeographicModifierBucket: queryModifier,
    positionBand: positionBand(value.position || 0),
  };
});
const describePage = (page) => describeExactPage(page, CANONICAL_ORIGIN);

const pageMetrics = [...groupRows(selectedPageRows, (row) => String(row.keys?.[1] || "")).entries()].map(([page, rows]) => ({
  ...describePage(page),
  ...metric(rows),
}));
const topPages = pageMetrics
  .filter((row) => row.impressions >= minimumImpressions)
  .sort((a, b) => b.impressions - a.impressions || a.position - b.position);
const indexedUrlDiagnostics = pageMetrics
  .filter((row) => row.urlClass !== "canonical-origin-clean-url")
  .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);

const queryPageMetrics = [...groupRows(
  selectedQueryPageRows,
  (row) => JSON.stringify([String(row.keys?.[1] || ""), String(row.keys?.[2] || "")]),
).values()].map((rows) => {
  const query = String(rows[0].keys?.[1] || "");
  const page = String(rows[0].keys?.[2] || "");
  const queryModifier = queryGeographicModifierBucket(query);
  const value = metric(rows);
  return {
    query,
    ...describePage(page),
    ...value,
    brandBucket: brandBucket(query, config.brandDictionary),
    intentBucket: intentBucket(query, queryModifier),
    queryGeographicModifierBucket: queryModifier,
    positionBand: positionBand(value.position || 0),
  };
});
const topQueryPageCells = queryPageMetrics
  .filter((row) => row.impressions >= minimumImpressions)
  .sort((a, b) => b.impressions - a.impressions || a.position - b.position);

const pageCellsByQuery = groupRows(queryPageMetrics, (row) => row.query);
const pageOverlapWatch = queryMetrics
  .filter((queryRow) => queryRow.brandBucket === "visible-known-non-brand" && queryRow.impressions >= minimumImpressions)
  .map((queryRow) => {
    const pages = (pageCellsByQuery.get(queryRow.query) || [])
      .map(({ page, path, urlClass, clicks, impressions, ctr, position }) => ({ page, path, urlClass, clicks, impressions, ctr, position }))
      .sort((a, b) => b.impressions - a.impressions || a.position - b.position);
    return {
      query: queryRow.query,
      queryPropertyMetric: {
        clicks: queryRow.clicks,
        impressions: queryRow.impressions,
        ctr: queryRow.ctr,
        position: queryRow.position,
      },
      pageLevelDistributionMetric: metric(pages),
      pages,
      label: "watch — not cannibalization",
    };
  })
  .filter((item) => item.pages.length >= 2)
  .sort((a, b) => b.queryPropertyMetric.impressions - a.queryPropertyMetric.impressions);

const firstIncompleteDate = daily.metadata
  .map((item) => item.firstIncompleteDate || item.first_incomplete_date)
  .filter(Boolean)
  .sort()[0] || null;
const firstIncompleteHour = hourlyProperty.metadata
  .map((item) => item.firstIncompleteHour || item.first_incomplete_hour)
  .filter(Boolean)
  .sort()[0] || null;

rawRequests.sort((a, b) => a.name.localeCompare(b.name) || a.request.startRow - b.request.startRow);
const requestDefinitions = rawRequests.map(({ name, request, response }) => ({
  name,
  ...request,
  resultCount: (response.rows || []).length,
  responseAggregationType: response.responseAggregationType,
  metadata: response.metadata || null,
}));
const generatorCodeArtifacts = Object.fromEntries(await Promise.all([
  ["snapshot-gsc-fresh-opportunities.mjs", fileURLToPath(import.meta.url)],
  ["lib/gsc-fresh-opportunities.mjs", resolve(SCRIPT_DIRECTORY, "lib", "gsc-fresh-opportunities.mjs")],
  ["verify-gsc-fresh-opportunities.mjs", resolve(SCRIPT_DIRECTORY, "verify-gsc-fresh-opportunities.mjs")],
].map(async ([name, path]) => {
  const source = await readFile(path);
  return [name, { sha256: sha256(source), bytes: source.byteLength }];
})));
const gitSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim();
const gitWorkingTreeDirty = Boolean(execFileSync("git", ["status", "--porcelain=v1"], { cwd: REPOSITORY_ROOT, encoding: "utf8" }).trim());

const privateInventory = {
  schemaVersion: 2,
  status: STATUS,
  manifest: {
    property: config.property,
    capturedAt: capturedAt.toISOString(),
    capturedAtEastern: displayInTimezone(capturedAt, REPORTING_TIMEZONE),
    requestedApiDateWindow: { startDate, endDate, timezone: SOURCE_TIMEZONE, maximumSupportedDays: 10 },
    selectedRollingWindow: {
      semantics: "24 consecutive Pacific clock-hour buckets ending with the latest API-available hour; UI browser-local bounds and refresh cutoff can differ",
      includedHourStartUtc: new Date(rollingStartMs).toISOString(),
      includedHourEndUtc: new Date(rollingEndMs).toISOString(),
      intervalEndExclusiveUtc: new Date(rollingEndExclusiveMs).toISOString(),
      includedHourStartPacific: displayInTimezone(new Date(rollingStartMs), SOURCE_TIMEZONE),
      includedHourEndPacific: displayInTimezone(new Date(rollingEndMs), SOURCE_TIMEZONE),
      includedHourStartEastern: displayInTimezone(new Date(rollingStartMs), REPORTING_TIMEZONE),
      includedHourEndEastern: displayInTimezone(new Date(rollingEndMs), REPORTING_TIMEZONE),
      nominalHourBuckets: 24,
      returnedPropertyHourRows: selectedPropertyRows.length,
    },
    dataState: { dailyCompleteness: "all", analysis: "hourly_all" },
    firstIncompleteDate,
    firstIncompleteHour,
    lastAvailableHour,
    minimumImpressions,
    sourceTimezone: SOURCE_TIMEZONE,
    reportingTimezone: REPORTING_TIMEZONE,
    queryGeographicModifierCaveat: "Query wording only; not searcher location, Local Pack geography, or Maps rank.",
    exactPageUrlGrouping: true,
    canonicalNormalizationApplied: false,
    pathMapVersion: config.pathMapVersion,
    brandDictionaryVersion: config.brandDictionary.version,
    gitSha,
    gitWorkingTreeDirty,
    generatorCodeArtifacts,
    requestDefinitions,
    rawQueryStorage: "repository-root/private-seo/gsc-fresh only",
    decisionEligible: false,
  },
  propertyTotal: propertyMetric,
  visibleQueryCoverage: {
    ...visibleQueryMetric,
    aggregationType: "byProperty",
    visibleClickCoveragePct: propertyMetric.clicks ? Number((100 * visibleQueryMetric.clicks / propertyMetric.clicks).toFixed(2)) : 0,
    visibleImpressionCoveragePct: propertyMetric.impressions ? Number((100 * visibleQueryMetric.impressions / propertyMetric.impressions).toFixed(2)) : 0,
    residualAnonymousOrSuppressedClicks: propertyMetric.clicks - visibleQueryMetric.clicks,
    residualAnonymousOrSuppressedImpressions: propertyMetric.impressions - visibleQueryMetric.impressions,
  },
  queryOnlyAnalysisAggregates: {
    aggregationType: "byProperty",
    brandBuckets: groupedMetrics(queryMetrics, "brandBucket"),
    intentBuckets: groupedMetrics(queryMetrics, "intentBucket"),
    queryGeographicModifierBuckets: groupedMetrics(queryMetrics, "queryGeographicModifierBucket"),
    positionBands: groupedMetrics(queryMetrics, "positionBand"),
  },
  pageLevelRoutingTotals: {
    aggregationType: "byPage",
    queryPageMetric: metric(queryPageMetrics),
    coverageComparisonToPropertyProhibited: true,
  },
  allClassifiedVisibleQueries: queryMetrics,
  allExactPageMetrics: pageMetrics,
  allExactQueryPageCells: queryPageMetrics,
  topPages,
  topVisibleQueries: queryMetrics
    .filter((row) => row.impressions >= minimumImpressions)
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position),
  topQueryPageCells,
  pageOverlapWatch,
  indexedUrlDiagnostics,
};

function percent(value) {
  return `${(100 * value).toFixed(2)}%`;
}

function markdownTable(headers, rows) {
  const escape = (value) => String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.map(escape).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`),
  ].join("\n");
}

const summaryMarkdown = `# Rolling 24-hour GSC opportunity inventory\n\n**${STATUS}**\n\n- Captured: ${privateInventory.manifest.capturedAtEastern}\n- Selected hours: ${privateInventory.manifest.selectedRollingWindow.includedHourStartEastern} through the hour beginning ${privateInventory.manifest.selectedRollingWindow.includedHourEndEastern}\n- API date request: ${startDate} through ${endDate} (${SOURCE_TIMEZONE})\n- First incomplete date: ${firstIncompleteDate || "not returned"}\n- First incomplete hour: ${firstIncompleteHour || "not returned"}\n- Reporting floor: ${minimumImpressions} impressions per row\n- Window caveat: 24 consecutive API hour buckets ending at the latest available hour; the Search Console UI can use a different browser-local cutoff or refresh time.\n- Geographic caveat: query modifiers describe words in the query, not the searcher's location or Local Pack/Maps rank.\n\n## Property totals\n\n- Clicks: ${propertyMetric.clicks}\n- Impressions: ${propertyMetric.impressions}\n- CTR: ${percent(propertyMetric.ctr)}\n- Average position: ${propertyMetric.position}\n- Visible-query impressions at matching by-property grain: ${visibleQueryMetric.impressions} (${privateInventory.visibleQueryCoverage.visibleImpressionCoveragePct}%)\n- Visible-query clicks at matching by-property grain: ${visibleQueryMetric.clicks} (${privateInventory.visibleQueryCoverage.visibleClickCoveragePct}%)\n\n## Top exact landing-page URLs\n\n${markdownTable(
  ["URL", "Class", "Clicks", "Impressions", "CTR", "Position"],
  topPages.slice(0, 20).map((row) => [row.page, row.urlClass, row.clicks, row.impressions, percent(row.ctr), row.position]),
)}\n\n## Top visible queries\n\n${markdownTable(
  ["Query", "Intent", "Query modifier", "Clicks", "Impressions", "CTR", "Position"],
  privateInventory.topVisibleQueries.slice(0, 30).map((row) => [row.query, row.intentBucket, row.queryGeographicModifierBucket, row.clicks, row.impressions, percent(row.ctr), row.position]),
)}\n\n## Top exact query × page cells\n\n${markdownTable(
  ["Query", "Exact page URL", "Intent", "Query modifier", "Clicks", "Impressions", "CTR", "Position"],
  topQueryPageCells.slice(0, 30).map((row) => [row.query, row.page, row.intentBucket, row.queryGeographicModifierBucket, row.clicks, row.impressions, percent(row.ctr), row.position]),
)}\n\n## Page-overlap watches\n\n${pageOverlapWatch.length ? markdownTable(
  ["Query", "By-property impressions", "Exact page URLs (by-page impressions)", "Label"],
  pageOverlapWatch.slice(0, 20).map((row) => [
    row.query,
    row.queryPropertyMetric.impressions,
    row.pages.map((page) => `${page.page} (${page.impressions})`).join("; "),
    row.label,
  ]),
) : "No non-brand query met the exact-URL overlap-watch floor."}\n\n## Indexed URL diagnostics\n\n${indexedUrlDiagnostics.length ? markdownTable(
  ["Exact URL", "Class", "Clicks", "Impressions"],
  indexedUrlDiagnostics.slice(0, 30).map((row) => [row.page, row.urlClass, row.clicks, row.impressions]),
) : "No noncanonical-origin or query-variant URL appeared in the selected page rows."}\n\nThis inventory uses preliminary hourly data and cannot authorize a title, metadata, H1, body-copy, canonical, redirect, URL, content, or internal-link change.\n`;

const rawSerialized = `${JSON.stringify(rawRequests, null, 2)}\n`;
const inventorySerialized = `${JSON.stringify(privateInventory, null, 2)}\n`;
const sanitizedManifest = {
  schemaVersion: 2,
  status: STATUS,
  manifest: privateInventory.manifest,
  propertyTotal: propertyMetric,
  visibleQueryCoverage: privateInventory.visibleQueryCoverage,
  queryOnlyAnalysisAggregates: privateInventory.queryOnlyAnalysisAggregates,
  pageLevelRoutingTotals: privateInventory.pageLevelRoutingTotals,
  counts: {
    visibleQueryRows: queryMetrics.length,
    exactPageRows: pageMetrics.length,
    exactQueryPageCells: queryPageMetrics.length,
    topPagesAtFloor: topPages.length,
    topQueriesAtFloor: privateInventory.topVisibleQueries.length,
    topQueryPageCellsAtFloor: topQueryPageCells.length,
    overlapWatchesAtFloor: pageOverlapWatch.length,
    indexedUrlDiagnostics: indexedUrlDiagnostics.length,
  },
  indexedUrlDiagnosticClassCounts: Object.fromEntries(
    [...groupRows(indexedUrlDiagnostics, (row) => row.urlClass).entries()].map(([key, values]) => [key, values.length]),
  ),
  privateArtifacts: {
    "raw-search-analytics.json": { sha256: sha256(rawSerialized), bytes: Buffer.byteLength(rawSerialized) },
    "opportunity-inventory.json": { sha256: sha256(inventorySerialized), bytes: Buffer.byteLength(inventorySerialized) },
    "summary.md": { sha256: sha256(summaryMarkdown), bytes: Buffer.byteLength(summaryMarkdown) },
  },
};

const privateRootConfigured = resolve(REPOSITORY_ROOT, "private-seo", "gsc-fresh");
const outputDirectory = await createPrivateCaptureDirectory(privateRootConfigured, captureName);

await Promise.all([
  writePrivateArtifact(outputDirectory, "raw-search-analytics.json", rawSerialized),
  writePrivateArtifact(outputDirectory, "opportunity-inventory.json", inventorySerialized),
  writePrivateArtifact(outputDirectory, "manifest-sanitized.json", `${JSON.stringify(sanitizedManifest, null, 2)}\n`),
  writePrivateArtifact(outputDirectory, "summary.md", summaryMarkdown),
]);

process.stdout.write(`${JSON.stringify({
  status: STATUS,
  outputDirectory,
  selectedRollingWindow: privateInventory.manifest.selectedRollingWindow,
  firstIncompleteDate,
  firstIncompleteHour,
  propertyTotal: propertyMetric,
  visibleQueryCoverage: privateInventory.visibleQueryCoverage,
  counts: sanitizedManifest.counts,
}, null, 2)}\n`);
