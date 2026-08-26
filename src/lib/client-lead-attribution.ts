"use client";

const STORAGE_KEY = "dmvtitleguy_attribution_v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type UtmKey = (typeof UTM_KEYS)[number];

interface StoredAttribution {
  attributionVersion: "1";
  firstLandingPage: string;
  firstReferrerHost: string;
  firstTouchAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}

function safePath() {
  return `${window.location.pathname}${window.location.search}`.slice(0, 500);
}

function referrerHost() {
  try {
    if (!document.referrer) return "";
    const url = new URL(document.referrer);
    return url.hostname === window.location.hostname ? "" : url.hostname.slice(0, 200);
  } catch {
    return "";
  }
}

function currentUtm() {
  const params = new URLSearchParams(window.location.search);
  const values = Object.fromEntries(UTM_KEYS.map((key) => [key, (params.get(key) || "").slice(0, 200)])) as Record<UtmKey, string>;
  return {
    utmSource: values.utm_source,
    utmMedium: values.utm_medium,
    utmCampaign: values.utm_campaign,
    utmTerm: values.utm_term,
    utmContent: values.utm_content,
  };
}

export function captureFirstTouch(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as StoredAttribution;
    const attribution: StoredAttribution = {
      attributionVersion: "1",
      firstLandingPage: safePath(),
      firstReferrerHost: referrerHost(),
      firstTouchAt: new Date().toISOString(),
      ...currentUtm(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return null;
  }
}

export function getLeadAttribution() {
  const firstTouch = captureFirstTouch();
  return {
    ...(firstTouch || {}),
    conversionPage: typeof window === "undefined" ? "" : safePath(),
  };
}

