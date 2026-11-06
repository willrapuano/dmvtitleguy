/**
 * IndexNow: tells Bing (and the other IndexNow engines, which share submissions)
 * that a URL changed, instead of waiting for a crawl. Bing's index also feeds
 * DuckDuckGo, Yahoo and ChatGPT's web answers, about a quarter of the site's
 * organic visits (GA4, Aug–Nov 2026).
 *
 * The key is public by design: search engines verify it at /<key>.txt.
 */
export const INDEXNOW_KEY = "43b15a6bea5574a6e2ff53dc571d276d";
export const INDEXNOW_HOST = "dmvtitleguy.io";
const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitIndexNow(urls: string[]): Promise<{ submitted: number; status: number | null }> {
  const urlList = [...new Set(urls)].filter((url) => new URL(url).hostname === INDEXNOW_HOST);
  if (urlList.length === 0) return { submitted: 0, status: null };
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urlList.slice(0, 10000),
    }),
    signal: AbortSignal.timeout(20_000),
  });
  return { submitted: urlList.length, status: response.status };
}
