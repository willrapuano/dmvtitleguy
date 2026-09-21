import assert from "node:assert/strict";

export async function paginateGhlOpportunities({ fetchPage, pageSize = 100, maxPages = 1_000 }) {
  assert.equal(typeof fetchPage, "function", "fetchPage must be a function");
  assert.ok(Number.isInteger(pageSize) && pageSize >= 1 && pageSize <= 100, "pageSize must be between 1 and 100");
  assert.ok(Number.isInteger(maxPages) && maxPages >= 1, "maxPages must be a positive integer");

  const opportunities = [];
  const seenOpportunityIds = new Set();
  const seenPages = new Set();
  let page = 1;
  let declaredTotal = null;

  for (let requestCount = 0; requestCount < maxPages; requestCount += 1) {
    assert.ok(!seenPages.has(page), "GHL pagination repeated a page");
    seenPages.add(page);

    const body = await fetchPage({ page, limit: pageSize });
    const pageRows = body?.opportunities;
    assert.ok(Array.isArray(pageRows), "GHL opportunity search returned an invalid opportunities collection");

    const responseTotal = Number(body?.meta?.total ?? body?.total);
    if (Number.isFinite(responseTotal)) {
      assert.ok(Number.isInteger(responseTotal) && responseTotal >= 0, "GHL opportunity total must be a non-negative integer");
      if (declaredTotal === null) declaredTotal = responseTotal;
      else assert.equal(responseTotal, declaredTotal, "GHL opportunity total changed during pagination");
    }

    for (const opportunity of pageRows) {
      assert.ok(opportunity?.id, "GHL opportunity search returned a row without an id");
      assert.ok(!seenOpportunityIds.has(opportunity.id), "GHL opportunity pagination returned a duplicate id");
      seenOpportunityIds.add(opportunity.id);
      opportunities.push(opportunity);
    }

    if (declaredTotal !== null && opportunities.length >= declaredTotal) {
      assert.equal(opportunities.length, declaredTotal, "GHL opportunity rows did not reconcile to the declared total");
      return { opportunities, pages: seenPages.size, total: declaredTotal };
    }
    if (pageRows.length === 0 || pageRows.length < pageSize) {
      if (declaredTotal !== null) {
        assert.equal(opportunities.length, declaredTotal, "GHL opportunity pagination ended before the declared total");
      }
      return { opportunities, pages: seenPages.size, total: declaredTotal ?? opportunities.length };
    }

    const nextPage = Number(body?.meta?.nextPage);
    page = Number.isInteger(nextPage) && nextPage > page ? nextPage : page + 1;
  }

  assert.fail(`GHL opportunity search exceeded ${maxPages} pages`);
}

export function sanitizeOperationsReport(report) {
  const incidentsByKey = new Map();
  for (const item of report.incidents || []) {
    const code = String(item.code || "unknown-incident");
    const severity = String(item.severity || "unknown");
    const key = `${severity}:${code}`;
    const current = incidentsByKey.get(key) || { code, severity, count: 0 };
    current.count += 1;
    incidentsByKey.set(key, current);
  }

  const incidents = [...incidentsByKey.values()].sort(
    (left, right) => left.severity.localeCompare(right.severity) || left.code.localeCompare(right.code),
  );

  return {
    schemaVersion: 2,
    checkedAt: report.checkedAt,
    origin: report.origin,
    priorityPages: (report.priorityPages || []).map((page) => ({
      path: page.path,
      status: page.status,
      canonicalMatches: page.canonical === `https://dmvtitleguy.io${page.path}`,
      noindex: Boolean(page.noindex),
      sitemapListed: Boolean(page.sitemapListed),
    })),
    aliases: (report.aliases || []).map((alias) => ({
      aliasType: alias.alias?.startsWith("http://") ? "http" : "www",
      status: alias.status,
      canonicalRedirect: typeof alias.location === "string" && alias.location.startsWith("https://dmvtitleguy.io"),
    })),
    ledger: {
      total: Number(report.ledger?.total || 0),
      nonQa: Number(report.ledger?.nonQa || 0),
      qa: Number(report.ledger?.qa || 0),
      outboxPending: Number(report.ledger?.outboxPending || 0),
    },
    ghl: {
      opportunities: Number(report.ghl?.opportunities || 0),
      pages: Number(report.ghl?.pages || 0),
      mappedSubmissions: Number(report.ghl?.mappedSubmissions || 0),
      qaExcluded: Number(report.ghl?.qaExcluded || 0),
      reusedOpportunityCards: Number(report.ghl?.reusedOpportunityCards || 0),
    },
    incidents,
    healthy: Boolean(report.healthy) && incidents.length === 0,
  };
}
