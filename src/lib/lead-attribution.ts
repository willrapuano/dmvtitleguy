import { leadLandingPage } from "@/lib/lead-protection";
import type { NextRequest } from "next/server";

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function path(value: unknown) {
  const candidate = text(value, 500);
  return candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : "";
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
  return {
    attributionVersion: body.attributionVersion === "1" ? "1" : "",
    firstLandingPage: path(body.firstLandingPage),
    conversionPage: path(body.conversionPage),
    firstReferrerHost: hostname(body.firstReferrerHost),
    firstTouchAt: timestamp(body.firstTouchAt),
    utmSource: text(body.utmSource, 200),
    utmMedium: text(body.utmMedium, 200),
    utmCampaign: text(body.utmCampaign, 200),
    utmTerm: text(body.utmTerm, 200),
    utmContent: text(body.utmContent, 200),
    serverLandingPage: leadLandingPage(request),
  };
}
