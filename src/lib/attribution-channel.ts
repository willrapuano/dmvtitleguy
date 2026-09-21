export type AttributionChannelInput = {
  firstReferrerHost: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
};

export function classifyFirstChannel({
  firstReferrerHost,
  utmSource,
  utmMedium,
  utmCampaign,
  utmContent,
}: AttributionChannelInput) {
  const hasCampaign = Boolean(utmSource || utmMedium || utmCampaign || utmContent);
  const paidMedium = /^(cpc|ppc|paid|paidsearch|display|retargeting)$/i.test(utmMedium);
  const organicMedium = /^(organic|organic-search|seo)$/i.test(utmMedium);
  const googleBusinessProfile = /^google$/i.test(utmSource)
    && /^organic$/i.test(utmMedium)
    && /^gbp$/i.test(utmCampaign)
    && /^profile-website-button$/i.test(utmContent);
  const searchReferrer = /(^|\.)(google|bing|yahoo|duckduckgo)\.[a-z.]+$|(^|\.)bing\.com$|(^|\.)duckduckgo\.com$/i.test(firstReferrerHost);

  return paidMedium
    ? "paid"
    : googleBusinessProfile
      ? "google-business-profile"
      : searchReferrer || organicMedium
        ? "organic-search"
        : hasCampaign
          ? "campaign"
          : firstReferrerHost
            ? "referral"
            : "direct-or-unknown";
}
