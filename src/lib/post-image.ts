/**
 * Sized URLs for post images, whichever of the two sources a post uses.
 *
 * Sanity's image CDN serves the original asset whenever no transform params are
 * present. The blog index was requesting 128 untouched full-res PNGs — averaging
 * 3.2 MB and peaking at 8.2 MB for a 2752x1536 source — so the grid effectively
 * asked the browser for hundreds of megabytes and most images never painted.
 * Appending a target width plus `auto=format` moves that same 8.2 MB asset to
 * ~24 KB of webp at card size. `fit=max` only ever scales down, so a small source
 * is never upscaled past its natural resolution.
 *
 * The earlier version of this file returned non-Sanity URLs untouched, on the
 * stated assumption that local `/blog/*.png` files "have no transform endpoint".
 * That was wrong: they have Next's own, at /_next/image. Some posts store a local
 * path in Sanity rather than a CDN URL, and one of them was shipping a 1.17 MB
 * PNG into a 355px card on every blog index view.
 */

const SANITY_CDN_PREFIX = "https://cdn.sanity.io/";

/**
 * Next's optimizer rejects any width outside deviceSizes + imageSizes with a 400,
 * so a requested width has to be snapped up to the nearest one it will serve.
 * These are the framework defaults; next.config.mjs overrides neither list.
 */
const NEXT_IMAGE_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

function snapWidth(width: number): number {
  return (
    NEXT_IMAGE_WIDTHS.find((allowed) => allowed >= width) ??
    NEXT_IMAGE_WIDTHS[NEXT_IMAGE_WIDTHS.length - 1]
  );
}

export function isSanityImage(url?: string | null): boolean {
  return typeof url === "string" && url.startsWith(SANITY_CDN_PREFIX);
}

/** An app-relative asset under /public. Protocol-relative URLs are not ours. */
function isLocalAsset(url?: string | null): boolean {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
}

export function postImageUrl(url: string, width: number, quality = 75): string {
  if (isSanityImage(url)) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("q", String(quality));
      parsed.searchParams.set("fit", "max");
      parsed.searchParams.set("auto", "format");
      return parsed.toString();
    } catch {
      return url;
    }
  }

  if (isLocalAsset(url)) {
    const params = new URLSearchParams({
      url,
      w: String(snapWidth(width)),
      q: String(quality),
    });
    return `/_next/image?${params.toString()}`;
  }

  return url;
}

/**
 * Build a srcset so each viewport pulls only the width it needs. Returns undefined
 * for sources neither endpoint can resize — an off-site absolute URL, say — since
 * an empty srcset is worse than none.
 */
export function postImageSrcSet(
  url: string,
  widths: number[],
  quality = 75
): string | undefined {
  const sanity = isSanityImage(url);
  if (!sanity && !isLocalAsset(url)) return undefined;

  const seen = new Set<number>();
  const entries: string[] = [];
  for (const requested of widths) {
    // Two requested widths can snap to the same served width, which would
    // otherwise emit a duplicate candidate.
    const width = sanity ? requested : snapWidth(requested);
    if (seen.has(width)) continue;
    seen.add(width);
    entries.push(`${postImageUrl(url, width, quality)} ${width}w`);
  }
  return entries.join(", ");
}
