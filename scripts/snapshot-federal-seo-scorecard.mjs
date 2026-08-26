import assert from "node:assert/strict";

const API_ROOT = "https://api.spyfu.com/apis";
const authorization = process.env.SPYFU_BASE64_KEY;
assert.ok(authorization, "SPYFU_BASE64_KEY is required");

const DOMAINS = ["dmvtitleguy.io", "federaltitle.com"];
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

async function spyfu(path) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Authorization: `Basic ${authorization}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`SpyFu ${path.split("?", 1)[0]} returned HTTP ${response.status}`);
  return response.json();
}

function latestDomainStat(results) {
  return [...results].sort((a, b) => b.searchYear - a.searchYear || b.searchMonth - a.searchMonth)[0];
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

function roundShare(value) {
  return Number((value * 100).toFixed(2));
}

const totalVolume = KEYWORDS.reduce((sum, item) => sum + item.searchVolume, 0);
const snapshots = {};

for (const domain of DOMAINS) {
  const [history, keywordResponse] = await Promise.all([
    spyfu(`/domain_stats_api/v2/getAllDomainStats?domain=${encodeURIComponent(domain)}`),
    spyfu(`/serp_api/v2/seo/getSeoKeywords?query=${encodeURIComponent(domain)}&pageSize=10000`),
  ]);
  const latest = latestDomainStat(history.results || []);
  assert.ok(latest, `SpyFu returned no domain history for ${domain}`);
  const rankings = keywordMap(keywordResponse.results || []);
  const fixedUniverse = KEYWORDS.map((item) => {
    const result = rankings.get(item.keyword);
    return {
      ...item,
      rank: result ? Number(result.rank) : null,
      url: result?.topRankedUrl || null,
      estimatedClicks: result ? Number(result.seoClicks || 0) : 0,
    };
  });
  const weightedTop3 = fixedUniverse.filter((item) => item.rank && item.rank <= 3).reduce((sum, item) => sum + item.searchVolume, 0);
  const weightedPageOne = fixedUniverse.filter((item) => item.rank && item.rank <= 10).reduce((sum, item) => sum + item.searchVolume, 0);
  snapshots[domain] = {
    spyfuMonth: `${latest.searchYear}-${String(latest.searchMonth).padStart(2, "0")}`,
    rankingKeywords: Number(latest.totalOrganicResults || 0),
    estimatedMonthlyOrganicClicks: Number(latest.monthlyOrganicClicks || 0),
    estimatedMonthlyOrganicValue: Number(latest.monthlyOrganicValue || 0),
    averageOrganicRank: Number(latest.averageOrganicRank || 0),
    fixedUniverse: {
      version: "v1-2026-08-25",
      keywordCount: KEYWORDS.length,
      totalSearchVolume: totalVolume,
      searchVolumeWeightedTop3SharePct: roundShare(weightedTop3 / totalVolume),
      searchVolumeWeightedPageOneSharePct: roundShare(weightedPageOne / totalVolume),
      rankings: fixedUniverse,
    },
  };
}

const dmv = snapshots["dmvtitleguy.io"];
const federal = snapshots["federaltitle.com"];
console.log(JSON.stringify({
  capturedAt: new Date().toISOString(),
  database: "SpyFu US SEO API; identical request definitions for both domains",
  domains: snapshots,
  currentCompetitiveConditions: {
    domainClicksLead: dmv.estimatedMonthlyOrganicClicks > federal.estimatedMonthlyOrganicClicks,
    fixedUniverseTop3Lead: dmv.fixedUniverse.searchVolumeWeightedTop3SharePct > federal.fixedUniverse.searchVolumeWeightedTop3SharePct,
    fixedUniversePageOneLead: dmv.fixedUniverse.searchVolumeWeightedPageOneSharePct > federal.fixedUniverse.searchVolumeWeightedPageOneSharePct,
    consecutivePassingMonths: 0,
    requiredConsecutiveMonths: 3,
  },
}, null, 2));
