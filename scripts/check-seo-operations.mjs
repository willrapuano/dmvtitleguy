import assert from "node:assert/strict";
import { createClient } from "@libsql/client";
import { paginateGhlOpportunities, sanitizeOperationsReport } from "./lib/seo-operations.mjs";

function failClosed() {
  console.error(JSON.stringify({
    schemaVersion: 2,
    healthy: false,
    error: { code: "CHECKPOINT_HEALTH_EXECUTION_FAILED" },
  }));
  process.exit(1);
}

process.on("uncaughtException", failClosed);
process.on("unhandledRejection", failClosed);

const origin = (process.env.TARGET_ORIGIN || "https://dmvtitleguy.io").replace(/\/$/, "");
const priorityPaths = [
  "/calculators/seller-net-sheet",
  "/blog/firpta-explained-dmv",
  "/blog/types-of-property-surveys-dc-md-va",
  "/about-will-rapuano",
  "/why-choose-us",
];
const transactionForms = new Set(["quote", "request-title-review", "upload-contract", "investor-due-diligence"]);
const incidents = [];

function incident(code, severity, details = {}) {
  incidents.push({ code, severity, ...details });
}

function canonicalFrom(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || null;
}

function noindexFrom(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20_000) });
  return { response, text: await response.text() };
}

const sitemapResult = await fetchText(`${origin}/sitemap.xml`);
if (sitemapResult.response.status !== 200) incident("sitemap-http", "P1", { status: sitemapResult.response.status });
if (/<parsererror|<html/i.test(sitemapResult.text)) incident("sitemap-invalid", "P1");

const pages = [];
for (const path of priorityPaths) {
  const { response, text } = await fetchText(`${origin}${path}`);
  const canonical = canonicalFrom(text);
  const expectedCanonical = `https://dmvtitleguy.io${path}`;
  const noindex = noindexFrom(text);
  const sitemapListed = sitemapResult.text.includes(`<loc>${expectedCanonical}</loc>`);
  pages.push({ path, status: response.status, canonical, noindex, sitemapListed });
  if (response.status !== 200) incident("priority-url-http", "P1", { path, status: response.status });
  if (canonical !== expectedCanonical) incident("priority-url-canonical", "P1", { path, canonical });
  if (noindex) incident("priority-url-noindex", "P1", { path });
  if (!sitemapListed) incident("priority-url-not-in-sitemap", "P1", { path });
}

const aliases = [];
for (const alias of ["https://www.dmvtitleguy.io", "http://dmvtitleguy.io"]) {
  const response = await fetch(alias, { redirect: "manual", signal: AbortSignal.timeout(20_000) });
  const location = response.headers.get("location");
  aliases.push({ alias, status: response.status, location });
  if (![301, 302, 307, 308].includes(response.status) || !location?.startsWith("https://dmvtitleguy.io")) {
    incident("canonical-alias-unexpected", "P1", { alias, status: response.status, location });
  }
}

const dbUrl = process.env.TURSO_DATABASE_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;
assert.ok(dbUrl && dbUrl !== "file:dev.db", "TURSO_DATABASE_URL is required");
assert.ok(dbToken, "TURSO_AUTH_TOKEN is required");
const db = createClient({ url: dbUrl, authToken: dbToken });
let ledgerRows;
let outboxRows;
try {
  const ledger = await db.execute(`SELECT
    "id", "status", "formType", "submittedAt", "updatedAt", "lastAttemptAt",
    "ghlContactId", "ghlOpportunityId", "ghlSyncStatus", "ghlSyncErrorCode", "isQa"
    FROM "LeadSubmission" ORDER BY "submittedAt" DESC`);
  ledgerRows = ledger.rows.map((row) => ({
    id: String(row.id),
    status: String(row.status),
    formType: row.formType ? String(row.formType) : null,
    submittedAt: row.submittedAt ? String(row.submittedAt) : null,
    updatedAt: row.updatedAt ? String(row.updatedAt) : null,
    lastAttemptAt: row.lastAttemptAt ? String(row.lastAttemptAt) : null,
    ghlContactId: row.ghlContactId ? String(row.ghlContactId) : null,
    ghlOpportunityId: row.ghlOpportunityId ? String(row.ghlOpportunityId) : null,
    ghlSyncStatus: String(row.ghlSyncStatus),
    ghlSyncErrorCode: row.ghlSyncErrorCode ? String(row.ghlSyncErrorCode) : null,
    isQa: Boolean(row.isQa),
  }));
  const outbox = await db.execute(`SELECT "submissionId", "attempts", "nextAttemptAt", "lastAttemptAt", "lastErrorCode", "expiresAt" FROM "LeadOpportunityOutbox"`);
  outboxRows = outbox.rows.map((row) => ({
    submissionId: String(row.submissionId),
    attempts: Number(row.attempts),
    nextAttemptAt: String(row.nextAttemptAt),
    lastAttemptAt: row.lastAttemptAt ? String(row.lastAttemptAt) : null,
    lastErrorCode: row.lastErrorCode ? String(row.lastErrorCode) : null,
    expiresAt: String(row.expiresAt),
  }));
} finally {
  db.close();
}

const now = Date.now();
const nonQa = ledgerRows.filter((row) => !row.isQa);
for (const row of nonQa) {
  const transaction = row.formType && transactionForms.has(row.formType);
  const ageFrom = Date.parse(row.lastAttemptAt || row.updatedAt || row.submittedAt || "");
  const ageMinutes = Number.isFinite(ageFrom) ? (now - ageFrom) / 60_000 : Infinity;
  if (row.status === "unknown") incident("lead-delivery-unknown", "P0", { submissionId: row.id });
  if (row.status === "sending" && ageMinutes > 5) incident("lead-delivery-sending-stale", "P0", { submissionId: row.id, ageMinutes: Math.floor(ageMinutes) });
  if (transaction && row.status === "delivered" && row.ghlSyncStatus === "error") incident("ghl-sync-error", "P0", { submissionId: row.id, code: row.ghlSyncErrorCode });
  if (transaction && row.status === "delivered" && row.ghlSyncStatus === "pending" && ageMinutes > 10) incident("ghl-sync-pending-stale", "P0", { submissionId: row.id, ageMinutes: Math.floor(ageMinutes) });
  if (transaction && row.status === "delivered" && row.ghlSyncStatus === "synced" && !row.ghlOpportunityId) incident("ghl-opportunity-id-missing", "P0", { submissionId: row.id });
}

const ghlToken = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;
const pipelineId = process.env.GHL_WEBSITE_PIPELINE_ID;
assert.ok(ghlToken && locationId && pipelineId, "GHL health-check configuration is required");
const ghlHeaders = { Authorization: `Bearer ${ghlToken}`, Version: "v3", Accept: "application/json" };
async function ghl(path, label) {
  const response = await fetch(`https://services.leadconnectorhq.com${path}`, {
    headers: ghlHeaders,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GHL ${label} returned HTTP ${response.status}`);
  return body;
}

const fieldsBody = await ghl(`/locations/${locationId}/customFields?model=opportunity`, "opportunity-custom-fields");
const fields = new Map((fieldsBody.customFields || []).map((field) => [field.name, field.id]));
for (const required of ["SEO Submission ID", "SEO QA Excluded"]) {
  if (!fields.has(required)) incident("ghl-field-missing", "P0", { field: required });
}

const opportunitySearch = await paginateGhlOpportunities({
  fetchPage: async ({ page, limit }) => ghl(`/opportunities/search?${new URLSearchParams({
    locationId,
    pipelineId,
    status: "all",
    order: "added_asc",
    page: String(page),
    limit: String(limit),
  })}`, "opportunity-search"),
});
const opportunities = opportunitySearch.opportunities;
const detailQueue = opportunities.map((opportunity) => opportunity.id).filter(Boolean);
const opportunityDetails = new Map();
await Promise.all(Array.from({ length: 5 }, async () => {
  while (detailQueue.length) {
    const id = detailQueue.shift();
    const detail = await ghl(`/opportunities/${id}`, "opportunity-detail");
    if (detail.opportunity) opportunityDetails.set(id, detail.opportunity);
  }
}));
const submissionFieldId = fields.get("SEO Submission ID");
const qaFieldId = fields.get("SEO QA Excluded");
function fieldValue(opportunity, id) {
  const match = (opportunity.customFields || []).find((field) => field.id === id);
  return typeof match?.fieldValue === "string" ? match.fieldValue : null;
}
const bySubmission = new Map();
for (const searchOpportunity of opportunities) {
  const opportunity = opportunityDetails.get(searchOpportunity.id) || searchOpportunity;
  const submissionId = fieldValue(opportunity, submissionFieldId) || opportunity.name?.match(/[0-9a-f]{8}-[0-9a-f-]{27}/i)?.[0] || null;
  if (!submissionId) continue;
  const list = bySubmission.get(submissionId) || [];
  list.push({
    id: opportunity.id,
    contactId: opportunity.contactId || opportunity.contact?.id || null,
    status: opportunity.status,
    qaExcluded: fieldValue(opportunity, qaFieldId) === "true",
  });
  bySubmission.set(submissionId, list);
}

const deliveredTransactions = ledgerRows.filter(
  (item) => item.status === "delivered" && item.formType && transactionForms.has(item.formType),
);
const rowsByOpportunity = new Map();
for (const row of deliveredTransactions) {
  if (!row.ghlOpportunityId) continue;
  const list = rowsByOpportunity.get(row.ghlOpportunityId) || [];
  list.push(row);
  rowsByOpportunity.set(row.ghlOpportunityId, list);
}

for (const row of nonQa.filter((item) => item.status === "delivered" && item.formType && transactionForms.has(item.formType))) {
  if (!row.ghlOpportunityId) continue;
  const opportunity = opportunityDetails.get(row.ghlOpportunityId);
  if (!opportunity) {
    incident("delivered-transaction-opportunity-missing", "P0", {
      submissionId: row.id,
      ledgerOpportunityId: row.ghlOpportunityId,
    });
    continue;
  }
  const contactId = opportunity.contactId || opportunity.contact?.id || null;
  if (row.ghlContactId && contactId && contactId !== row.ghlContactId) {
    incident("contact-id-mismatch", "P0", { submissionId: row.id });
  }
}

// GHL may allow only one opportunity per contact in a pipeline. The local ledger
// remains submission-level history; the CRM card must expose the newest delivery.
for (const [opportunityId, rows] of rowsByOpportunity) {
  const current = rows.toSorted((a, b) => Date.parse(b.submittedAt || "") - Date.parse(a.submittedAt || ""))[0];
  if (!current || current.isQa) continue;
  const matches = bySubmission.get(current.id) || [];
  if (matches.length === 0) {
    incident("current-opportunity-submission-mapping-missing", "P0", {
      submissionId: current.id,
      ledgerOpportunityId: opportunityId,
    });
  }
  if (matches.length > 1) {
    incident("duplicate-opportunity", "P0", {
      submissionId: current.id,
      opportunityIds: matches.map((item) => item.id),
    });
  }
  if (matches[0] && matches[0].id !== opportunityId) {
    incident("opportunity-id-mismatch", "P0", {
      submissionId: current.id,
      ledgerOpportunityId: opportunityId,
      ghlOpportunityId: matches[0].id,
    });
  }
}

const qaOpportunities = Array.from(bySubmission.values()).flat().filter((item) => item.qaExcluded).length;
const reusedOpportunityCards = Array.from(rowsByOpportunity.values()).filter((rows) => rows.length > 1).length;
const report = {
  schemaVersion: 1,
  checkedAt: new Date().toISOString(),
  origin,
  deploymentTrace: pages[0]?.status === 200 ? null : undefined,
  priorityPages: pages,
  aliases,
  ledger: {
    total: ledgerRows.length,
    nonQa: nonQa.length,
    qa: ledgerRows.length - nonQa.length,
    outboxPending: outboxRows.length,
    outbox: outboxRows,
  },
  ghl: {
    opportunities: opportunities.length,
    pages: opportunitySearch.pages,
    mappedSubmissions: bySubmission.size,
    qaExcluded: qaOpportunities,
    reusedOpportunityCards,
  },
  incidents,
  healthy: incidents.length === 0,
};
console.log(JSON.stringify(sanitizeOperationsReport(report)));
if (incidents.length) process.exitCode = 1;
