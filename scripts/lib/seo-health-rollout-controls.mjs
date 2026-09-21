import { verifyWatchdogReceipt } from "./seo-health-watchdog-receipt.mjs";

export const MISSED_RECOVERY_REASON_CODES = Object.freeze([
  "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_CANARY_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_PERMANENT_CHECKPOINT_MISSED",
]);

const SHA256 = /^[a-f0-9]{64}$/;
const GITHUB_SHA = /^[a-f0-9]{40}$/;
const SAFE_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const ARCHIVED_KEYS = Object.freeze([
  "status", "checkpointId", "scheduledDate", "finishedAt", "commentId",
  "commentBodySha256", "deploymentFingerprint", "evidenceDigest", "healthSourceDigest", "githubSha",
]);
const MISSED_KEYS = Object.freeze([
  "status", "checkpointId", "scheduledDate", "detectedAt", "reasonCode",
  "commentId", "commentBodySha256", "githubSha",
]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, expected) {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  return new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

function time(value) {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value ? parsed : null;
}

export function dateInEastern(now) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function addCalendarDays(date, days) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function validHistoryEntry(entry, date, checkpointId) {
  if (entry?.status === "archived") {
    return exactKeys(entry, ARCHIVED_KEYS)
      && entry.checkpointId === checkpointId
      && entry.scheduledDate === date
      && time(entry.finishedAt) !== null
      && Number.isSafeInteger(entry.commentId) && entry.commentId > 0
      && SHA256.test(entry.commentBodySha256 || "")
      && SHA256.test(entry.deploymentFingerprint || "")
      && SHA256.test(entry.evidenceDigest || "")
      && SHA256.test(entry.healthSourceDigest || "")
      && GITHUB_SHA.test(entry.githubSha || "");
  }
  if (entry?.status === "missed") {
    return exactKeys(entry, MISSED_KEYS)
      && entry.checkpointId === checkpointId
      && entry.scheduledDate === date
      && time(entry.detectedAt) !== null
      && /^[A-Z0-9_]{3,96}$/.test(entry.reasonCode || "")
      && Number.isSafeInteger(entry.commentId) && entry.commentId > 0
      && SHA256.test(entry.commentBodySha256 || "")
      && GITHUB_SHA.test(entry.githubSha || "");
  }
  return false;
}

export function requiredCheckpointHistoryDates(config, now = new Date()) {
  if (config?.timezone !== "America/New_York" || !isRecord(config?.checkpointCalendar)) return [];
  const cutoff = addCalendarDays(dateInEastern(now), -1);
  return Object.keys(config.checkpointCalendar).filter((date) => date < cutoff).sort();
}

export function evaluateSeoHealthRolloutControls(config, { now = new Date() } = {}) {
  if (!isRecord(config) || !["disabled", "canary", "permanent"].includes(config.rolloutPhase)) {
    return Object.freeze({ ready: false, code: "SEO_HEALTH_ROLLOUT_CONFIG_INVALID" });
  }
  if (config.rolloutPhase === "disabled") {
    return Object.freeze({ ready: false, code: "SEO_HEALTH_ROLLOUT_DISABLED" });
  }
  if (
    config.timezone !== "America/New_York"
    || !isRecord(config.checkpointCalendar)
    || !isRecord(config.checkpointHistory)
    || Object.entries(config.checkpointCalendar).some(([date, id]) => !validDate(date) || !SAFE_ID.test(id || ""))
    || Object.keys(config.checkpointHistory).some((date) => !Object.hasOwn(config.checkpointCalendar, date))
  ) return Object.freeze({ ready: false, code: "SEO_HEALTH_CHECKPOINT_HISTORY_INVALID" });

  for (const [date, entry] of Object.entries(config.checkpointHistory)) {
    if (!validHistoryEntry(entry, date, config.checkpointCalendar[date])) {
      return Object.freeze({ ready: false, code: "SEO_HEALTH_CHECKPOINT_HISTORY_INVALID" });
    }
  }
  const missingDates = requiredCheckpointHistoryDates(config, now)
    .filter((date) => !Object.hasOwn(config.checkpointHistory, date));
  if (missingDates.length > 0) {
    return Object.freeze({ ready: false, code: "SEO_HEALTH_CHECKPOINT_HISTORY_INCOMPLETE" });
  }
  try {
    verifyWatchdogReceipt(config, { now });
  } catch (error) {
    return Object.freeze({
      ready: false,
      code: typeof error?.code === "string" ? error.code : "SEO_HEALTH_WATCHDOG_RECEIPT_INVALID",
    });
  }
  return Object.freeze({ ready: true, code: "SEO_HEALTH_CONTROLS_READY" });
}

export function validateMissedCheckpointRecoveryInput(config, {
  checkpointDate,
  checkpointId,
  reasonCode,
  now = new Date(),
}) {
  if (
    !isRecord(config)
    || !["disabled", "canary", "permanent"].includes(config.rolloutPhase)
    || !validDate(checkpointDate)
    || config.checkpointCalendar?.[checkpointDate] !== checkpointId
    || !MISSED_RECOVERY_REASON_CODES.includes(reasonCode)
    || dateInEastern(now) <= addCalendarDays(checkpointDate, 1)
  ) throw new Error("SEO_HEALTH_MISSED_RECOVERY_INPUT_INVALID");
  if (Object.hasOwn(config.checkpointHistory || {}, checkpointDate)) {
    throw new Error("SEO_HEALTH_MISSED_RECOVERY_ALREADY_REFERENCED");
  }
  return Object.freeze({ checkpointDate, checkpointId, reasonCode });
}
