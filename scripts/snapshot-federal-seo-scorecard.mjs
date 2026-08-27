import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const API_ROOT = "https://api.spyfu.com/apis";
const authorization = process.env.SPYFU_BASE64_KEY;
assert.ok(authorization, "SPYFU_BASE64_KEY is required");

const force = process.argv.includes("--force");
const outputArgument = process.argv.indexOf("--output");
const explicitOutput = outputArgument >= 0 ? process.argv[outputArgument + 1] : null;
const DOMAINS = ["dmvtitleguy.io", "federaltitle.com"];
const COUNTRY = "US";
const UNIVERSE_VERSION = "v1-2026-08-25";
const KEYWORDS = [
  ["property-survey", "land survey", 3100],
  ["property-survey", "types of surveys", 2400],
  ["property-survey", "property survey", 2200],
  ["property-survey", "boundary survey", 1200],
  ["property-survey", "property line survey", 810],
  ["firpta", "firpta", 6600],
  ["firpta", "firpta exemptions", 1200],
  ["firpta", "firpta withholding", 1000],
  ["firpta", "firpta certificate", 360],
  ["dc-tax", "homestead dc", 840],
  ["dc-tax", "dc real estate taxes", 630],
  ["dc-tax", "dc property tax rate", 440],
  ["dc-tax", "dc homestead deduction", 400],
  ["dc-tax", "dc tax abatement program", 340],
  ["seller-proceeds", "net sheet calculator", 570],
  ["seller-proceeds", "seller closing cost calculator", 480],
  ["seller-proceeds", "closing cost estimator for seller", 400],
  ["seller-proceeds", "seller net sheet calculator virginia", 380],
  ["title-fees", "title insurance cost", 2500],
  ["title-fees", "title settlement fee", 1100],
  ["title-fees", "typical title company fees", 660],
  ["title-fees", "lender's title insurance cost", 460],
  ["title-fees", "how much does title insurance cost", 400],
].map(([cluster, keyword, searchVolume]) => ({ cluster, keyword, searchVolume }));

const requestLog = [];
async function spyfu(endpoint, params) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_ROOT}${endpoint}?${query}`, {
    headers: { Authorization: `Basic ${authorization}` },
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) throw new Error(`SpyFu ${endpoint} returned HTTP ${response.status}`);
  const body = await response.json();
  requestLog.push({ endpoint, params: Object.fromEntries(query), resultCount: Array.isArray(body.results) ? body.results.length : 0, body });
  return body;
}

function latestDomainStat(results) {
  return [...results].sort((a, b) => Number(b.searchYear) - Number(a.searchYear) || Number(b.searchMonth) - Number(a.searchMonth))[0];
}

function keywordMap(results) {
  const map = new Map();
  for (const result of results) {
    const keyword = String(result.keyword || "").trim().toLowerCase();
    if (!keyword) continue;
    const prior = map.get(keyword);
    if (!prior || Number(result.rank) < Number(prior.rank)) map.set(keyword, result);
  }
  return map;
}

function round(value, decimals = 4) {
  return Number(value.toFixed(decimals));
}

function fixedMetrics(rankings, rows = KEYWORDS) {
  const totalVolume = rows.reduce((sum, item) => sum + item.searchVolume, 0);
  const top3Volume = rows.filter((item) => rankings.get(item.keyword)?.rank <= 3).reduce((sum, item) => sum + item.searchVolume, 0);
  const pageOneVolume = rows.filter((item) => rankings.get(item.keyword)?.rank <= 10).reduce((sum, item) => sum + item.searchVolume, 0);
  const weightedReciprocalRank = rows.reduce((sum, item) => {
    const rank = Number(rankings.get(item.keyword)?.rank || 0);
    return sum + (rank > 0 && rank <= 100 ? item.searchVolume / rank : 0);
  }, 0) / totalVolume;
  return {
    keywordCount: rows.length,
    totalSearchVolume: totalVolume,
    searchVolumeWeightedTop3SharePct: round(100 * top3Volume / totalVolume, 2),
    searchVolumeWeightedPageOneSharePct: round(100 * pageOneVolume / totalVolume, 2),
    searchVolumeWeightedReciprocalRank: round(weightedReciprocalRank, 6),
  };
}

async function urlHealth(urls) {
  const results = [];
  const queue = [...urls];
  await Promise.all(Array.from({ length: 10 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(15_000) });
        results.push({ url, status: response.status, location: response.headers.get("location") });
      } catch (error) {
        results.push({ url, status: null, error: error instanceof Error ? error.name : "fetch-error" });
      }
    }
  }));
  return results;
}

const capturedAt = new Date().toISOString();
const snapshots = {};
for (const domain of DOMAINS) {
  const [history, keywordResponse, topPagesResponse] = await Promise.all([
    spyfu("/domain_stats_api/v2/getAllDomainStats", { domain, countryCode: COUNTRY }),
    spyfu("/serp_api/v2/seo/getSeoKeywords", { query: domain, searchType: "MostValuable", pageSize: "10000", countryCode: COUNTRY, sortBy: "SearchVolume", sortOrder: "Descending", startingRow: "1", adultFilter: "true", exactMatch: "false" }),
    spyfu("/serp_api/v2/seo/getMostTrafficTopPages", { query: domain, pageSize: "50", countryCode: COUNTRY, sortBy: "SeoClicks", sortOrder: "Descending", startingRow: "1" }),
  ]);
  const latest = latestDomainStat(history.results || []);
  assert.ok(latest, `SpyFu returned no domain history for ${domain}`);
  const rankings = keywordMap(keywordResponse.results || []);
  const fixedUniverseRankings = KEYWORDS.map((item) => {
    const result = rankings.get(item.keyword);
    return { ...item, rank: result ? Number(result.rank) : null, url: result?.topRankedUrl || null, estimatedClicks: result ? Number(result.seoClicks || 0) : 0 };
  });
  const topPageUrls = [...new Set((topPagesResponse.results || []).map((row) => row.url || row.page || row.topRankedUrl).filter((url) => typeof url === "string"))].slice(0, 50);
  const health = await urlHealth(topPageUrls);
  const clusters = Object.fromEntries([...new Set(KEYWORDS.map((item) => item.cluster))].map((cluster) => {
    const rows = KEYWORDS.filter((item) => item.cluster === cluster);
    return [cluster, fixedMetrics(rankings, rows)];
  }));
  snapshots[domain] = {
    spyfuDataMonth: `${latest.searchYear}-${String(latest.searchMonth).padStart(2, "0")}`,
    rankingKeywords: Number(latest.totalOrganicResults || 0),
    estimatedMonthlyOrganicClicks: Number(latest.monthlyOrganicClicks || 0),
    estimatedMonthlyOrganicValue: Number(latest.monthlyOrganicValue || 0),
    averageOrganicRank: Number(latest.averageOrganicRank || 0),
    fixedUniverse: { version: UNIVERSE_VERSION, ...fixedMetrics(rankings), clusters, rankings: fixedUniverseRankings },
    top50UrlHealth: {
      method: "SpyFu getMostTrafficTopPages ordered by SeoClicks; direct HEAD request with redirects disabled",
      requested: 50,
      returned: topPageUrls.length,
      http200: health.filter((item) => item.status === 200).length,
      http200SharePct: health.length ? round(100 * health.filter((item) => item.status === 200).length / health.length, 2) : null,
      results: health,
    },
  };
}

const dataMonths = new Set(DOMAINS.map((domain) => snapshots[domain].spyfuDataMonth));
assert.equal(dataMonths.size, 1, "SpyFu returned different data months for the two domains");
const dataMonth = [...dataMonths][0];
const outputPath = explicitOutput || resolve("docs", "seo-scorecards", "monthly", `${dataMonth}.json`);
try {
  await readFile(outputPath, "utf8");
  assert.ok(force, `A normalized SpyFu snapshot already exists for ${dataMonth}; use --force only to correct a documented capture defect`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const dmv = snapshots["dmvtitleguy.io"];
const federal = snapshots["federaltitle.com"];
let dmvWins = 0;
let federalWins = 0;
let ties = 0;
for (let index = 0; index < KEYWORDS.length; index += 1) {
  const dmvRank = dmv.fixedUniverse.rankings[index].rank || 101;
  const federalRank = federal.fixedUniverse.rankings[index].rank || 101;
  if (dmvRank < federalRank) dmvWins += 1;
  else if (federalRank < dmvRank) federalWins += 1;
  else ties += 1;
}
const clusterLeadership = Object.fromEntries(Object.keys(dmv.fixedUniverse.clusters).map((cluster) => {
  const dmvValue = dmv.fixedUniverse.clusters[cluster].searchVolumeWeightedReciprocalRank;
  const federalValue = federal.fixedUniverse.clusters[cluster].searchVolumeWeightedReciprocalRank;
  return [cluster, dmvValue > federalValue ? "dmvtitleguy.io" : federalValue > dmvValue ? "federaltitle.com" : "tie"];
}));
const dmvClusterLeads = Object.values(clusterLeadership).filter((leader) => leader === "dmvtitleguy.io").length;
const currentPass = {
  tenPercentDomainClicksLead: dmv.estimatedMonthlyOrganicClicks >= federal.estimatedMonthlyOrganicClicks * 1.1,
  fixedUniverseContinuousVisibilityLead: dmv.fixedUniverse.searchVolumeWeightedReciprocalRank > federal.fixedUniverse.searchVolumeWeightedReciprocalRank,
  fixedUniverseTop3Lead: dmv.fixedUniverse.searchVolumeWeightedTop3SharePct > federal.fixedUniverse.searchVolumeWeightedTop3SharePct,
  fixedUniversePageOneLead: dmv.fixedUniverse.searchVolumeWeightedPageOneSharePct > federal.fixedUniverse.searchVolumeWeightedPageOneSharePct,
  atLeastThreeOfFiveClusterLeads: dmvClusterLeads >= 3,
};
currentPass.all = Object.values(currentPass).every(Boolean);

const monthlyDir = resolve("docs", "seo-scorecards", "monthly");
let priorSnapshots = [];
try {
  for (const file of await readdir(monthlyDir)) {
    if (!/^\d{4}-\d{2}\.json$/.test(file) || file === `${dataMonth}.json`) continue;
    priorSnapshots.push(JSON.parse(await readFile(resolve(monthlyDir, file), "utf8")));
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const distinct = [...priorSnapshots.map((item) => ({ dataMonth: item.manifest?.spyfuDataMonth, pass: Boolean(item.competitiveTests?.currentPass?.all) })), { dataMonth, pass: currentPass.all }]
  .filter((item) => item.dataMonth)
  .sort((a, b) => b.dataMonth.localeCompare(a.dataMonth));
let consecutivePassingMonths = 0;
for (const item of distinct) {
  if (!item.pass) break;
  consecutivePassingMonths += 1;
}

const rawDir = resolve("private-seo", "spyfu", capturedAt.replace(/[:.]/g, "-"));
await mkdir(rawDir, { recursive: true });
const rawArtifacts = [];
for (const entry of requestLog) {
  const safeDomain = entry.params.domain || entry.params.query || "request";
  const name = `${safeDomain.replace(/[^a-z0-9.-]/gi, "-")}-${entry.endpoint.split("/").at(-1)}.json`;
  const serialized = `${JSON.stringify(entry.body, null, 2)}\n`;
  await writeFile(resolve(rawDir, name), serialized, { mode: 0o600 });
  rawArtifacts.push({ name, endpoint: entry.endpoint, params: entry.params, resultCount: entry.resultCount, sha256: createHash("sha256").update(serialized).digest("hex"), bytes: Buffer.byteLength(serialized) });
}

const report = {
  schemaVersion: 2,
  manifest: {
    capturedAt,
    spyfuDataMonth: dataMonth,
    countryCode: COUNTRY,
    device: null,
    deviceNote: "The selected SpyFu endpoints do not expose a device parameter; no device claim is made.",
    keywordDatasetMonthNote: "getSeoKeywords and getMostTrafficTopPages are current snapshots without an explicit month parameter; the domain-stats month is the persisted comparison month.",
    gitSha: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    fixedUniverseVersion: UNIVERSE_VERSION,
    rawArtifacts,
  },
  domains: snapshots,
  competitiveTests: {
    fullDomain: {
      dmvClicks: dmv.estimatedMonthlyOrganicClicks,
      federalClicks: federal.estimatedMonthlyOrganicClicks,
      clickRatio: federal.estimatedMonthlyOrganicClicks ? round(dmv.estimatedMonthlyOrganicClicks / federal.estimatedMonthlyOrganicClicks, 4) : null,
      requiredRatio: 1.1,
    },
    fixedUniverse: { unweightedKeywordWins: { dmv: dmvWins, federal: federalWins, ties }, clusterLeadership, dmvClusterLeads },
    currentPass,
    consecutivePassingDistinctDataMonths: consecutivePassingMonths,
    requiredConsecutiveMonths: 3,
    surpassed: consecutivePassingMonths >= 3,
  },
};

await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, dataMonth, capturedAt, fullDomain: report.competitiveTests.fullDomain, fixedUniverse: report.competitiveTests.fixedUniverse, currentPass, consecutivePassingMonths, surpassed: report.competitiveTests.surpassed }, null, 2));
