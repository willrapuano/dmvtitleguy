import assert from "node:assert/strict";
import { paginateGhlOpportunities, sanitizeOperationsReport } from "./lib/seo-operations.mjs";

const fixtures = Array.from({ length: 205 }, (_, index) => ({ id: `opportunity-${index + 1}` }));
const requestedPages = [];
const paginated = await paginateGhlOpportunities({
  fetchPage: async ({ page, limit }) => {
    requestedPages.push(page);
    const start = (page - 1) * limit;
    return {
      opportunities: fixtures.slice(start, start + limit),
      meta: {
        total: fixtures.length,
        nextPage: page + 1,
      },
    };
  },
});
assert.deepEqual(requestedPages, [1, 2, 3]);
assert.equal(paginated.opportunities.length, 205);
assert.equal(paginated.pages, 3);
assert.equal(paginated.total, 205);

await assert.rejects(
  paginateGhlOpportunities({
    pageSize: 2,
    fetchPage: async ({ page }) => ({
      opportunities: page === 1 ? [{ id: "duplicate" }, { id: "second" }] : [{ id: "duplicate" }],
      meta: { total: 3 },
    }),
  }),
  /duplicate id/,
);

await assert.rejects(
  paginateGhlOpportunities({
    pageSize: 2,
    fetchPage: async () => ({ opportunities: [{ id: "only-row" }], meta: { total: 2 } }),
  }),
  /ended before the declared total/,
);

const sanitized = sanitizeOperationsReport({
  checkedAt: "2026-08-28T20:00:00.000Z",
  origin: "https://dmvtitleguy.io",
  priorityPages: [{
    path: "/about-will-rapuano",
    status: 200,
    canonical: "https://dmvtitleguy.io/about-will-rapuano",
    noindex: false,
    sitemapListed: true,
  }],
  aliases: [{ alias: "http://dmvtitleguy.io", status: 308, location: "https://dmvtitleguy.io/" }],
  ledger: { total: 4, nonQa: 3, qa: 1, outboxPending: 1, outbox: [{ submissionId: "private-submission" }] },
  ghl: {
    pipelineId: "private-pipeline",
    opportunities: 2,
    pages: 1,
    mappedSubmissions: 1,
    qaExcluded: 1,
    reusedOpportunityCards: 0,
  },
  incidents: [
    { code: "ghl-sync-error", severity: "P0", submissionId: "private-submission", codeDetail: "private-error" },
    { code: "ghl-sync-error", severity: "P0", submissionId: "another-private-submission" },
  ],
  healthy: false,
});
const serialized = JSON.stringify(sanitized);
assert.ok(!serialized.includes("private-submission"));
assert.ok(!serialized.includes("private-pipeline"));
assert.ok(!serialized.includes("private-error"));
assert.deepEqual(sanitized.incidents, [{ code: "ghl-sync-error", severity: "P0", count: 2 }]);
assert.equal(sanitized.priorityPages[0].canonicalMatches, true);
assert.equal(sanitized.healthy, false);

console.log("SEO operations verification passed: pagination is complete and public health output is sanitized");
