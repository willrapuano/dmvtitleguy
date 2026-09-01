import {
  createHash,
  createPrivateKey,
  createPublicKey,
  sign,
  timingSafeEqual,
  verify,
} from "node:crypto";

export const WATCHDOG_RECEIPT_CONTRACT = "seo-health-watchdog-receipt-v1";
export const WATCHDOG_PROVIDER = "external-github-app";
export const WATCHDOG_REPOSITORY = "willrapuano/dmvtitleguy";
export const WATCHDOG_WORKFLOW_PATH = ".github/workflows/seo-operational-health.yml";
export const WATCHDOG_PERMISSIONS = Object.freeze({ actions: "write", metadata: "read" });

const SHA256 = /^[a-f0-9]{64}$/;
const RECEIPT_KEYS = Object.freeze([
  "schemaVersion",
  "contractVersion",
  "provider",
  "monitorIdSha256",
  "githubAppIdSha256",
  "installationIdSha256",
  "repository",
  "repositoryIdSha256",
  "workflowPath",
  "workflowPathSha256",
  "permissions",
  "observedAt",
  "workflowState",
  "drill",
  "signature",
]);
const DRILL_KEYS = Object.freeze([
  "disabledAt",
  "detectedAt",
  "reenabledAt",
  "alertedAt",
  "workflowReenabled",
  "ownerAlertDelivered",
]);
const SIGNATURE_KEYS = Object.freeze(["algorithm", "keyId", "valueBase64Url"]);
const SIGNATURE_CONFIG_KEYS = Object.freeze(["algorithm", "keyId", "publicKeySpkiBase64"]);

export class SeoHealthWatchdogReceiptError extends Error {
  constructor(code) {
    super(code);
    this.name = "SeoHealthWatchdogReceiptError";
    this.code = code;
  }
}

function fail(code) {
  throw new SeoHealthWatchdogReceiptError(code);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, expected) {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length
    && actual.every((key, index) => key === wanted[index]);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (isRecord(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function sha256Bytes(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalIso(value) {
  if (typeof value !== "string") return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value
    ? milliseconds
    : null;
}

function canonicalBase64(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  const bytes = Buffer.from(value, "base64");
  return bytes.length > 0 && bytes.toString("base64") === value ? bytes : null;
}

function canonicalBase64Url(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  const bytes = Buffer.from(value, "base64url");
  return bytes.length > 0 && bytes.toString("base64url") === value ? bytes : null;
}

function signaturePayload(unsignedReceipt) {
  return Buffer.from(
    `dmvtitleguy:${WATCHDOG_RECEIPT_CONTRACT}:${JSON.stringify(stable(unsignedReceipt))}`,
    "utf8",
  );
}

function loadPublicKey(signatureConfig) {
  if (
    !exactKeys(signatureConfig, SIGNATURE_CONFIG_KEYS)
    || signatureConfig.algorithm !== "Ed25519"
    || !SHA256.test(signatureConfig.keyId || "")
  ) fail("SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID");
  const bytes = canonicalBase64(signatureConfig.publicKeySpkiBase64);
  if (!bytes || sha256Bytes(bytes) !== signatureConfig.keyId) {
    fail("SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID");
  }
  try {
    const key = createPublicKey({ key: bytes, format: "der", type: "spki" });
    if (
      key.asymmetricKeyType !== "ed25519"
      || Buffer.compare(key.export({ format: "der", type: "spki" }), bytes) !== 0
    ) fail("SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID");
    return key;
  } catch (error) {
    if (error instanceof SeoHealthWatchdogReceiptError) throw error;
    fail("SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID");
  }
}

export function validateWatchdogConfig(config, { required = true } = {}) {
  const continuity = config?.schedulerContinuity;
  const watchdog = continuity?.independentWatchdog;
  const workflowPathDigest = createHash("sha256").update(WATCHDOG_WORKFLOW_PATH).digest("hex");
  if (
    !isRecord(continuity)
    || continuity.publicRepositoryInactivityDisableDays !== 60
    || !Number.isSafeInteger(continuity.maximumDetectionMinutes)
    || continuity.maximumDetectionMinutes < 1
    || continuity.maximumDetectionMinutes > 60
    || continuity.maximumOwnerRecoveryHours !== 24
    || !Number.isSafeInteger(continuity.maximumReceiptAgeHours)
    || continuity.maximumReceiptAgeHours < 1
    || continuity.maximumReceiptAgeHours > 168
    || !Number.isSafeInteger(continuity.maximumRecoveryDrillAgeDays)
    || continuity.maximumRecoveryDrillAgeDays < 1
    || continuity.maximumRecoveryDrillAgeDays > 30
    || !isRecord(watchdog)
    || watchdog.workflowPathSha256 !== workflowPathDigest
  ) fail("SEO_HEALTH_WATCHDOG_CONFIG_INVALID");

  if (!required) return watchdog;
  if (
    watchdog.provider !== WATCHDOG_PROVIDER
    || !SHA256.test(watchdog.monitorIdSha256 || "")
    || !SHA256.test(watchdog.githubAppIdSha256 || "")
    || !SHA256.test(watchdog.installationIdSha256 || "")
    || !exactKeys(watchdog.requiredPermissions, Object.keys(WATCHDOG_PERMISSIONS))
    || watchdog.requiredPermissions.actions !== WATCHDOG_PERMISSIONS.actions
    || watchdog.requiredPermissions.metadata !== WATCHDOG_PERMISSIONS.metadata
    || !isRecord(watchdog.receipt)
  ) fail("SEO_HEALTH_WATCHDOG_CONFIG_INVALID");
  loadPublicKey(watchdog.receiptSignature);
  return watchdog;
}

function unsignedReceipt(receipt) {
  const unsigned = { ...receipt };
  delete unsigned.signature;
  return unsigned;
}

export function verifyWatchdogReceipt(config, { now = new Date() } = {}) {
  const watchdog = validateWatchdogConfig(config, { required: true });
  const receipt = watchdog.receipt;
  if (
    !exactKeys(receipt, RECEIPT_KEYS)
    || receipt.schemaVersion !== 1
    || receipt.contractVersion !== WATCHDOG_RECEIPT_CONTRACT
    || receipt.provider !== WATCHDOG_PROVIDER
    || receipt.monitorIdSha256 !== watchdog.monitorIdSha256
    || receipt.githubAppIdSha256 !== watchdog.githubAppIdSha256
    || receipt.installationIdSha256 !== watchdog.installationIdSha256
    || receipt.repository !== WATCHDOG_REPOSITORY
    || receipt.repositoryIdSha256 !== config?.deploymentBinding?.fingerprints?.gitRepoIdSha256
    || receipt.workflowPath !== WATCHDOG_WORKFLOW_PATH
    || receipt.workflowPathSha256 !== watchdog.workflowPathSha256
    || !exactKeys(receipt.permissions, Object.keys(WATCHDOG_PERMISSIONS))
    || receipt.permissions.actions !== WATCHDOG_PERMISSIONS.actions
    || receipt.permissions.metadata !== WATCHDOG_PERMISSIONS.metadata
    || receipt.workflowState !== "active"
    || !exactKeys(receipt.drill, DRILL_KEYS)
    || receipt.drill.workflowReenabled !== true
    || receipt.drill.ownerAlertDelivered !== true
    || !exactKeys(receipt.signature, SIGNATURE_KEYS)
    || receipt.signature.algorithm !== "Ed25519"
    || receipt.signature.keyId !== watchdog.receiptSignature.keyId
  ) fail("SEO_HEALTH_WATCHDOG_RECEIPT_INVALID");

  const observedAt = canonicalIso(receipt.observedAt);
  const disabledAt = canonicalIso(receipt.drill.disabledAt);
  const detectedAt = canonicalIso(receipt.drill.detectedAt);
  const reenabledAt = canonicalIso(receipt.drill.reenabledAt);
  const alertedAt = canonicalIso(receipt.drill.alertedAt);
  const nowMs = now instanceof Date ? now.getTime() : Number.NaN;
  if (
    !Number.isFinite(nowMs)
    || [observedAt, disabledAt, detectedAt, reenabledAt, alertedAt].some((value) => value === null)
    || disabledAt > detectedAt
    || detectedAt > alertedAt
    || alertedAt > reenabledAt
    || Math.max(reenabledAt, alertedAt) > observedAt
    || detectedAt - disabledAt > config.schedulerContinuity.maximumDetectionMinutes * 60_000
    || alertedAt - disabledAt > config.schedulerContinuity.maximumDetectionMinutes * 60_000
    || reenabledAt - disabledAt > config.schedulerContinuity.maximumOwnerRecoveryHours * 3_600_000
    || observedAt > nowMs + 5 * 60_000
    || nowMs - observedAt > config.schedulerContinuity.maximumReceiptAgeHours * 3_600_000
    || nowMs - reenabledAt > config.schedulerContinuity.maximumRecoveryDrillAgeDays * 86_400_000
  ) fail("SEO_HEALTH_WATCHDOG_RECEIPT_STALE");

  const publicKey = loadPublicKey(watchdog.receiptSignature);
  const signature = canonicalBase64Url(receipt.signature.valueBase64Url);
  if (!signature || signature.length !== 64) fail("SEO_HEALTH_WATCHDOG_RECEIPT_SIGNATURE_INVALID");
  let valid = false;
  try {
    valid = verify(null, signaturePayload(unsignedReceipt(receipt)), publicKey, signature);
  } catch {
    valid = false;
  }
  if (!valid) fail("SEO_HEALTH_WATCHDOG_RECEIPT_SIGNATURE_INVALID");
  return Object.freeze({
    provider: receipt.provider,
    observedAt: receipt.observedAt,
    workflowState: receipt.workflowState,
    keyId: receipt.signature.keyId,
  });
}

export function buildSignedWatchdogReceipt(unsigned, signing) {
  if (!isRecord(unsigned) || !isRecord(signing)) fail("SEO_HEALTH_WATCHDOG_SIGNING_INPUT_INVALID");
  let privateKey;
  try {
    const bytes = canonicalBase64(signing.privateKeyPkcs8Base64);
    if (!bytes) fail("SEO_HEALTH_WATCHDOG_SIGNING_INPUT_INVALID");
    privateKey = createPrivateKey({ key: bytes, format: "der", type: "pkcs8" });
    if (privateKey.asymmetricKeyType !== "ed25519") fail("SEO_HEALTH_WATCHDOG_SIGNING_INPUT_INVALID");
  } catch (error) {
    if (error instanceof SeoHealthWatchdogReceiptError) throw error;
    fail("SEO_HEALTH_WATCHDOG_SIGNING_INPUT_INVALID");
  }
  const signature = sign(null, signaturePayload(unsigned), privateKey).toString("base64url");
  return {
    ...structuredClone(unsigned),
    signature: { algorithm: "Ed25519", keyId: signing.keyId, valueBase64Url: signature },
  };
}

export function digestEquals(left, right) {
  if (!SHA256.test(left || "") || !SHA256.test(right || "")) return false;
  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}
