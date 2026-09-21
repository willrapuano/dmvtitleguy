import { leadLandingPage } from "@/lib/lead-protection";
import { classifyFirstChannel } from "@/lib/attribution-channel";
import type { NextRequest } from "next/server";

const ATTRIBUTION_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;
const FUTURE_SKEW_MS = 5 * 60 * 1000;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function path(value: unknown) {
  const candidate = text(value, 500);
  const pathname = candidate.split(/[?#]/, 1)[0];
  return pathname.startsWith("/") && !pathname.startsWith("//") ? pathname : "";
}

function hostname(value: unknown) {
  const candidate = text(value, 200).toLowerCase();
  return /^[a-z0-9.-]+$/.test(candidate) ? candidate : "";
}

function timestamp(value: unknown, validVersion: boolean) {
  if (!validVersion) return "";
  const candidate = text(value, 40);
  const parsed = Date.parse(candidate);
  const now = Date.now();
  return candidate && Number.isFinite(parsed) && parsed <= now + FUTURE_SKEW_MS && parsed >= now - ATTRIBUTION_WINDOW_MS
    ? new Date(parsed).toISOString()
    : "";
}

function campaignText(value: unknown) {
  const candidate = text(value, 120);
  if (!candidate || /@/.test(candidate)) return "";
  return candidate.replace(/[^a-z0-9 _.:/+~-]/gi, "").slice(0, 120);
}

export function leadAttributionFields(body: Record<string, unknown>, request: NextRequest) {
  const validVersion = body.attributionVersion === "2";
  const firstLandingPage = path(body.firstLandingPage);
  const firstReferrerHost = hostname(body.firstReferrerHost);
  const firstTouchAt = timestamp(body.firstTouchAt, validVersion);
  const utmSource = campaignText(body.utmSource);
  const utmMedium = campaignText(body.utmMedium);
  const utmCampaign = campaignText(body.utmCampaign);
  const utmContent = campaignText(body.utmContent);
  const hasCampaign = Boolean(utmSource || utmMedium || utmCampaign || utmContent);
  const firstChannel = classifyFirstChannel({ firstReferrerHost, utmSource, utmMedium, utmCampaign, utmContent });
  const attributionComplete = Boolean(validVersion && firstLandingPage && firstTouchAt);

  const serverConversionPage = leadLandingPage(request);
  return {
    attributionVersion: validVersion ? "2" : "",
    firstLandingPage,
    conversionPage: path(body.conversionPage),
    firstReferrerHost,
    firstTouchAt,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm: campaignText(body.utmTerm),
    utmContent,
    firstChannel,
    lastNonDirectReferrerHost: hostname(body.lastNonDirectReferrerHost),
    lastNonDirectTouchAt: timestamp(body.lastNonDirectTouchAt, validVersion),
    lastUtmSource: campaignText(body.lastUtmSource),
    lastUtmMedium: campaignText(body.lastUtmMedium),
    lastUtmCampaign: campaignText(body.lastUtmCampaign),
    lastUtmTerm: campaignText(body.lastUtmTerm),
    lastUtmContent: campaignText(body.lastUtmContent),
    attributionComplete,
    attributionConfidence: attributionComplete && firstReferrerHost ? "high" : attributionComplete && hasCampaign ? "medium" : attributionComplete ? "low" : "invalid-or-missing",
    deploymentEnvironment: process.env.VERCEL_ENV || (process.env.NODE_ENV === "production" ? "production" : "local"),
    serverConversionPage,
    // Backward-compatible webhook alias while the legacy GHL contact field is
    // retired. It contains a conversion path, never a session landing path.
    serverLandingPage: serverConversionPage,
  };
}
