"use client";

const STORAGE_KEY = "dmvtitleguy_attribution_v2";
const LEGACY_STORAGE_KEY = "dmvtitleguy_attribution_v1";
const SESSION_TOUCH_KEY = "dmvtitleguy_attribution_touch_v2";
const ATTRIBUTION_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type UtmKey = (typeof UTM_KEYS)[number];

interface StoredAttribution {
  attributionVersion: "2";
  firstLandingPage: string;
  firstReferrerHost: string;
  firstTouchAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  lastNonDirectReferrerHost: string;
  lastNonDirectTouchAt: string;
  lastUtmSource: string;
  lastUtmMedium: string;
  lastUtmCampaign: string;
  lastUtmTerm: string;
  lastUtmContent: string;
}

function safePath() {
  return window.location.pathname.slice(0, 500);
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
    // Version 1 stored the full query string indefinitely. Remove it rather
    // than carrying old or potentially sensitive parameters forward.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    let existing: StoredAttribution | null = null;
    if (existingRaw) {
      const parsed = JSON.parse(existingRaw) as Partial<StoredAttribution>;
      const firstTouch = typeof parsed.firstTouchAt === "string" ? Date.parse(parsed.firstTouchAt) : Number.NaN;
      if (parsed.attributionVersion === "2" && Number.isFinite(firstTouch) && Date.now() - firstTouch <= ATTRIBUTION_WINDOW_MS) {
        existing = parsed as StoredAttribution;
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const referrer = referrerHost();
    const utm = currentUtm();
    const hasNonDirectTouch = Boolean(referrer || Object.values(utm).some(Boolean));
    const touchFingerprint = JSON.stringify([referrer, ...Object.values(utm)]);
    const isNewTouch = hasNonDirectTouch && window.sessionStorage.getItem(SESSION_TOUCH_KEY) !== touchFingerprint;
    if (hasNonDirectTouch) window.sessionStorage.setItem(SESSION_TOUCH_KEY, touchFingerprint);
    if (existing) {
      if (isNewTouch) {
        existing = {
          ...existing,
          lastNonDirectReferrerHost: referrer,
          lastNonDirectTouchAt: new Date().toISOString(),
          lastUtmSource: utm.utmSource,
          lastUtmMedium: utm.utmMedium,
          lastUtmCampaign: utm.utmCampaign,
          lastUtmTerm: utm.utmTerm,
          lastUtmContent: utm.utmContent,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
      return existing;
    }

    const now = new Date().toISOString();
    const attribution: StoredAttribution = {
      attributionVersion: "2",
      firstLandingPage: safePath(),
      firstReferrerHost: referrer,
      firstTouchAt: now,
      ...utm,
      lastNonDirectReferrerHost: hasNonDirectTouch ? referrer : "",
      lastNonDirectTouchAt: hasNonDirectTouch ? now : "",
      lastUtmSource: hasNonDirectTouch ? utm.utmSource : "",
      lastUtmMedium: hasNonDirectTouch ? utm.utmMedium : "",
      lastUtmCampaign: hasNonDirectTouch ? utm.utmCampaign : "",
      lastUtmTerm: hasNonDirectTouch ? utm.utmTerm : "",
      lastUtmContent: hasNonDirectTouch ? utm.utmContent : "",
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
