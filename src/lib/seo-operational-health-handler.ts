import {
  SEO_CHANGE_AUTHORIZATION,
  SEO_OPERATIONAL_HEALTH_SCOPE,
  dateInTimeZone,
  fixedDigestEqual,
  isBoundVercelCronRequest,
  isAuthorizedCronRequest,
  resolveSeoHealthSchedule,
  safeExecutionCode,
  stableJsonDigest,
  type SeoHealthEvidenceContract,
  type SeoHealthScheduleConfig,
} from "./seo-operational-health-contract.ts";

const PRIVATE_NO_STORE = "private, no-store, max-age=0";

interface HandlerDependencies<TReport> {
  schedule: SeoHealthScheduleConfig;
  expectedEvidence: SeoHealthEvidenceContract;
  expectedPublicSite: {
    priorityPaths: readonly string[];
    aliasTypes: readonly string[];
  };
  maxEvidenceDurationMs: number;
  requestBinding: {
    deploymentHostname: () => string | undefined;
    productionHostname: () => string | undefined;
  };
  deploymentFingerprint: () => string | null;
  run: (context: {
    now: Date;
    effectiveDate: string;
    checkpointId: string;
    runKind: "checkpoint" | "canary";
  }) => Promise<TReport>;
  now?: () => Date;
  cronSecret?: () => string | undefined;
  log?: (event: "start" | "finish" | "failure" | "skip", details: Record<string, unknown>) => void;
}

interface HealthReportForHandler {
  schemaVersion?: unknown;
  contractVersion?: unknown;
  scope?: unknown;
  healthy?: unknown;
  checkpoint?: {
    id?: unknown;
    scheduledDate?: unknown;
    timezone?: unknown;
    runKind?: unknown;
    scheduleDateMatched?: unknown;
    historicalStateVerifiable?: unknown;
  };
  completeness?: { complete?: unknown };
  observation?: {
    startedAt?: unknown;
    finishedAt?: unknown;
    archiveRecorded?: unknown;
    deploymentFingerprint?: unknown;
    evidenceDigest?: unknown;
  };
  aggregates?: unknown;
  publicSite?: unknown;
  credentialScope?: unknown;
  notObservedByThisRoute?: unknown;
  bindings?: unknown;
  incidents?: unknown;
  requests?: {
    public?: unknown;
    ghl?: unknown;
  };
  seoChangeAuthorization?: { authorized?: unknown; reason?: unknown };
}

export interface SeoHealthTerminalExpectations {
  evidence: SeoHealthEvidenceContract;
  maxDurationMs: number;
  deploymentFingerprint: string | null;
  checkpoint: {
    id: string;
    scheduledDate: string;
    timezone: string;
    runKind: "checkpoint" | "canary";
  };
  publicSite: {
    priorityPaths: readonly string[];
    aliasTypes: readonly string[];
  };
}

const BINDING_KEYS = [
  "vercelSystem",
  "production",
  "targetProduction",
  "runtimeCredentialIsolation",
  "projectFingerprint",
  "gitSource",
  "gitCommit",
  "deployment",
  "productionHostname",
  "origin",
  "databaseFingerprint",
  "databaseCredentialFingerprint",
  "databaseCredentialExpiryMetadata",
  "databaseCredentialLifetimePolicy",
  "databaseCredentialFinalCheckpointCoverage",
  "databaseCredentialRuntimeValidity",
  "databaseReadScope",
  "ghlFingerprint",
  "ghlCredentialFingerprint",
  "ghlReadScope",
  "pipelineAndStage",
  "customFields",
] as const;

const ROOT_KEYS = [
  "schemaVersion",
  "contractVersion",
  "scope",
  "checkpoint",
  "observation",
  "bindings",
  "completeness",
  "aggregates",
  "publicSite",
  "credentialScope",
  "requests",
  "notObservedByThisRoute",
  "incidents",
  "healthy",
  "seoChangeAuthorization",
] as const;

const NOT_OBSERVED_KEYS = [
  "google-selected-canonical",
  "crawl-index-state",
  "gsc-sitemap-warnings",
  "finalized-gsc-window",
  "local-search-rank",
  "seo-decision-power",
] as const;

const HEALTH_INCIDENT_CODES = new Set([
  "canonical-alias-unexpected",
  "current-opportunity-submission-mapping-missing",
  "database-source-incomplete",
  "database-target-fingerprint-mismatch",
  "database-credential-fingerprint-mismatch",
  "database-credential-expiry-metadata-mismatch",
  "database-credential-lifetime-policy-mismatch",
  "database-credential-final-checkpoint-coverage-mismatch",
  "database-credential-expired-or-not-yet-valid",
  "database-credential-scope-overprivileged",
  "database-credential-scope-probe-incomplete",
  "duplicate-opportunity",
  "external-sources-skipped-binding-incomplete",
  "ghl-contact-id-mismatch-or-missing",
  "ghl-credential-fingerprint-mismatch",
  "ghl-credential-scope-overprivileged",
  "ghl-credential-scope-probe-incomplete",
  "ghl-ledger-qa-parity-mismatch",
  "ghl-location-binding-mismatch",
  "ghl-opportunity-current-submission-ambiguous",
  "ghl-opportunity-id-mismatch",
  "ghl-opportunity-ledger-link-mismatch",
  "ghl-opportunity-ledger-orphan",
  "ghl-opportunity-qa-or-submission-unclassifiable",
  "ghl-opportunity-stale-submission-mapping",
  "ghl-outbox-expired-manual-reconciliation",
  "ghl-outbox-expired-not-reconciled",
  "ghl-outbox-missing-for-unresolved-sync",
  "ghl-outbox-orphaned",
  "ghl-outbox-state-mismatch",
  "ghl-outbox-timestamp-invalid",
  "ghl-pipeline-stage-binding-mismatch",
  "ghl-required-field-missing-or-ambiguous",
  "ghl-source-incomplete",
  "ghl-source-skipped-database-incomplete",
  "ghl-static-target-fingerprint-mismatch",
  "ghl-sync-error",
  "ghl-sync-not-required-for-transaction",
  "ghl-sync-pending-stale",
  "ghl-synced-identifiers-missing",
  "ghl-target-fingerprint-mismatch",
  "git-commit-binding-mismatch",
  "git-source-binding-mismatch",
  "lead-delivery-pending-stale",
  "lead-delivery-sending-stale",
  "lead-delivery-timestamp-invalid",
  "lead-delivery-unknown",
  "lead-delivered-timestamp-invalid",
  "lead-submission-timestamp-invalid",
  "ledger-delivery-status-unexpected",
  "ledger-empty-unexpected",
  "ledger-form-type-unexpected",
  "ledger-ghl-status-unexpected",
  "ledger-qa-marker-mismatch",
  "ledger-qualification-status-unexpected",
  "opportunity-mapping-mismatch",
  "priority-url-canonical",
  "priority-url-http",
  "priority-url-noindex",
  "priority-url-not-in-sitemap",
  "production-runtime-binding-mismatch",
  "runtime-credential-isolation-mismatch",
  "production-url-binding-mismatch",
  "public-source-incomplete",
  "sitemap-http",
  "vercel-deployment-binding-mismatch",
  "vercel-deployment-url-binding-mismatch",
  "vercel-project-binding-mismatch",
]);

function record(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function hasExactKeys(value: unknown, keys: readonly string[]) {
  const item = record(value);
  if (!item) return false;
  const actual = Object.keys(item).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function hasExactReportShape(report: HealthReportForHandler) {
  if (!hasExactKeys(report, ROOT_KEYS)) return false;
  if (!hasExactKeys(report.checkpoint, [
    "id",
    "scheduledDate",
    "timezone",
    "runKind",
    "scheduleDateMatched",
    "historicalStateVerifiable",
  ])) return false;
  if (!hasExactKeys(report.observation, [
    "startedAt",
    "finishedAt",
    "archiveRecorded",
    "deploymentFingerprint",
    "evidenceDigest",
  ])) return false;
  if (!hasExactKeys(report.bindings, BINDING_KEYS)) return false;
  const credentialScope = record(report.credentialScope);
  if (!credentialScope
    || !hasExactKeys(credentialScope, ["turso", "ghl"])
    || !hasExactKeys(credentialScope.turso, [
      "permissionClaimsExact",
      "permissionClaimEvidence",
      "positiveReadsSucceeded",
      "forbiddenReadDenied",
      "denialEvidence",
      "tokenExpiryMetadataBound",
      "lifetimeWithinPolicy",
      "validThroughFinalCheckpoint",
      "runtimeValid",
    ])
    || !hasExactKeys(credentialScope.ghl, [
      "scopeClaimsExact",
      "locationClaimBound",
      "scopeClaimEvidence",
      "positiveReadsSucceeded",
      "forbiddenContactReadDenied",
      "denialEvidence",
    ])) return false;
  if (!hasExactKeys(report.completeness, [
    "complete",
    "ledgerSnapshot",
    "outboxSnapshot",
    "ghl",
    "publicPages",
  ])) return false;
  const completeness = record(report.completeness);
  if (!completeness || !hasExactKeys(completeness.ghl, [
    "declaredTotal",
    "retrieved",
    "pages",
    "cursorTerminal",
    "stableTotal",
    "detailsComplete",
  ])) return false;
  if (!hasExactKeys(report.aggregates, [
    "ledgerInventory",
    "ledgerQaExcluded",
    "ledgerNonQaInventory",
    "outboxInventory",
    "ghlInventory",
    "ghlQaExcluded",
    "mappedSubmissions",
    "reusedOpportunityCards",
    "qaParityMismatches",
    "unclassifiable",
  ])) return false;
  if (!hasExactKeys(report.requests, ["public", "ghl"])) return false;
  if (!hasExactKeys(report.seoChangeAuthorization, ["authorized", "reason"])) return false;
  if (!Array.isArray(report.notObservedByThisRoute)
    || report.notObservedByThisRoute.some((item) => typeof item !== "string")) return false;
  if (!Array.isArray(report.incidents)
    || report.incidents.some((item) => !hasExactKeys(item, ["code", "severity", "count"]))) return false;
  if (report.publicSite !== null) {
    const publicSite = record(report.publicSite);
    if (!publicSite
      || !hasExactKeys(publicSite, ["sitemap", "priorityPages", "aliases"])
      || !hasExactKeys(publicSite.sitemap, ["status", "structurallyValid"])
      || !Array.isArray(publicSite.priorityPages)
      || publicSite.priorityPages.some((item) => !hasExactKeys(item, [
        "path", "status", "canonicalMatches", "noindex", "sitemapListed",
      ]))
      || !Array.isArray(publicSite.aliases)
      || publicSite.aliases.some((item) => !hasExactKeys(item, [
        "aliasType", "status", "canonicalRedirect",
      ]))) return false;
  }
  return true;
}

function safeNonnegativeInteger(value: unknown) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function safeDigest(value: unknown) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

function safeContractVersion(value: unknown) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,127}$/.test(value) ? value : null;
}

function safeIsoTime(value: unknown) {
  if (typeof value !== "string") return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value
    ? { value, milliseconds }
    : null;
}

function safeBindings(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const bindings: Record<string, boolean> = {};
  for (const key of BINDING_KEYS) {
    if (typeof record[key] !== "boolean") return null;
    bindings[key] = record[key];
  }
  return bindings;
}

function exactStringArray(value: unknown, expected: readonly string[]) {
  return Array.isArray(value)
    && value.length === expected.length
    && value.every((item, index) => item === expected[index]);
}

function healthyCompleteness(report: HealthReportForHandler) {
  const completeness = record(report.completeness);
  const ghl = record(completeness?.ghl);
  if (!completeness || !ghl) return false;
  const declaredTotal = safeNonnegativeInteger(ghl.declaredTotal);
  const retrieved = safeNonnegativeInteger(ghl.retrieved);
  const pages = safeNonnegativeInteger(ghl.pages);
  return completeness.complete === true
    && completeness.ledgerSnapshot === true
    && completeness.outboxSnapshot === true
    && completeness.publicPages === true
    && declaredTotal !== null
    && retrieved !== null
    && declaredTotal === retrieved
    && pages !== null
    && pages >= 1
    && ghl.cursorTerminal === true
    && ghl.stableTotal === true
    && ghl.detailsComplete === true;
}

function healthyAggregates(report: HealthReportForHandler) {
  const aggregates = record(report.aggregates);
  const completeness = record(report.completeness);
  const ghl = record(completeness?.ghl);
  if (!aggregates || !ghl) return false;
  const values = Object.fromEntries(Object.entries(aggregates).map(
    ([key, value]) => [key, safeNonnegativeInteger(value)],
  ));
  if (Object.values(values).some((value) => value === null)) return false;
  const ledgerInventory = values.ledgerInventory as number;
  const ledgerQaExcluded = values.ledgerQaExcluded as number;
  const ledgerNonQaInventory = values.ledgerNonQaInventory as number;
  const ghlInventory = values.ghlInventory as number;
  const declaredTotal = safeNonnegativeInteger(ghl.declaredTotal);
  const retrieved = safeNonnegativeInteger(ghl.retrieved);
  return ledgerInventory > 0
    && ledgerInventory === ledgerQaExcluded + ledgerNonQaInventory
    && ghlInventory === declaredTotal
    && ghlInventory === retrieved
    && (values.ghlQaExcluded as number) <= ghlInventory
    && (values.mappedSubmissions as number) <= ghlInventory
    && (values.reusedOpportunityCards as number) <= ghlInventory
    && values.qaParityMismatches === 0
    && values.unclassifiable === 0;
}

function healthyPublicSite(
  report: HealthReportForHandler,
  expected: SeoHealthTerminalExpectations["publicSite"],
) {
  const publicSite = record(report.publicSite);
  const sitemap = record(publicSite?.sitemap);
  if (!publicSite || !sitemap
    || sitemap.status !== 200
    || sitemap.structurallyValid !== true
    || !Array.isArray(publicSite.priorityPages)
    || !Array.isArray(publicSite.aliases)) return false;
  if (publicSite.priorityPages.length !== expected.priorityPaths.length
    || publicSite.aliases.length !== expected.aliasTypes.length) return false;
  const pagesHealthy = publicSite.priorityPages.every((value, index) => {
    const page = record(value);
    return page?.path === expected.priorityPaths[index]
      && page.status === 200
      && page.canonicalMatches === true
      && page.noindex === false
      && page.sitemapListed === true;
  });
  const aliasesHealthy = publicSite.aliases.every((value, index) => {
    const alias = record(value);
    return alias?.aliasType === expected.aliasTypes[index]
      && (alias.status === 301 || alias.status === 308)
      && alias.canonicalRedirect === true;
  });
  return pagesHealthy && aliasesHealthy;
}

function healthyCredentialScope(report: HealthReportForHandler) {
  const credentialScope = record(report.credentialScope);
  const turso = record(credentialScope?.turso);
  const ghl = record(credentialScope?.ghl);
  return Boolean(
    turso
    && ghl
    && turso.permissionClaimsExact === true
    && turso.permissionClaimEvidence === "exact-provider-jwt-claims"
    && turso.positiveReadsSucceeded === true
    && turso.forbiddenReadDenied === true
    && turso.denialEvidence === "structured-authorization-denial"
    && turso.tokenExpiryMetadataBound === true
    && turso.lifetimeWithinPolicy === true
    && turso.validThroughFinalCheckpoint === true
    && turso.runtimeValid === true
    && ghl.scopeClaimsExact === true
    && ghl.locationClaimBound === true
    && ghl.scopeClaimEvidence === "exact-provider-jwt-claims"
    && ghl.positiveReadsSucceeded === true
    && ghl.forbiddenContactReadDenied === true
    && ghl.denialEvidence === "structured-authorization-denial",
  );
}

function safeIncidents(value: unknown) {
  if (!Array.isArray(value)) return null;
  const codes = new Set<string>();
  const bySeverity = { P0: new Set<string>(), P1: new Set<string>() };
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const record = item as Record<string, unknown>;
    if (typeof record.code !== "string" || !HEALTH_INCIDENT_CODES.has(record.code)) return null;
    if (record.severity !== "P0" && record.severity !== "P1") return null;
    if (!Number.isSafeInteger(record.count) || (record.count as number) < 1) return null;
    codes.add(record.code);
    bySeverity[record.severity].add(record.code);
  }
  return {
    count: value.length,
    codes: [...codes].sort(),
    distinctBySeverity: {
      P0: bySeverity.P0.size,
      P1: bySeverity.P1.size,
    },
  };
}

function recomputedEvidenceDigest(report: HealthReportForHandler) {
  const observation = record(report.observation);
  if (!observation) return null;
  const observationWithoutDigest = { ...observation };
  delete observationWithoutDigest.evidenceDigest;
  try {
    return stableJsonDigest({
      ...report,
      observation: observationWithoutDigest,
    });
  } catch {
    return null;
  }
}

function safeFailure(code: string, expected: SeoHealthEvidenceContract) {
  return {
    schemaVersion: expected.schemaVersion,
    contractVersion: expected.contractVersion,
    scope: SEO_OPERATIONAL_HEALTH_SCOPE,
    healthy: false,
    complete: false,
    error: { code },
    seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION,
  };
}

function invalidTerminalEvaluation() {
  return {
    accepted: false as const,
    projection: null,
    diagnostics: {
      schemaVersion: null,
      contractVersion: null,
      scope: null,
      finishedAt: null,
      durationMs: null,
      complete: false,
      evidenceDigest: null,
      deploymentFingerprint: null,
      bindings: null,
      incidentCodes: null,
      incidentDistinctBySeverity: null,
      seoChangeAuthorized: null,
      requests: { public: null, ghl: null },
    },
  };
}

export function evaluateSeoOperationalHealthEvidence(
  candidate: unknown,
  expectations: SeoHealthTerminalExpectations,
) {
  const candidateRecord = record(candidate);
  if (!candidateRecord) return invalidTerminalEvaluation();
  const report = candidateRecord as HealthReportForHandler;
  try {
    const schemaVersion = safeNonnegativeInteger(report.schemaVersion);
    const contractVersion = safeContractVersion(report.contractVersion);
    const expectedSchemaVersion = safeNonnegativeInteger(expectations.evidence.schemaVersion);
    const expectedContractVersion = safeContractVersion(expectations.evidence.contractVersion);
    const expectedEvidenceContract = expectedSchemaVersion !== null
      && expectedSchemaVersion > 0
      && expectedContractVersion !== null
      && expectations.evidence.scope === SEO_OPERATIONAL_HEALTH_SCOPE;
    const scope = report.scope === SEO_OPERATIONAL_HEALTH_SCOPE ? report.scope : null;
    const checkpointMatches = report.checkpoint?.id === expectations.checkpoint.id
      && report.checkpoint?.scheduledDate === expectations.checkpoint.scheduledDate
      && report.checkpoint?.timezone === expectations.checkpoint.timezone
      && report.checkpoint?.runKind === expectations.checkpoint.runKind
      && report.checkpoint?.scheduleDateMatched === true
      && report.checkpoint?.historicalStateVerifiable === false;
    const complete = report.completeness?.complete === true;
    const startedAt = safeIsoTime(report.observation?.startedAt);
    const finishedAt = safeIsoTime(report.observation?.finishedAt);
    const durationMs = startedAt && finishedAt && finishedAt.milliseconds >= startedAt.milliseconds
      ? finishedAt.milliseconds - startedAt.milliseconds
      : null;
    const evidenceDigest = safeDigest(report.observation?.evidenceDigest);
    const deploymentFingerprint = safeDigest(report.observation?.deploymentFingerprint);
    const expectedDeploymentFingerprint = safeDigest(expectations.deploymentFingerprint);
    const recomputedDigest = recomputedEvidenceDigest(report);
    const bindings = safeBindings(report.bindings);
    const incidents = safeIncidents(report.incidents);
    const publicRequests = safeNonnegativeInteger(report.requests?.public);
    const ghlRequests = safeNonnegativeInteger(report.requests?.ghl);
    const seoChangeAuthorized = report.seoChangeAuthorization?.authorized === false
      && report.seoChangeAuthorization?.reason === SEO_CHANGE_AUTHORIZATION.reason
      ? false
      : null;
    const reportShapeValid = hasExactReportShape(report);
    const semanticCompleteness = healthyCompleteness(report);
    const semanticAggregates = healthyAggregates(report);
    const semanticPublicSite = healthyPublicSite(report, expectations.publicSite);
    const semanticCredentialScope = healthyCredentialScope(report);
    const timestampsMatchCheckpoint = Boolean(
      startedAt
      && finishedAt
      && dateInTimeZone(new Date(startedAt.milliseconds), expectations.checkpoint.timezone)
        === expectations.checkpoint.scheduledDate
      && dateInTimeZone(new Date(finishedAt.milliseconds), expectations.checkpoint.timezone)
        === expectations.checkpoint.scheduledDate,
    );
    const accepted = report.healthy === true
      && reportShapeValid
      && expectedEvidenceContract
      && schemaVersion === expectedSchemaVersion
      && contractVersion === expectedContractVersion
      && scope !== null
      && checkpointMatches
      && complete
      && semanticCompleteness
      && semanticAggregates
      && semanticPublicSite
      && semanticCredentialScope
      && report.observation?.archiveRecorded === false
      && exactStringArray(report.notObservedByThisRoute, NOT_OBSERVED_KEYS)
      && timestampsMatchCheckpoint
      && durationMs !== null
      && Number.isSafeInteger(expectations.maxDurationMs)
      && expectations.maxDurationMs > 0
      && durationMs <= expectations.maxDurationMs
      && evidenceDigest !== null
      && recomputedDigest !== null
      && fixedDigestEqual(evidenceDigest, recomputedDigest)
      && deploymentFingerprint !== null
      && expectedDeploymentFingerprint !== null
      && fixedDigestEqual(deploymentFingerprint, expectedDeploymentFingerprint)
      && incidents !== null
      && incidents.count === 0
      && bindings !== null
      && Object.values(bindings).every(Boolean)
      && publicRequests !== null
      && publicRequests === expectations.publicSite.priorityPaths.length + 3
      && ghlRequests !== null
      && ghlRequests > 0
      && seoChangeAuthorized === false;
    const diagnostics = {
      schemaVersion: schemaVersion === expectedSchemaVersion ? schemaVersion : null,
      contractVersion: contractVersion === expectedContractVersion ? contractVersion : null,
      scope,
      finishedAt: finishedAt?.value ?? null,
      durationMs,
      complete,
      evidenceDigest,
      deploymentFingerprint,
      bindings,
      incidentCodes: incidents?.codes ?? null,
      incidentDistinctBySeverity: incidents?.distinctBySeverity ?? null,
      seoChangeAuthorized,
      requests: { public: publicRequests, ghl: ghlRequests },
    };
    if (!accepted || !startedAt || !finishedAt || !evidenceDigest
      || !deploymentFingerprint || !bindings || !incidents
      || publicRequests === null || ghlRequests === null || durationMs === null) {
      return { accepted: false as const, projection: null, diagnostics };
    }
    return {
      accepted: true as const,
      projection: {
        schemaVersion: expectations.evidence.schemaVersion,
        contractVersion: expectations.evidence.contractVersion,
        scope: SEO_OPERATIONAL_HEALTH_SCOPE,
        checkpoint: {
          id: expectations.checkpoint.id,
          scheduledDate: expectations.checkpoint.scheduledDate,
          runKind: expectations.checkpoint.runKind,
          scheduleDateMatched: true,
        },
        observation: {
          startedAt: startedAt.value,
          finishedAt: finishedAt.value,
          durationMs,
          deploymentFingerprint,
          evidenceDigest,
        },
        bindings,
        completeness: { complete: true },
        incidents: [] as never[],
        requests: { public: publicRequests, ghl: ghlRequests },
        healthy: true,
        seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION,
      },
      diagnostics,
    };
  } catch {
    return invalidTerminalEvaluation();
  }
}

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": PRIVATE_NO_STORE },
  });
}

export function createSeoOperationalHealthHandler<TReport extends HealthReportForHandler>(
  dependencies: HandlerDependencies<TReport>,
) {
  return async function handle(request: Request) {
    const secret = dependencies.cronSecret?.() ?? process.env.CRON_SECRET;
    if (!isAuthorizedCronRequest(request.headers.get("authorization"), secret)) {
      return json({ ok: false, error: { code: "UNAUTHORIZED" } }, 401);
    }

    if (!isBoundVercelCronRequest(
      request,
      dependencies.requestBinding.deploymentHostname(),
      dependencies.requestBinding.productionHostname(),
    )) {
      dependencies.log?.("failure", {
        healthy: false,
        complete: false,
        httpOutcome: 503,
        deploymentFingerprint: safeDigest(dependencies.deploymentFingerprint()),
        seoChangeAuthorized: false,
        code: "SEO_HEALTH_REQUEST_BINDING_MISMATCH",
      });
      return json(safeFailure(
        "SEO_HEALTH_REQUEST_BINDING_MISMATCH",
        dependencies.expectedEvidence,
      ), 503);
    }

    const now = dependencies.now?.() ?? new Date();
    const match = resolveSeoHealthSchedule(now, dependencies.schedule);
    if (!match.due || !match.checkpointId || match.runKind === "off-date") {
      dependencies.log?.("skip", {
        runKind: "off-date",
        effectiveDate: match.effectiveDate,
        externalCalls: 0,
      });
      return new Response(null, {
        status: 204,
        headers: { "Cache-Control": PRIVATE_NO_STORE },
      });
    }

    dependencies.log?.("start", {
      runKind: match.runKind,
      effectiveDate: match.effectiveDate,
      checkpointId: match.checkpointId,
    });
    try {
      const report = await dependencies.run({
        now,
        effectiveDate: match.effectiveDate,
        checkpointId: match.checkpointId,
        runKind: match.runKind,
      });
      const evaluation = evaluateSeoOperationalHealthEvidence(report, {
        evidence: dependencies.expectedEvidence,
        maxDurationMs: dependencies.maxEvidenceDurationMs,
        deploymentFingerprint: dependencies.deploymentFingerprint(),
        checkpoint: {
          id: match.checkpointId,
          scheduledDate: match.effectiveDate,
          timezone: dependencies.schedule.timezone,
          runKind: match.runKind,
        },
        publicSite: dependencies.expectedPublicSite,
      });
      const diagnostics = evaluation.diagnostics;
      dependencies.log?.("finish", {
        schemaVersion: diagnostics.schemaVersion,
        contractVersion: diagnostics.contractVersion,
        scope: diagnostics.scope,
        runKind: match.runKind,
        scheduledDate: match.effectiveDate,
        checkpointId: match.checkpointId,
        finishedAt: diagnostics.finishedAt,
        durationMs: diagnostics.durationMs,
        healthy: evaluation.accepted,
        complete: diagnostics.complete,
        httpOutcome: evaluation.accepted ? 200 : 503,
        evidenceDigest: diagnostics.evidenceDigest,
        deploymentFingerprint: diagnostics.deploymentFingerprint,
        bindings: diagnostics.bindings,
        incidentCodes: diagnostics.incidentCodes,
        incidentDistinctBySeverity: diagnostics.incidentDistinctBySeverity,
        seoChangeAuthorized: diagnostics.seoChangeAuthorized,
        requests: diagnostics.requests,
      });
      if (!evaluation.accepted) {
        return json(safeFailure(
          "SEO_HEALTH_TERMINAL_EVIDENCE_INVALID",
          dependencies.expectedEvidence,
        ), 503);
      }
      return json(evaluation.projection, 200);
    } catch (error) {
      const code = safeExecutionCode(error);
      const failure = safeFailure(code, dependencies.expectedEvidence);
      dependencies.log?.("failure", {
        runKind: match.runKind,
        scheduledDate: match.effectiveDate,
        checkpointId: match.checkpointId,
        healthy: false,
        complete: false,
        httpOutcome: 503,
        deploymentFingerprint: safeDigest(dependencies.deploymentFingerprint()),
        seoChangeAuthorized: false,
        code: failure.error.code,
      });
      return json(failure, 503);
    }
  };
}

export function methodNotAllowed() {
  return new Response(null, {
    status: 405,
    headers: {
      Allow: "GET",
      "Cache-Control": PRIVATE_NO_STORE,
    },
  });
}
