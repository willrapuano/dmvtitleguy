import assert from "node:assert/strict";
import { createHash, createSign } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const config = JSON.parse(await readFile(new URL("../config/seo-checkpoints.json", import.meta.url), "utf8"));
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const windowName = args.get("--window") || "custom";
const configuredWindow = config.windows[windowName];
const startDate = args.get("--start") || configuredWindow?.startDate;
const endDate = args.get("--end") || configuredWindow?.endDate;
const outputPath = args.get("--output");
assert.match(startDate || "", /^\d{4}-\d{2}-\d{2}$/, "--start or a configured --window is required");
assert.match(endDate || "", /^\d{4}-\d{2}-\d{2}$/, "--end or a configured --window is required");
if (configuredWindow?.notBefore) {
  assert.ok(new Date() >= new Date(`${configuredWindow.notBefore}T00:00:00-04:00`), `${windowName} data must not be pulled before ${configuredWindow.notBefore}`);
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
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error(`Google OAuth returned HTTP ${response.status}`);
  return body.access_token;
}

const token = await accessToken();
async function googleJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
    signal: AbortSignal.timeout(30_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Google API ${new URL(url).pathname} returned HTTP ${response.status}: ${body.error?.message || "unknown"}`);
  return body;
}

const propertyEncoded = encodeURIComponent(config.property);
const searchEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${propertyEncoded}/searchAnalytics/query`;
const rawRequests = [];
async function searchAnalytics(name, dimensions) {
  const rows = [];
  const baseRequest = { startDate, endDate, dimensions, dataState: "final", rowLimit: 25000, aggregationType: "auto" };
  for (let startRow = 0; ; startRow += 25000) {
    const request = { ...baseRequest, startRow };
    const response = await googleJson(searchEndpoint, { method: "POST", body: JSON.stringify(request) });
    const pageRows = response.rows || [];
    rows.push(...pageRows);
    rawRequests.push({ name, request, response: { rows: pageRows, responseAggregationType: response.responseAggregationType || null } });
    if (pageRows.length < 25000) break;
  }
  return rows;
}

const [totalsRows, dailyRows, pageRows, queryPageRows] = await Promise.all([
  searchAnalytics("property-total", []),
  searchAnalytics("property-daily", ["date"]),
  searchAnalytics("page", ["page"]),
  searchAnalytics("query-page", ["query", "page"]),
]);

const sitemaps = await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${propertyEncoded}/sitemaps`);
const inspections = [];
for (const path of config.priorityPaths) {
  const result = await googleJson("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    body: JSON.stringify({ inspectionUrl: `https://dmvtitleguy.io${path}`, siteUrl: config.property, languageCode: "en-US" }),
  });
  inspections.push({ path, result });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const generatedAt = new Date().toISOString();
const captureId = generatedAt.replace(/[:.]/g, "-");
const rawDir = resolve("private-seo", "gsc", captureId);
await mkdir(rawDir, { recursive: true });
const rawArtifacts = [];
for (const [name, data] of [
  ["search-analytics.json", rawRequests],
  ["sitemaps.json", sitemaps],
  ["url-inspection.json", inspections],
]) {
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(resolve(rawDir, name), serialized, { mode: 0o600 });
  rawArtifacts.push({ name, sha256: sha256(serialized), bytes: Buffer.byteLength(serialized) });
}

function metric(rows) {
  return rows.reduce((sum, row) => ({
    clicks: sum.clicks + Number(row.clicks || 0),
    impressions: sum.impressions + Number(row.impressions || 0),
    weightedPosition: sum.weightedPosition + Number(row.position || 0) * Number(row.impressions || 0),
  }), { clicks: 0, impressions: 0, weightedPosition: 0 });
}

function finishMetric(value) {
  return {
    clicks: value.clicks,
    impressions: value.impressions,
    ctr: value.impressions ? Number((value.clicks / value.impressions).toFixed(6)) : 0,
    position: value.impressions ? Number((value.weightedPosition / value.impressions).toFixed(2)) : null,
  };
}

function pathFromPage(page) {
  try { return new URL(page).pathname.replace(/\/$/, "") || "/"; } catch { return "/invalid"; }
}

function classifyBrand(query) {
  const normalized = query.toLowerCase();
  for (const category of ["owned", "partner", "competitor"]) {
    if (config.brandDictionary[category].some((term) => normalized.includes(term))) return `${category}-brand`;
  }
  return "visible-known-non-brand";
}

function clusterFor(query) {
  const normalized = query.toLowerCase();
  for (const [cluster, terms] of Object.entries(config.clusters)) {
    if (terms.some((term) => normalized.includes(term))) return cluster;
  }
  return "unclassified";
}

const propertyTotal = finishMetric(metric(totalsRows));
const visibleTotal = finishMetric(metric(queryPageRows));
const categories = {};
const clusters = {};
const pathClusters = {};
for (const row of queryPageRows) {
  const query = String(row.keys?.[0] || "");
  const path = pathFromPage(String(row.keys?.[1] || ""));
  const category = classifyBrand(query);
  const cluster = clusterFor(query);
  categories[category] ||= [];
  categories[category].push(row);
  clusters[cluster] ||= [];
  clusters[cluster].push(row);
  const cell = `${path}::${cluster}`;
  pathClusters[cell] ||= [];
  pathClusters[cell].push(row);
}

function summarizedGroups(groups, minimumImpressions = 0) {
  return Object.fromEntries(Object.entries(groups).map(([name, rows]) => [name, finishMetric(metric(rows))]).filter(([, value]) => value.impressions >= minimumImpressions));
}

const aggregate = {
  schemaVersion: 1,
  manifest: {
    property: config.property,
    window: { name: windowName, startDate, endDate },
    generatedAt,
    gitSha: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
    releaseTimestamp: process.env.RELEASE_TIMESTAMP || null,
    sourceTimezone: config.sourceTimezone,
    reportingTimezone: config.reportingTimezone,
    joinGrain: "period x normalized-path x cluster; never person x query",
    dataState: "final",
    pathMapVersion: config.pathMapVersion,
    brandDictionaryVersion: config.brandDictionary.version,
    requestDefinitions: rawRequests.map(({ name, request, response }) => ({ name, ...request, resultCount: response.rows.length })),
    rawArtifacts,
  },
  propertyTotal,
  visibleQueryCoverage: {
    visibleClicks: visibleTotal.clicks,
    visibleImpressions: visibleTotal.impressions,
    totalClicks: propertyTotal.clicks,
    totalImpressions: propertyTotal.impressions,
    visibleClickCoveragePct: propertyTotal.clicks ? Number((100 * visibleTotal.clicks / propertyTotal.clicks).toFixed(2)) : 0,
    visibleImpressionCoveragePct: propertyTotal.impressions ? Number((100 * visibleTotal.impressions / propertyTotal.impressions).toFixed(2)) : 0,
    residualUnclassifiedClicks: Math.max(0, propertyTotal.clicks - visibleTotal.clicks),
    residualUnclassifiedImpressions: Math.max(0, propertyTotal.impressions - visibleTotal.impressions),
  },
  visibleQueryCategories: summarizedGroups(categories),
  visibleQueryClusters: summarizedGroups(clusters),
  pathClusterCellsMinimumFiveImpressions: summarizedGroups(pathClusters, 5),
  pageMetrics: Object.fromEntries(pageRows.map((row) => [pathFromPage(row.keys?.[0]), finishMetric(metric([row]))])),
  finalDataThrough: dailyRows.map((row) => row.keys?.[0]).filter(Boolean).sort().at(-1) || null,
  sitemaps: (sitemaps.sitemap || []).map((item) => ({ path: item.path, isPending: item.isPending, isSitemapsIndex: item.isSitemapsIndex, lastSubmitted: item.lastSubmitted, errors: item.errors, warnings: item.warnings })),
  priorityUrlInspection: inspections.map(({ path, result }) => {
    const index = result.inspectionResult?.indexStatusResult || {};
    return { path, verdict: index.verdict || null, coverageState: index.coverageState || null, indexingState: index.indexingState || null, pageFetchState: index.pageFetchState || null, robotsTxtState: index.robotsTxtState || null, googleCanonical: index.googleCanonical || null, userCanonical: index.userCanonical || null, lastCrawlTime: index.lastCrawlTime || null };
  }),
};

const serialized = `${JSON.stringify(aggregate, null, 2)}\n`;
if (outputPath) {
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(resolve(outputPath), serialized);
}
process.stdout.write(serialized);
