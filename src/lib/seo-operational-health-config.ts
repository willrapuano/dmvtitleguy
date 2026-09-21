import rawConfig from "../../config/seo-operational-health.json";

export interface SeoOperationalHealthConfig {
  schemaVersion: number;
  contractVersion: string;
  scope: "live-operational-health-only";
  origin: string;
  timezone: string;
  scheduler: "github-actions";
  rolloutPhase: "disabled" | "canary" | "permanent";
  permanentCronSchedule: string;
  archiveSignature: {
    algorithm: "Ed25519";
    keyId: string;
    publicKeySpkiBase64: string;
  };
  deploymentBinding: {
    gitProvider: "github";
    productionBranch: "main";
    githubDeployment: {
      environment: "Production";
      creatorLogin: "vercel[bot]";
      creatorId: number;
      creatorType: "Bot";
      maxDeployments: number;
    };
    vercelControlPlane: {
      canonicalAlias: "dmvtitleguy.io";
      teamId: string;
      integrationConfigurationId: string;
      integrationId: string;
      integrationSlug: string;
      projectSelection: "selected";
      requiredResourceScopes: string[];
    };
    fingerprints: {
      projectIdSha256: string;
      gitRepoIdSha256: string;
      gitRepoOwnerSha256: string;
      gitRepoSlugSha256: string;
      productionHostnameSha256: string;
      vercelControlTokenSha256: string;
    };
  };
  checkpointCalendar: Record<string, string>;
  checkpointDates: Record<string, string>;
  canaryDates: string[];
  canaryReceipt: null | {
    checkpointId: string;
    scheduledDate: string;
    finishedAt: string;
    commentId: number;
    commentBodySha256: string;
    deploymentFingerprint: string;
    evidenceDigest: string;
    healthSourceDigest: string;
    githubSha: string;
  };
  checkpointHistory: Record<string, {
    status: "archived";
    checkpointId: string;
    scheduledDate: string;
    finishedAt: string;
    commentId: number;
    commentBodySha256: string;
    deploymentFingerprint: string;
    evidenceDigest: string;
    healthSourceDigest: string;
    githubSha: string;
  } | {
    status: "missed";
    checkpointId: string;
    scheduledDate: string;
    detectedAt: string;
    reasonCode: string;
    commentId: number;
    commentBodySha256: string;
    githubSha: string;
  }>;
  schedulerContinuity: {
    publicRepositoryInactivityDisableDays: 60;
    maximumDetectionMinutes: number;
    maximumOwnerRecoveryHours: 24;
    maximumReceiptAgeHours: number;
    maximumRecoveryDrillAgeDays: number;
    independentWatchdog: {
      provider: "" | "external-github-app";
      monitorIdSha256: string;
      githubAppIdSha256: string;
      installationIdSha256: string;
      workflowPathSha256: string;
      requiredPermissions: {
        actions: "write";
        metadata: "read";
      };
      receiptSignature: {
        algorithm: "Ed25519";
        keyId: string;
        publicKeySpkiBase64: string;
      };
      receipt: null | {
        schemaVersion: 1;
        contractVersion: "seo-health-watchdog-receipt-v1";
        provider: "external-github-app";
        monitorIdSha256: string;
        githubAppIdSha256: string;
        installationIdSha256: string;
        repository: "willrapuano/dmvtitleguy";
        repositoryIdSha256: string;
        workflowPath: ".github/workflows/seo-operational-health.yml";
        workflowPathSha256: string;
        permissions: { actions: "write"; metadata: "read" };
        observedAt: string;
        workflowState: "active";
        drill: {
          disabledAt: string;
          detectedAt: string;
          reenabledAt: string;
          alertedAt: string;
          workflowReenabled: true;
          ownerAlertDelivered: true;
        };
        signature: {
          algorithm: "Ed25519";
          keyId: string;
          valueBase64Url: string;
        };
      };
    };
  };
  credentialPolicy: {
    turso: {
      maximumLifetimeDays: number;
      finalCheckpointSafetyMarginHours: number;
      minimumValidThrough: string;
      tokenIssuedAt: string;
      tokenExpiresAt: string;
      claimProfile: "turso-fine-grained-v1";
      requiredPermissions: Array<{
        table: string;
        actions: string[];
      }>;
    };
    ghl: {
      claimProfile: "highlevel-pit-oauth-meta-v1";
      requiredScopes: string[];
    };
  };
  priorityPaths: string[];
  expectedPipeline: {
    name: string;
    stages: string[];
  };
  requiredOpportunityFields: string[];
  fingerprints: {
    databaseUrlSha256: string;
    databaseTokenSha256: string;
    ghlLocationIdSha256: string;
    ghlPipelineIdSha256: string;
    ghlSubmittedStageIdSha256: string;
    ghlReadTokenSha256: string;
    ghlTargetSha256: string;
  };
  bounds: {
    routeMaxDurationSeconds: number;
    internalDeadlineMs: number;
    publicRequestTimeoutMs: number;
    ghlRequestTimeoutMs: number;
    maxHtmlBytes: number;
    maxSitemapBytes: number;
    maxGhlResponseBytes: number;
    maxLedgerRows: number;
    maxOutboxRows: number;
    maxExpiredEventRows: number;
    maxGhlPages: number;
    maxGhlDetailRequests: number;
    maxGhlRequests: number;
    ghlDetailConcurrency: number;
  };
}

export const seoOperationalHealthConfig = rawConfig as SeoOperationalHealthConfig;
