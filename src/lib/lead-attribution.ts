import { leadLandingPage } from "@/lib/lead-protection";
import type { NextRequest } from "next/server";

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

function timestamp(value: unknown) {
  const candidate = text(value, 40);
  return candidate && !Number.isNaN(Date.parse(candidate)) ? candidate : "";
}

export function leadAttributionFields(body: Record<string, unknown>, request: NextRequest) {
  const firstLandingPage = path(body.firstLandingPage);
  const firstReferrerHost = hostname(body.firstReferrerHost);
  const firstTouchAt = timestamp(body.firstTouchAt);
  const utmSource = text(body.utmSource, 200);
  const utmMedium = text(body.utmMedium, 200);
  const hasCampaign = Boolean(utmSource || utmMedium);
  const paidMedium = /^(cpc|ppc|paid|paidsearch|display|retargeting)$/i.test(utmMedium);
  const searchReferrer = /(^|\.)(google|bing|yahoo|duckduckgo)\.[a-z.]+$|(^|\.)bing\.com$|(^|\.)duckduckgo\.com$/i.test(firstReferrerHost);
  const firstChannel = paidMedium ? "paid" : searchReferrer && !paidMedium ? "organic-search" : hasCampaign ? "campaign" : firstReferrerHost ? "referral" : "direct-or-unknown";
  const attributionComplete = Boolean(firstLandingPage && firstTouchAt);

  return {
    attributionVersion: body.attributionVersion === "2" ? "2" : "",
    firstLandingPage,
    conversionPage: path(body.conversionPage),
    firstReferrerHost,
    firstTouchAt,
    utmSource,
    utmMedium,
    utmCampaign: text(body.utmCampaign, 200),
    utmTerm: text(body.utmTerm, 200),
    utmContent: text(body.utmContent, 200),
    firstChannel,
    lastNonDirectReferrerHost: hostname(body.lastNonDirectReferrerHost),
    lastNonDirectTouchAt: timestamp(body.lastNonDirectTouchAt),
    lastUtmSource: text(body.lastUtmSource, 200),
    lastUtmMedium: text(body.lastUtmMedium, 200),
    lastUtmCampaign: text(body.lastUtmCampaign, 200),
    lastUtmTerm: text(body.lastUtmTerm, 200),
    lastUtmContent: text(body.lastUtmContent, 200),
    attributionComplete,
    attributionConfidence: attributionComplete && (firstReferrerHost || hasCampaign) ? "high" : attributionComplete ? "medium" : "low",
    deploymentEnvironment: process.env.VERCEL_ENV || (process.env.NODE_ENV === "production" ? "production" : "local"),
    serverLandingPage: leadLandingPage(request),
  };
}
