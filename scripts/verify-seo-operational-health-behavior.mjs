import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  boundedBody,
  deploymentFingerprintForEnvironment,
  htmlSignals,
  runSeoOperationalHealth,
  sitemapLocations,
} from "../src/lib/seo-operational-health.ts";
import {
  SeoOperationalHealthError,
  ghlTargetFingerprint,
  sha256,
  stableJsonDigest,
} from "../src/lib/seo-operational-health-contract.ts";
import {
  createSeoOperationalHealthHandler,
  evaluateSeoOperationalHealthEvidence,
} from "../src/lib/seo-operational-health-handler.ts";

const root = new URL("../", import.meta.url);
const baseConfig = JSON.parse(await readFile(new URL("config/seo-operational-health.json", root), "utf8"));
const observedAt = new Date("2026-09-02T14:07:00.000Z");

function fixtureJwt(payload) {
  const encoded = (value) => Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  return `${encoded({ alg: "EdDSA", typ: "JWT" })}.${encoded(payload)}.fixture-signature`;
}

const databaseTokenIssuedAt = "2026-08-31T12:00:00.000Z";
const databaseTokenExpiresAt = "2027-03-01T12:00:00.000Z";
const databaseToken = fixtureJwt({
  iat: Date.parse(databaseTokenIssuedAt) / 1000,
  exp: Date.parse(databaseTokenExpiresAt) / 1000,
  permissions: [
    { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
    { t: ["LeadSubmission"], a: ["data_read"] },
    { t: ["LeadSubmissionEvent"], a: ["data_read"] },
  ],
});
const fixtureLocationId = "fixture-location";
const ghlToken = fixtureJwt({
  authClass: "Location",
  authClassId: fixtureLocationId,
  oauthMeta: {
    scopes: [
      "locations.readonly",
      "locations/customFields.readonly",
      "opportunities.readonly",
    ],
  },
});
const environment = {
  VERCEL: "1",
  VERCEL_ENV: "production",
  VERCEL_TARGET_ENV: "production",
  VERCEL_PROJECT_ID: "fixture-project",
  VERCEL_DEPLOYMENT_ID: "dpl_fixturedeployment123456",
  VERCEL_URL: "fixture-deployment.vercel.app",
  VERCEL_PROJECT_PRODUCTION_URL: "fixture-production.example.invalid",
  VERCEL_GIT_PROVIDER: "github",
  VERCEL_GIT_REPO_ID: "123456789",
  VERCEL_GIT_REPO_OWNER: "fixture-owner",
  VERCEL_GIT_REPO_SLUG: "fixture-repository",
  VERCEL_GIT_COMMIT_REF: "main",
  VERCEL_GIT_COMMIT_SHA: "a".repeat(40),
  SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture-production.example.invalid",
  SEO_HEALTH_TURSO_AUTH_TOKEN: databaseToken,
  SEO_HEALTH_GHL_READ_TOKEN: ghlToken,
  GHL_LOCATION_ID: fixtureLocationId,
  GHL_WEBSITE_PIPELINE_ID: "fixture-pipeline",
  GHL_WEBSITE_SUBMITTED_STAGE_ID: "fixture-stage-submitted",
};
const submissionFieldId = "fixture-field-submission";
const qaFieldId = "fixture-field-qa";

function config(overrides = {}, credentialPolicyOverrides = {}) {
  const value = structuredClone(baseConfig);
  value.deploymentBinding = {
    ...value.deploymentBinding,
    gitProvider: environment.VERCEL_GIT_PROVIDER,
    productionBranch: environment.VERCEL_GIT_COMMIT_REF,
    fingerprints: {
      projectIdSha256: sha256(environment.VERCEL_PROJECT_ID),
      gitRepoIdSha256: sha256(environment.VERCEL_GIT_REPO_ID),
      gitRepoOwnerSha256: sha256(environment.VERCEL_GIT_REPO_OWNER),
      gitRepoSlugSha256: sha256(environment.VERCEL_GIT_REPO_SLUG),
      productionHostnameSha256: sha256(environment.VERCEL_PROJECT_PRODUCTION_URL),
    },
  };
  value.fingerprints = {
    ...value.fingerprints,
    databaseUrlSha256: sha256(environment.SEO_HEALTH_TURSO_DATABASE_URL),
    databaseTokenSha256: sha256(environment.SEO_HEALTH_TURSO_AUTH_TOKEN),
    ghlLocationIdSha256: sha256(environment.GHL_LOCATION_ID),
    ghlPipelineIdSha256: sha256(environment.GHL_WEBSITE_PIPELINE_ID),
    ghlSubmittedStageIdSha256: sha256(environment.GHL_WEBSITE_SUBMITTED_STAGE_ID),
    ghlReadTokenSha256: sha256(environment.SEO_HEALTH_GHL_READ_TOKEN),
    ghlTargetSha256: ghlTargetFingerprint({
      locationId: environment.GHL_LOCATION_ID,
      pipelineId: environment.GHL_WEBSITE_PIPELINE_ID,
      submittedStageId: environment.GHL_WEBSITE_SUBMITTED_STAGE_ID,
      submissionIdFieldId: submissionFieldId,
      qaExcludedFieldId: qaFieldId,
    }),
  };
  value.credentialPolicy = {
    ...value.credentialPolicy,
    turso: {
      ...value.credentialPolicy.turso,
      tokenIssuedAt: databaseTokenIssuedAt,
      tokenExpiresAt: databaseTokenExpiresAt,
      ...credentialPolicyOverrides,
    },
  };
  value.bounds = { ...value.bounds, ...overrides };
  return value;
}

function ledgerRow(overrides = {}) {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    status: "delivered",
    formType: "request-title-review",
    submittedAt: "2026-09-02T13:00:00.000Z",
    deliveredAt: "2026-09-02T13:00:05.000Z",
    lastAttemptAt: "2026-09-02T13:00:01.000Z",
    ghlContactId: "fixture-contact-1",
    ghlOpportunityId: "fixture-opportunity-1",
    ghlSyncStatus: "synced",
    qualificationStatus: "submitted",
    isQa: 0,
    ...overrides,
  };
}

function opportunity(row, overrides = {}) {
  return {
    id: row.ghlOpportunityId,
    contactId: row.ghlContactId,
    locationId: environment.GHL_LOCATION_ID,
    pipelineId: environment.GHL_WEBSITE_PIPELINE_ID,
    customFields: [
      { id: submissionFieldId, fieldValue: row.id },
      { id: qaFieldId, fieldValue: row.isQa === 1 ? "true" : "false" },
    ],
    ...overrides,
  };
}

function aggregate(rows) {
  const ledgerQaExcluded = rows.filter(
    (row) => row.isQa === 1 || row.qualificationStatus.toLowerCase() === "test",
  ).length;
  return {
    inventory: rows.length,
    ledgerQaExcluded,
    ledgerNonQaInventory: rows.length - ledgerQaExcluded,
    qaMarkerMismatches: rows.filter(
      (row) => (row.isQa === 1) !== (row.qualificationStatus.toLowerCase() === "test"),
    ).length,
    unexpectedDeliveryStatus: 0,
    unexpectedGhlStatus: 0,
    unexpectedFormType: 0,
    unexpectedQualificationStatus: 0,
  };
}

function databaseResults(rows, outbox = [], expiredEvents = []) {
  const ledgerColumns = [
    "id", "status", "formType", "submittedAt", "deliveredAt", "lastAttemptAt",
    "ghlContactId", "ghlOpportunityId", "ghlSyncStatus", "qualificationStatus", "isQa",
  ].map((name) => ({ name }));
  const outboxColumns = ["submissionId", "expiresAt"].map((name) => ({ name }));
  return [
    { rows: [aggregate(rows)] },
    { rows },
    { rows: outbox },
    { rows: expiredEvents },
    { rows: ledgerColumns },
    { rows: outboxColumns },
  ];
}

function fields(fieldOverrides = {}) {
  return baseConfig.requiredOpportunityFields.map((name, index) => ({
    id: name === "SEO Submission ID"
      ? submissionFieldId
      : name === "SEO QA Excluded" ? qaFieldId : `fixture-field-${index}`,
    name,
    model: "opportunity",
    locationId: environment.GHL_LOCATION_ID,
    dataType: "TEXT",
    fieldKey: `opportunity.fixture_${index}`,
    ...(fieldOverrides[name] || {}),
  }));
}

function pipelineStages(extra = []) {
  return [
    { id: environment.GHL_WEBSITE_SUBMITTED_STAGE_ID, name: "Submitted" },
    { id: "fixture-stage-qualified", name: "Qualified" },
    { id: "fixture-stage-referred", name: "Referred" },
    { id: "fixture-stage-accepted", name: "Accepted" },
    { id: "fixture-stage-closed", name: "Closed/Won" },
    { id: "fixture-stage-lost", name: "Lost" },
    ...extra,
  ];
}

function sitemapXml() {
  const urls = baseConfig.priorityPaths
    .map((path) => `<url><loc>${baseConfig.origin}${path}</loc></url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

function htmlPage(canonical, head = "", content = "Populated fixture") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">${head}<link rel="canonical" href="${canonical}"></head><body><main>${content}</main></body></html>`;
}

function json(value) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function tursoAuthorizationDenial() {
  const cause = Object.assign(new Error("fixture provider denial"), { status: 403 });
  return Object.assign(new Error("fixture libsql wrapper"), { code: "SERVER_ERROR", cause });
}

function fixture({
  rows = [ledgerRow()],
  outbox = [],
  expiredEvents = [],
  opportunities = rows.filter((row) => row.ghlOpportunityId).map((row) => opportunity(row)),
  secondScanOpportunities = opportunities,
  stages = pipelineStages(),
  fieldOverrides = {},
  totalValue,
  sitemap = sitemapXml(),
  deploymentSitemap,
  sitemapStatus = 200,
  deploymentSitemapStatus,
  pageHead = "",
  pageContent = "Populated fixture",
  pageStatus = 200,
  deploymentPageHead,
  deploymentPageContent,
  deploymentPageStatus,
  xRobotsTag,
  deploymentXRobotsTag,
  aliasStatus = 308,
  databaseBatchError,
  databaseProbe = "denied",
  databaseProbeError,
  ghlContactsStatus = 403,
  ghlContactsError,
  ghlPositiveError,
} = {}) {
  const details = new Map([...opportunities, ...secondScanOpportunities].map((item) => [item.id, item]));
  let searchPass = 0;
  let databasePositiveReadsSucceeded = false;
  const fetch = async (input, init) => {
    const url = new URL(String(input));
    if (url.origin === baseConfig.origin) {
      if (url.pathname === "/sitemap.xml") return new Response(sitemap, { status: sitemapStatus });
      return new Response(htmlPage(`${baseConfig.origin}${url.pathname}`, pageHead, pageContent), {
        status: pageStatus,
        headers: xRobotsTag ? { "X-Robots-Tag": xRobotsTag } : undefined,
      });
    }
    if (url.origin === `https://${environment.VERCEL_URL}`) {
      if (url.pathname === "/sitemap.xml") {
        return new Response(deploymentSitemap ?? sitemap, {
          status: deploymentSitemapStatus ?? sitemapStatus,
        });
      }
      return new Response(htmlPage(
        `${baseConfig.origin}${url.pathname}`,
        deploymentPageHead ?? pageHead,
        deploymentPageContent ?? pageContent,
      ), {
        status: deploymentPageStatus ?? pageStatus,
        headers: (deploymentXRobotsTag ?? xRobotsTag)
          ? { "X-Robots-Tag": deploymentXRobotsTag ?? xRobotsTag }
          : undefined,
      });
    }
    if (url.hostname === "www.dmvtitleguy.io" || url.protocol === "http:") {
      return new Response(null, { status: aliasStatus, headers: { Location: `${baseConfig.origin}/` } });
    }
    if (url.origin !== "https://services.leadconnectorhq.com") throw new Error("unexpected fixture URL");
    if (url.pathname === "/contacts/") {
      if (ghlContactsError) throw ghlContactsError;
      assert.equal(url.searchParams.get("locationId"), environment.GHL_LOCATION_ID);
      assert.equal(url.searchParams.get("limit"), "1");
      assert.equal(new Headers(init?.headers).get("Version"), "2023-02-21");
      return new Response(ghlContactsStatus === 200 ? "discard-me" : "denied", {
        status: ghlContactsStatus,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.pathname === `/locations/${environment.GHL_LOCATION_ID}`) {
      if (ghlPositiveError) throw ghlPositiveError;
      return json({
        location: {
          id: environment.GHL_LOCATION_ID,
          settings: { allowDuplicateOpportunity: false },
        },
      });
    }
    if (url.pathname === "/opportunities/pipelines") {
      return json({
        pipelines: [{
          id: environment.GHL_WEBSITE_PIPELINE_ID,
          locationId: environment.GHL_LOCATION_ID,
          name: baseConfig.expectedPipeline.name,
          stages,
        }],
      });
    }
    if (url.pathname.endsWith("/customFields")) {
      return json({ customFields: fields(fieldOverrides) });
    }
    if (url.pathname === "/opportunities/search") {
      const activeOpportunities = searchPass === 0 ? opportunities : secondScanOpportunities;
      const limit = Number(url.searchParams.get("limit"));
      const startAfterId = url.searchParams.get("startAfterId");
      const startIndex = startAfterId
        ? activeOpportunities.findIndex((item) => item.id === startAfterId) + 1
        : 0;
      const page = activeOpportunities.slice(startIndex, startIndex + limit);
      const last = page.at(-1);
      const more = startIndex + page.length < activeOpportunities.length;
      const response = json({
        opportunities: page,
        meta: {
          total: totalValue ?? activeOpportunities.length,
          ...(more && last ? { startAfter: startIndex + page.length, startAfterId: last.id } : {}),
        },
      });
      if (limit === 1) searchPass += 1;
      return response;
    }
    if (url.pathname.startsWith("/opportunities/")) {
      const id = decodeURIComponent(url.pathname.slice("/opportunities/".length));
      return json({ opportunity: details.get(id) });
    }
    throw new Error(`unexpected fixture URL: ${url}`);
  };
  return {
    fetch,
    createDatabaseClient: () => ({
      batch: async () => {
        if (databaseBatchError) throw databaseBatchError;
        databasePositiveReadsSucceeded = true;
        return databaseResults(rows, outbox, expiredEvents);
      },
      execute: async () => {
        assert.equal(
          databasePositiveReadsSucceeded,
          true,
          "the forbidden Turso read probe must run only after allowlisted reads succeed",
        );
        if (databaseProbe === "allowed") return { rows: [] };
        throw databaseProbeError ?? tursoAuthorizationDenial();
      },
      close() {},
    }),
    now: () => observedAt,
  };
}

async function run(fixtureOptions = {}, boundOverrides = {}, credentialPolicyOverrides = {}) {
  return runSeoOperationalHealth(
    {
      now: observedAt,
      effectiveDate: "2026-09-02",
      checkpointId: "technical-2026-09-02",
      runKind: "checkpoint",
    },
    {
      env: environment,
      config: config(boundOverrides, credentialPolicyOverrides),
      dependencies: fixture(fixtureOptions),
    },
  );
}

async function runCredentialClaimGate({
  alternateDatabaseToken = environment.SEO_HEALTH_TURSO_AUTH_TOKEN,
  alternateGhlToken = environment.SEO_HEALTH_GHL_READ_TOKEN,
} = {}) {
  const candidateEnvironment = {
    ...environment,
    SEO_HEALTH_TURSO_AUTH_TOKEN: alternateDatabaseToken,
    SEO_HEALTH_GHL_READ_TOKEN: alternateGhlToken,
  };
  const candidateConfig = config();
  candidateConfig.fingerprints.databaseTokenSha256 = sha256(alternateDatabaseToken);
  candidateConfig.fingerprints.ghlReadTokenSha256 = sha256(alternateGhlToken);
  let externalCalls = 0;
  const candidateReport = await runSeoOperationalHealth(
    {
      now: observedAt,
      effectiveDate: "2026-09-02",
      checkpointId: "technical-2026-09-02",
      runKind: "checkpoint",
    },
    {
      env: candidateEnvironment,
      config: candidateConfig,
      dependencies: {
        fetch: async () => {
          externalCalls += 1;
          throw new Error("credential claim gate failed open");
        },
        createDatabaseClient: () => {
          externalCalls += 1;
          throw new Error("credential claim gate failed open");
        },
        now: () => observedAt,
      },
    },
  );
  return { candidateReport, externalCalls };
}

function tursoTokenWithPermissions(permissions) {
  return fixtureJwt({
    iat: Date.parse(databaseTokenIssuedAt) / 1000,
    exp: Date.parse(databaseTokenExpiresAt) / 1000,
    permissions,
  });
}

let report = await run();
assert.equal(report.healthy, true);
assert.equal(report.bindings.projectFingerprint, true);
assert.equal(report.bindings.gitSource, true);
assert.equal(report.bindings.gitCommit, true);
assert.equal(report.bindings.deployment, true);
assert.equal(report.bindings.productionHostname, true);
assert.equal(report.bindings.runtimeCredentialIsolation, true);
assert.equal(report.bindings.databaseCredentialFingerprint, true);
assert.equal(report.bindings.databaseCredentialExpiryMetadata, true);
assert.equal(report.bindings.databaseCredentialLifetimePolicy, true);
assert.equal(report.bindings.databaseCredentialFinalCheckpointCoverage, true);
assert.equal(report.bindings.databaseCredentialRuntimeValidity, true);
assert.equal(report.bindings.databaseReadScope, true);
assert.equal(report.bindings.ghlCredentialFingerprint, true);
assert.equal(report.bindings.ghlReadScope, true);
assert.deepEqual(report.credentialScope, {
  turso: {
    permissionClaimsExact: true,
    permissionClaimEvidence: "exact-provider-jwt-claims",
    positiveReadsSucceeded: true,
    forbiddenReadDenied: true,
    denialEvidence: "structured-authorization-denial",
    tokenExpiryMetadataBound: true,
    lifetimeWithinPolicy: true,
    validThroughFinalCheckpoint: true,
    runtimeValid: true,
  },
  ghl: {
    scopeClaimsExact: true,
    locationClaimBound: true,
    scopeClaimEvidence: "exact-provider-jwt-claims",
    positiveReadsSucceeded: true,
    forbiddenContactReadDenied: true,
    denialEvidence: "structured-authorization-denial",
  },
});
assert.equal(report.seoChangeAuthorization.authorized, false);
assert.equal(report.checkpoint.scheduleDateMatched, true);
assert.equal(report.checkpoint.timely, undefined);
assert.equal(report.aggregates.ledgerNonQaInventory, 1);
assert.equal(report.aggregates.eligibleNonQa, undefined);
for (const privateValue of [
  "11111111-1111-4111-8111-111111111111",
  "fixture-contact-1",
  "fixture-opportunity-1",
  environment.SEO_HEALTH_TURSO_AUTH_TOKEN,
  environment.SEO_HEALTH_GHL_READ_TOKEN,
]) {
  assert.ok(!JSON.stringify(report).includes(privateValue));
}

const healthyTerminalReport = structuredClone(report);

const tursoClaimCases = [
  {
    label: "write action",
    evidence: "overprivileged",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read", "data_update"] },
      { t: ["LeadSubmissionEvent"], a: ["data_read"] },
    ]),
  },
  {
    label: "empty table list means every table",
    evidence: "overprivileged",
    token: tursoTokenWithPermissions([{ t: [], a: ["data_read"] }]),
  },
  {
    label: "literal all table grant",
    evidence: "overprivileged",
    token: tursoTokenWithPermissions([{ t: ["all"], a: ["data_read"] }]),
  },
  {
    label: "unallowlisted table grant",
    evidence: "overprivileged",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read"] },
      { t: ["LeadSubmissionEvent"], a: ["data_read"] },
      { t: ["SecretTenantTable"], a: ["data_read"] },
    ]),
  },
  {
    label: "legacy broad access claim",
    evidence: "overprivileged",
    token: fixtureJwt({
      iat: Date.parse(databaseTokenIssuedAt) / 1000,
      exp: Date.parse(databaseTokenExpiresAt) / 1000,
      a: "ro",
    }),
  },
  {
    label: "missing required table grant",
    evidence: "incomplete",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read"] },
    ]),
  },
  {
    label: "unknown provider action",
    evidence: "incomplete",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read"] },
      { t: ["LeadSubmissionEvent"], a: ["future_action"] },
    ]),
  },
  {
    label: "unrecognized permission shape",
    evidence: "incomplete",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read"], future: true },
      { t: ["LeadSubmissionEvent"], a: ["data_read"] },
    ]),
  },
  {
    label: "duplicate semantic grant",
    evidence: "incomplete",
    token: tursoTokenWithPermissions([
      { t: ["LeadOpportunityOutbox"], a: ["data_read"] },
      { t: ["LeadSubmission"], a: ["data_read"] },
      { t: ["LeadSubmissionEvent"], a: ["data_read"] },
      { t: ["LeadSubmissionEvent"], a: ["data_read"] },
    ]),
  },
  {
    label: "opaque token without permission claims",
    evidence: "incomplete",
    token: fixtureJwt({
      iat: Date.parse(databaseTokenIssuedAt) / 1000,
      exp: Date.parse(databaseTokenExpiresAt) / 1000,
    }),
  },
];
for (const { label, evidence, token } of tursoClaimCases) {
  const result = await runCredentialClaimGate({ alternateDatabaseToken: token });
  assert.equal(result.candidateReport.healthy, false, `${label} must fail closed`);
  assert.equal(result.candidateReport.bindings.databaseReadScope, false, label);
  assert.equal(result.candidateReport.credentialScope.turso.permissionClaimsExact, false, label);
  assert.equal(result.candidateReport.credentialScope.turso.permissionClaimEvidence, evidence, label);
  assert.equal(result.externalCalls, 0, `${label} must stop before every external call`);
  assert.ok(result.candidateReport.incidents.some((item) => item.code === (
    evidence === "overprivileged"
      ? "database-credential-permission-claims-overprivileged"
      : "database-credential-permission-claims-incomplete"
  )), label);
  assert.ok(!JSON.stringify(result.candidateReport).includes(token), `${label} token must not be reported`);
}

const exactGhlScopes = [
  "locations.readonly",
  "locations/customFields.readonly",
  "opportunities.readonly",
];
const ghlClaimCases = [
  {
    label: "opportunity write scope",
    evidence: "overprivileged",
    locationBound: true,
    token: fixtureJwt({
      authClass: "Location",
      authClassId: fixtureLocationId,
      oauthMeta: { scopes: [...exactGhlScopes, "opportunities.write"] },
    }),
  },
  {
    label: "unallowlisted readonly scope",
    evidence: "overprivileged",
    locationBound: true,
    token: fixtureJwt({
      authClass: "Location",
      authClassId: fixtureLocationId,
      oauthMeta: { scopes: [...exactGhlScopes, "contacts.readonly"] },
    }),
  },
  {
    label: "company-level token",
    evidence: "overprivileged",
    locationBound: false,
    token: fixtureJwt({
      authClass: "Company",
      authClassId: "fixture-company",
      oauthMeta: { scopes: exactGhlScopes },
    }),
  },
  {
    label: "missing required readonly scope",
    evidence: "incomplete",
    locationBound: true,
    token: fixtureJwt({
      authClass: "Location",
      authClassId: fixtureLocationId,
      oauthMeta: { scopes: exactGhlScopes.slice(0, 2) },
    }),
  },
  {
    label: "wrong location claim",
    evidence: "incomplete",
    locationBound: false,
    token: fixtureJwt({
      authClass: "Location",
      authClassId: "fixture-other-location",
      oauthMeta: { scopes: exactGhlScopes },
    }),
  },
  {
    label: "duplicate scope claim",
    evidence: "incomplete",
    locationBound: true,
    token: fixtureJwt({
      authClass: "Location",
      authClassId: fixtureLocationId,
      oauthMeta: { scopes: [...exactGhlScopes, exactGhlScopes[0]] },
    }),
  },
  {
    label: "opaque token without scope claims",
    evidence: "incomplete",
    locationBound: false,
    token: fixtureJwt({ sub: fixtureLocationId }),
  },
];
for (const { label, evidence, locationBound, token } of ghlClaimCases) {
  const result = await runCredentialClaimGate({ alternateGhlToken: token });
  assert.equal(result.candidateReport.healthy, false, `${label} must fail closed`);
  assert.equal(result.candidateReport.bindings.ghlReadScope, false, label);
  assert.equal(result.candidateReport.credentialScope.ghl.scopeClaimsExact, false, label);
  assert.equal(result.candidateReport.credentialScope.ghl.locationClaimBound, locationBound, label);
  assert.equal(result.candidateReport.credentialScope.ghl.scopeClaimEvidence, evidence, label);
  assert.equal(result.externalCalls, 0, `${label} must stop before every external call`);
  assert.ok(result.candidateReport.incidents.some((item) => item.code === (
    evidence === "overprivileged"
      ? "ghl-credential-scope-claims-overprivileged"
      : "ghl-credential-scope-claims-incomplete"
  )), label);
  assert.ok(!JSON.stringify(result.candidateReport).includes(token), `${label} token must not be reported`);
}

report = await run({ databaseProbe: "allowed" });
assert.equal(report.healthy, false, "a Turso token that can read an unallowlisted table must fail closed");
assert.equal(report.bindings.databaseReadScope, false);
assert.equal(report.credentialScope.turso.denialEvidence, "overprivileged");
assert.ok(report.incidents.some((item) => item.code === "database-credential-scope-overprivileged"));

report = await run({
  databaseProbeError: Object.assign(new Error("fixture SQLite authorization denial"), {
    code: "SQLITE_AUTH",
    rawCode: 23,
  }),
});
assert.equal(report.healthy, true, "a structured SQLite authorization denial must prove the negative scope probe");

for (const databaseProbeError of [
  Object.assign(new Error("fixture network failure"), { code: "ECONNRESET" }),
  Object.assign(new Error("fixture SQL/schema failure"), { code: "SQLITE_ERROR" }),
  Object.assign(new Error("fixture ambiguous authentication failure"), {
    code: "SERVER_ERROR",
    cause: Object.assign(new Error("fixture authentication failure"), { status: 401 }),
  }),
  Object.create(null),
]) {
  report = await run({ databaseProbeError });
  assert.equal(report.healthy, false);
  assert.equal(report.credentialScope.turso.denialEvidence, "incomplete");
  assert.ok(report.incidents.some((item) => item.code === "database-credential-scope-probe-incomplete"));
  assert.ok(!JSON.stringify(report).includes("fixture network failure"));
  assert.ok(!JSON.stringify(report).includes("fixture SQL/schema failure"));
}

report = await run({
  databaseBatchError: Object.assign(new Error("fixture positive database read failure"), {
    code: "ECONNRESET",
  }),
});
assert.equal(report.healthy, false);
assert.equal(report.credentialScope.turso.denialEvidence, "not-observed");
assert.equal(report.bindings.databaseReadScope, false);
assert.equal(
  report.bindings.ghlReadScope,
  true,
  "the independent GHL scope proof must still run when positive Turso reads fail",
);

for (const ghlContactsStatus of [401, 403]) {
  report = await run({ ghlContactsStatus });
  assert.equal(report.healthy, true, `${ghlContactsStatus} must prove contacts.readonly is absent`);
  assert.equal(report.bindings.ghlReadScope, true);
}

report = await run({ ghlContactsStatus: 200 });
assert.equal(report.healthy, false, "a GHL token that can read contacts must fail closed");
assert.equal(report.bindings.ghlReadScope, false);
assert.equal(report.credentialScope.ghl.denialEvidence, "overprivileged");
assert.ok(report.incidents.some((item) => item.code === "ghl-credential-scope-overprivileged"));

for (const ghlFailure of [
  { ghlContactsStatus: 404 },
  { ghlContactsStatus: 429 },
  { ghlContactsStatus: 500 },
  { ghlContactsError: Object.assign(new Error("fixture GHL network failure"), { code: "ECONNRESET" }) },
]) {
  report = await run(ghlFailure);
  assert.equal(report.healthy, false);
  assert.equal(report.credentialScope.ghl.denialEvidence, "incomplete");
  assert.ok(report.incidents.some((item) => item.code === "ghl-credential-scope-probe-incomplete"));
  assert.ok(!JSON.stringify(report).includes("fixture GHL network failure"));
}

report = await run({
  ghlPositiveError: Object.assign(new Error("fixture positive GHL read failure"), { code: "ECONNRESET" }),
});
assert.equal(report.healthy, false);
assert.equal(report.credentialScope.ghl.denialEvidence, "not-observed");
assert.equal(report.bindings.ghlReadScope, false);
assert.equal(
  report.bindings.databaseReadScope,
  true,
  "the independent Turso scope proof must still run when positive GHL reads fail",
);

report = await run({}, {}, { tokenExpiresAt: "2027-03-01T12:00:01.000Z" });
assert.equal(report.healthy, false);
assert.equal(report.bindings.databaseCredentialExpiryMetadata, false);
assert.ok(report.incidents.some((item) => item.code === "database-credential-expiry-metadata-mismatch"));

for (const maximumLifetimeDays of [180, 211]) {
  report = await run({}, {}, { maximumLifetimeDays });
  assert.equal(report.healthy, false);
  assert.equal(report.bindings.databaseCredentialLifetimePolicy, false);
  assert.ok(report.incidents.some((item) => item.code === "database-credential-lifetime-policy-mismatch"));
}

report = await run({}, {}, { minimumValidThrough: "2027-03-02T12:00:00.000Z" });
assert.equal(report.healthy, false);
assert.equal(report.bindings.databaseCredentialFinalCheckpointCoverage, false);
assert.ok(report.incidents.some(
  (item) => item.code === "database-credential-final-checkpoint-coverage-mismatch",
));

report = await run({}, {}, {
  finalCheckpointSafetyMarginHours: 24,
  minimumValidThrough: "2027-02-23T12:17:00.000Z",
});
assert.equal(report.bindings.databaseCredentialFinalCheckpointCoverage, false);
assert.ok(report.incidents.some(
  (item) => item.code === "database-credential-final-checkpoint-coverage-mismatch",
));

let malformedCredentialExternalCalls = 0;
const malformedCredentialEnvironment = {
  ...environment,
  SEO_HEALTH_TURSO_AUTH_TOKEN: "not-a-jwt",
};
const malformedCredentialConfig = config();
malformedCredentialConfig.fingerprints.databaseTokenSha256 = sha256(
  malformedCredentialEnvironment.SEO_HEALTH_TURSO_AUTH_TOKEN,
);
report = await runSeoOperationalHealth(
  {
    now: observedAt,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  {
    env: malformedCredentialEnvironment,
    config: malformedCredentialConfig,
    dependencies: {
      fetch: async () => {
        malformedCredentialExternalCalls += 1;
        throw new Error("malformed credential gate failed open");
      },
      createDatabaseClient: () => {
        malformedCredentialExternalCalls += 1;
        throw new Error("malformed credential gate failed open");
      },
      now: () => observedAt,
    },
  },
);
assert.equal(report.bindings.databaseCredentialExpiryMetadata, false);
assert.equal(malformedCredentialExternalCalls, 0, "a malformed Turso JWT must prevent all external calls");
assert.ok(report.incidents.some((item) => item.code === "database-credential-expiry-metadata-mismatch"));

let expiredCredentialExternalCalls = 0;
const afterCredentialExpiry = new Date("2027-03-02T12:00:00.000Z");
report = await runSeoOperationalHealth(
  {
    now: afterCredentialExpiry,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  {
    env: environment,
    config: config(),
    dependencies: {
      fetch: async () => {
        expiredCredentialExternalCalls += 1;
        throw new Error("expired credential gate failed open");
      },
      createDatabaseClient: () => {
        expiredCredentialExternalCalls += 1;
        throw new Error("expired credential gate failed open");
      },
      now: () => afterCredentialExpiry,
    },
  },
);
assert.equal(report.bindings.databaseCredentialRuntimeValidity, false);
assert.equal(expiredCredentialExternalCalls, 0, "expired credentials must prevent all external calls");
assert.ok(report.incidents.some((item) => item.code === "database-credential-expired-or-not-yet-valid"));

const dueSchedule = {
  timezone: baseConfig.timezone,
  checkpointDates: { "2026-09-02": "technical-2026-09-02" },
  canaryDates: [],
};
const expectedEvidence = {
  schemaVersion: baseConfig.schemaVersion,
  contractVersion: baseConfig.contractVersion,
  scope: baseConfig.scope,
};
const cronSecret = "fixture-cron-secret-that-is-long-enough";
const expectedDeploymentFingerprint = deploymentFingerprintForEnvironment(environment);
const terminalExpectations = {
  evidence: expectedEvidence,
  maxDurationMs: baseConfig.bounds.internalDeadlineMs,
  deploymentFingerprint: expectedDeploymentFingerprint,
  checkpoint: {
    id: "technical-2026-09-02",
    scheduledDate: "2026-09-02",
    timezone: baseConfig.timezone,
    runKind: "checkpoint",
  },
  publicSite: {
    priorityPaths: baseConfig.priorityPaths,
    aliasTypes: ["www", "http"],
  },
};
assert.equal(
  evaluateSeoOperationalHealthEvidence(healthyTerminalReport, terminalExpectations).accepted,
  true,
  "the pure terminal validator must accept exact runner evidence",
);

function cronRequest(hostname = environment.VERCEL_URL, headerOverrides = {}) {
  return new Request(`https://${hostname}/api/cron/seo-health`, {
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      Host: hostname,
      "User-Agent": "vercel-cron/1.0",
      "X-Vercel-Deployment-Url": environment.VERCEL_URL,
      ...headerOverrides,
    },
  });
}

function withRecomputedDigest(value) {
  const candidate = structuredClone(value);
  delete candidate.observation.evidenceDigest;
  const evidenceDigest = stableJsonDigest(candidate);
  candidate.observation.evidenceDigest = evidenceDigest;
  return candidate;
}

let handlerRunCalls = 0;
function handlerFor(candidate) {
  return createSeoOperationalHealthHandler({
    schedule: dueSchedule,
    expectedEvidence,
    expectedPublicSite: terminalExpectations.publicSite,
    maxEvidenceDurationMs: baseConfig.bounds.internalDeadlineMs,
    requestBinding: {
      deploymentHostname: () => environment.VERCEL_URL,
      productionHostname: () => environment.VERCEL_PROJECT_PRODUCTION_URL,
    },
    deploymentFingerprint: () => expectedDeploymentFingerprint,
    now: () => observedAt,
    cronSecret: () => cronSecret,
    run: async () => {
      handlerRunCalls += 1;
      return candidate;
    },
  });
}

const healthyHandler = handlerFor(healthyTerminalReport);
let handlerResponse = await healthyHandler(cronRequest());
assert.equal(handlerResponse.status, 200, "exact terminal evidence must be accepted on the deployment host");
let handlerBody = await handlerResponse.json();
assert.equal(handlerBody.healthy, true);
assert.equal(handlerBody.observation.deploymentFingerprint, expectedDeploymentFingerprint);
assert.equal(handlerBody.observation.evidenceDigest, healthyTerminalReport.observation.evidenceDigest);
assert.equal(handlerBody.aggregates, undefined, "terminal responses must be a safe allowlisted projection");
assert.equal(handlerBody.publicSite, undefined, "terminal responses must not echo arbitrary report detail");

handlerResponse = await healthyHandler(cronRequest(environment.VERCEL_PROJECT_PRODUCTION_URL));
assert.equal(handlerResponse.status, 200, "Vercel cron may invoke the pinned production host");

const callsBeforeBindingMismatch = handlerRunCalls;
handlerResponse = await healthyHandler(cronRequest(environment.VERCEL_URL, {
  "X-Vercel-Deployment-Url": "another-deployment.vercel.app",
}));
assert.equal(handlerResponse.status, 503);
assert.equal(handlerRunCalls, callsBeforeBindingMismatch, "request-binding failures must not invoke the runner");

const digestMismatch = structuredClone(healthyTerminalReport);
digestMismatch.aggregates.ledgerInventory += 1;
handlerResponse = await handlerFor(digestMismatch)(cronRequest());
assert.equal(handlerResponse.status, 503, "a stale or fabricated evidence digest must fail closed");

const wrongSchema = withRecomputedDigest({ ...healthyTerminalReport, schemaVersion: 999 });
handlerResponse = await handlerFor(wrongSchema)(cronRequest());
assert.equal(handlerResponse.status, 503, "schema drift must fail closed even with a self-consistent digest");

for (const [label, mutate] of [
  ["contract version", (candidate) => { candidate.contractVersion = "wrong-contract"; }],
  ["scope", (candidate) => { candidate.scope = "wrong-scope"; }],
  ["checkpoint id", (candidate) => { candidate.checkpoint.id = "wrong-checkpoint"; }],
  ["scheduled date", (candidate) => { candidate.checkpoint.scheduledDate = "2026-09-03"; }],
  ["run kind", (candidate) => { candidate.checkpoint.runKind = "canary"; }],
  ["date match", (candidate) => { candidate.checkpoint.scheduleDateMatched = false; }],
  ["completeness", (candidate) => { candidate.completeness.complete = false; }],
  ["health", (candidate) => { candidate.healthy = false; }],
  ["zero incidents", (candidate) => {
    candidate.incidents = [{ code: "priority-url-http", severity: "P1", count: 1 }];
  }],
]) {
  const candidate = structuredClone(healthyTerminalReport);
  mutate(candidate);
  handlerResponse = await handlerFor(withRecomputedDigest(candidate))(cronRequest());
  assert.equal(handlerResponse.status, 503, `${label} mismatch must fail closed`);
}

const wrongDeployment = withRecomputedDigest({
  ...healthyTerminalReport,
  observation: {
    ...healthyTerminalReport.observation,
    deploymentFingerprint: "f".repeat(64),
  },
});
handlerResponse = await handlerFor(wrongDeployment)(cronRequest());
assert.equal(handlerResponse.status, 503, "evidence must bind to the exact runtime deployment fingerprint");

const falseBinding = structuredClone(healthyTerminalReport);
falseBinding.bindings.gitSource = false;
handlerResponse = await handlerFor(withRecomputedDigest(falseBinding))(cronRequest());
assert.equal(handlerResponse.status, 503, "a false expected binding must fail closed");

const debugSecret = "malformed-debug-secret-must-never-echo";
const fabricatedWithSecret = withRecomputedDigest({
  ...healthyTerminalReport,
  debugSecret,
});
handlerResponse = await handlerFor(fabricatedWithSecret)(cronRequest());
assert.equal(handlerResponse.status, 503, "unknown report fields must fail even with a recomputed digest");
assert.ok(!(await handlerResponse.text()).includes(debugSecret), "unknown fields must never be reflected");

const reverseTimes = withRecomputedDigest({
  ...healthyTerminalReport,
  observation: {
    ...healthyTerminalReport.observation,
    startedAt: "2026-09-02T14:07:02.000Z",
    finishedAt: "2026-09-02T14:07:01.000Z",
  },
});
handlerResponse = await handlerFor(reverseTimes)(cronRequest());
assert.equal(handlerResponse.status, 503, "invalid observation duration must fail closed");

const semanticFalseGreen = withRecomputedDigest({
  ...structuredClone(healthyTerminalReport),
  completeness: {
    ...structuredClone(healthyTerminalReport.completeness),
    ledgerSnapshot: false,
    outboxSnapshot: false,
    publicPages: false,
  },
  publicSite: null,
  requests: { public: 0, ghl: 0 },
  observation: {
    ...structuredClone(healthyTerminalReport.observation),
    startedAt: "2000-01-01T00:00:00.000Z",
    finishedAt: "2000-01-01T00:00:01.000Z",
    archiveRecorded: "false",
  },
});
handlerResponse = await handlerFor(semanticFalseGreen)(cronRequest());
assert.equal(handlerResponse.status, 503, "exact-shape but semantically incomplete evidence must fail closed");

const unhealthyHandler = createSeoOperationalHealthHandler({
  schedule: dueSchedule,
  expectedEvidence,
  expectedPublicSite: terminalExpectations.publicSite,
  maxEvidenceDurationMs: baseConfig.bounds.internalDeadlineMs,
  requestBinding: {
    deploymentHostname: () => environment.VERCEL_URL,
    productionHostname: () => environment.VERCEL_PROJECT_PRODUCTION_URL,
  },
  deploymentFingerprint: () => expectedDeploymentFingerprint,
  now: () => observedAt,
  cronSecret: () => cronSecret,
  run: async () => ({ healthy: false, seoChangeAuthorization: { authorized: false } }),
});
const unhealthyResponse = await unhealthyHandler(cronRequest());
assert.equal(unhealthyResponse.status, 503, "a completed unhealthy report must fail closed at the handler");
assert.equal((await unhealthyResponse.json()).seoChangeAuthorization.authorized, false);

report = await run({
  rows: [ledgerRow({ ghlSyncStatus: "not-required", ghlContactId: null, ghlOpportunityId: null })],
  opportunities: [],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-sync-not-required-for-transaction"));

const validRow = ledgerRow();
const orphan = opportunity(ledgerRow({
  id: "22222222-2222-4222-8222-222222222222",
  ghlContactId: "fixture-contact-2",
  ghlOpportunityId: "fixture-opportunity-2",
}));
report = await run({ rows: [validRow], opportunities: [opportunity(validRow), orphan] });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-opportunity-ledger-orphan"));

const oldRow = ledgerRow({ submittedAt: "2026-09-02T12:00:00.000Z" });
const newRow = ledgerRow({
  id: "33333333-3333-4333-8333-333333333333",
  submittedAt: "2026-09-02T13:30:00.000Z",
});
report = await run({ rows: [oldRow, newRow], opportunities: [opportunity(oldRow)] });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-opportunity-stale-submission-mapping"));

report = await run({
  rows: [ledgerRow({
    status: "pending",
    submittedAt: "2026-09-02T13:00:00.000Z",
    deliveredAt: null,
    lastAttemptAt: null,
    ghlContactId: null,
    ghlOpportunityId: null,
    ghlSyncStatus: "pending",
  })],
  opportunities: [],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "lead-delivery-pending-stale"));

report = await run({
  rows: [ledgerRow({
    ghlSyncStatus: "pending",
    ghlContactId: null,
    ghlOpportunityId: null,
    deliveredAt: "2026-09-02T14:06:00.000Z",
  })],
  opportunities: [],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-outbox-missing-for-unresolved-sync"));

const syncedWithOutbox = ledgerRow();
report = await run({
  rows: [syncedWithOutbox],
  outbox: [{
    submissionId: syncedWithOutbox.id,
    expiresAt: "2026-09-10T14:07:00.000Z",
    ledgerId: syncedWithOutbox.id,
    ledgerStatus: syncedWithOutbox.status,
    formType: syncedWithOutbox.formType,
    ghlSyncStatus: syncedWithOutbox.ghlSyncStatus,
    qualificationStatus: syncedWithOutbox.qualificationStatus,
    isQa: syncedWithOutbox.isQa,
  }],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-outbox-state-mismatch"));

report = await run({
  outbox: [{
    submissionId: "orphan-submission",
    expiresAt: "2026-09-10T14:07:00.000Z",
    ledgerId: null,
    ledgerStatus: null,
    formType: null,
    ghlSyncStatus: null,
    qualificationStatus: null,
    isQa: null,
  }],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-outbox-orphaned"));

const pendingSync = ledgerRow({
  ghlSyncStatus: "pending",
  ghlContactId: null,
  ghlOpportunityId: null,
  deliveredAt: "2026-09-02T14:06:00.000Z",
});
report = await run({
  rows: [pendingSync],
  opportunities: [],
  outbox: [{
    submissionId: pendingSync.id,
    expiresAt: observedAt.toISOString(),
    ledgerId: pendingSync.id,
    ledgerStatus: pendingSync.status,
    formType: pendingSync.formType,
    ghlSyncStatus: pendingSync.ghlSyncStatus,
    qualificationStatus: pendingSync.qualificationStatus,
    isQa: pendingSync.isQa,
  }],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-outbox-expired-not-reconciled"));

const qaPending = ledgerRow({
  qualificationStatus: "test",
  isQa: 1,
  ghlSyncStatus: "pending",
  ghlContactId: null,
  ghlOpportunityId: null,
});
report = await run({
  rows: [qaPending],
  opportunities: [],
  outbox: [{
    submissionId: qaPending.id,
    expiresAt: observedAt.toISOString(),
    ledgerId: qaPending.id,
    ledgerStatus: qaPending.status,
    formType: qaPending.formType,
    ghlSyncStatus: qaPending.ghlSyncStatus,
    qualificationStatus: qaPending.qualificationStatus,
    isQa: qaPending.isQa,
  }],
  expiredEvents: [{
    submissionId: qaPending.id,
    ledgerId: qaPending.id,
    ghlSyncStatus: qaPending.ghlSyncStatus,
    qualificationStatus: qaPending.qualificationStatus,
    isQa: qaPending.isQa,
  }],
});
assert.equal(report.healthy, true, "QA outbox state must not affect operational health");

report = await run({ rows: [], opportunities: [], totalValue: "0" });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-source-incomplete"));

const replacementOpportunity = opportunity(validRow, { id: "fixture-opportunity-replaced-during-scan" });
report = await run({
  rows: [validRow],
  opportunities: [opportunity(validRow)],
  secondScanOpportunities: [replacementOpportunity],
});
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-source-incomplete"));

report = await run({ stages: pipelineStages([{ id: "unexpected", name: "Unexpected" }]) });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-pipeline-stage-binding-mismatch"));

report = await run({ fieldOverrides: { "SEO QA Excluded": { dataType: "NUMBER" } } });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "ghl-required-field-missing-or-ambiguous"));

const manyRows = Array.from({ length: 101 }, (_, index) => ledgerRow({
  id: `${String(index + 1).padStart(8, "0")}-1111-4111-8111-111111111111`,
  ghlContactId: `fixture-contact-${index + 1}`,
  ghlOpportunityId: `fixture-opportunity-${String(index + 1).padStart(3, "0")}`,
  submittedAt: new Date(Date.parse("2026-09-01T00:00:00.000Z") + index * 1000).toISOString(),
}));
report = await run(
  { rows: manyRows, opportunities: manyRows.map((row) => opportunity(row)) },
  { maxGhlDetailRequests: 110, maxGhlRequests: 150, ghlDetailConcurrency: 10 },
);
assert.equal(report.healthy, true);
assert.equal(report.completeness.ghl.pages, 2);
assert.equal(report.completeness.ghl.declaredTotal, 101);

report = await run({ xRobotsTag: "googlebot: none" });
assert.equal(report.healthy, false);
assert.ok(report.incidents.some((item) => item.code === "priority-url-noindex"));

const relayedAliasContent = "relay-target-private-body-marker";
report = await run({
  pageContent: relayedAliasContent,
  deploymentPageContent: "Populated fixture",
});
assert.equal(
  report.healthy,
  false,
  "a canonical-alias A-to-B-to-A relay must not pass against the attested unique deployment",
);
assert.ok(report.incidents.some((item) => item.code === "public-deployment-parity-mismatch"));
assert.equal(
  JSON.stringify(report).includes(relayedAliasContent),
  false,
  "parity failures must not expose compared response bodies",
);

report = await run({ deploymentPageStatus: 503 });
assert.equal(report.healthy, false, "canonical and unique deployment statuses must match exactly");
assert.ok(report.incidents.some((item) => item.code === "public-deployment-parity-mismatch"));

report = await run({
  deploymentPageHead: '<link rel="canonical" href="https://relay.invalid/">',
});
assert.equal(report.healthy, false, "canonical signals must match on both proven origins");
assert.ok(report.incidents.some((item) => item.code === "public-deployment-parity-mismatch"));

report = await run({ deploymentXRobotsTag: "googlebot: noindex" });
assert.equal(report.healthy, false, "noindex signals must match on both proven origins");
assert.ok(report.incidents.some((item) => item.code === "public-deployment-parity-mismatch"));

report = await run({ deploymentSitemap: `${sitemapXml()}\n` });
assert.equal(report.healthy, false, "sitemap response bodies must match by bounded digest");
assert.ok(report.incidents.some((item) => item.code === "public-deployment-parity-mismatch"));

report = await run({ aliasStatus: 302 });
assert.equal(report.healthy, false);
assert.ok(
  report.incidents.some((item) => item.code === "canonical-alias-unexpected"),
  "temporary canonical redirects must not satisfy the permanent redirect check",
);

const commented = htmlPage(
  `${baseConfig.origin}${baseConfig.priorityPaths[0]}`,
  "<!-- <meta name=\"googlebot\" content=\"noindex\"> --><script>\"<link rel='canonical' href='https://evil.invalid'>\"</script><meta name=\"googlebot\" content=\"none\">",
);
const signals = htmlSignals(commented);
assert.equal(signals.canonicals.length, 1);
assert.equal(signals.metaNoindex, true);
assert.throws(
  () => htmlSignals("<html><head><link rel=\"canonical\" href=\"https://example.invalid\"><body></html>"),
  SeoOperationalHealthError,
);
assert.throws(
  () => htmlSignals("<!doctype html><html><head></head><body>unclosed"),
  SeoOperationalHealthError,
);
assert.throws(
  () => sitemapLocations(sitemapXml().replace("</urlset>", ""), baseConfig.origin),
  SeoOperationalHealthError,
);
const duplicateLocation = `${baseConfig.origin}${baseConfig.priorityPaths[0]}`;
assert.throws(
  () => sitemapLocations(
    `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url/><url><loc>${duplicateLocation}</loc></url></urlset>`,
    baseConfig.origin,
  ),
  SeoOperationalHealthError,
);
assert.throws(
  () => sitemapLocations(
    `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${duplicateLocation}</loc></url><url><loc>${duplicateLocation}</loc></url></urlset>`,
    baseConfig.origin,
  ),
  SeoOperationalHealthError,
);

const oversized = new Response(new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("1234"));
    controller.enqueue(new TextEncoder().encode("5678"));
    controller.close();
  },
}));
await assert.rejects(
  boundedBody(oversized, 6, "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE"),
  SeoOperationalHealthError,
);

let bindingExternalCalls = 0;
report = await runSeoOperationalHealth(
  {
    now: observedAt,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  {
    env: { ...environment, VERCEL_PROJECT_ID: "wrong-project" },
    config: config(),
    dependencies: {
      fetch: async () => {
        bindingExternalCalls += 1;
        throw new Error("binding gate failed open");
      },
      createDatabaseClient: () => {
        bindingExternalCalls += 1;
        throw new Error("binding gate failed open");
      },
      now: () => observedAt,
    },
  },
);
assert.equal(report.healthy, false);
assert.equal(report.bindings.projectFingerprint, false);
assert.equal(bindingExternalCalls, 0, "a deployment-binding mismatch must make zero external calls");
assert.ok(report.incidents.some((item) => item.code === "vercel-project-binding-mismatch"));
assert.ok(report.incidents.some((item) => item.code === "external-sources-skipped-binding-incomplete"));

let isolationExternalCalls = 0;
const isolationReport = await runSeoOperationalHealth(
  {
    now: observedAt,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  {
    env: { ...environment, TURSO_AUTH_TOKEN: "application-write-token-present" },
    config: config(),
    dependencies: {
      fetch: async () => {
        isolationExternalCalls += 1;
        throw new Error("credential isolation gate failed open");
      },
      createDatabaseClient: () => {
        isolationExternalCalls += 1;
        throw new Error("credential isolation gate failed open");
      },
      now: () => observedAt,
    },
  },
);
assert.equal(isolationReport.healthy, false);
assert.equal(isolationReport.bindings.runtimeCredentialIsolation, false);
assert.equal(isolationExternalCalls, 0, "co-located write credentials must prevent all external calls");
assert.ok(isolationReport.incidents.some((item) => item.code === "runtime-credential-isolation-mismatch"));

const neverSettlingFixture = fixture();
let hungDatabaseClosed = 0;
const hungStartedAt = Date.now();
const hungReport = await runSeoOperationalHealth(
  {
    now: observedAt,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  {
    env: environment,
    config: config({ internalDeadlineMs: 25 }),
    dependencies: {
      ...neverSettlingFixture,
      createDatabaseClient: () => ({
        batch: () => new Promise(() => undefined),
        close() {
          hungDatabaseClosed += 1;
        },
      }),
    },
  },
);
assert.ok(Date.now() - hungStartedAt < 1_000, "a hung database batch must terminate at the internal deadline");
assert.equal(hungDatabaseClosed, 1, "the database client must close after a deadline race");
assert.equal(hungReport.healthy, false);
assert.ok(hungReport.incidents.some((item) => item.code === "database-source-incomplete"));
const hungTerminalResponse = await handlerFor(hungReport)(cronRequest());
assert.equal(hungTerminalResponse.status, 503, "a timed-out database snapshot must be a terminal failure");

console.log("SEO operational health behavioral verification passed: runtime evidence, credential expiry and least-privilege probes, host binding, privacy, deadlines, redirects, state, mapping, pagination, parsing, and body bounds fail closed");
