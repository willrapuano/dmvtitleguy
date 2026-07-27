/**
 * Sanity's image CDN serves the original asset whenever no transform params are
 * present. The blog index was requesting 128 untouched full-res PNGs — averaging
 * 3.2 MB and peaking at 8.2 MB for a 2752x1536 source — so the grid effectively
 * asked the browser for hundreds of megabytes and most images never painted.
 *
 * Appending a target width plus `auto=format` moves that same 8.2 MB asset to
 * ~24 KB of webp at card size. `fit=max` only ever scales down, so a small
 * source is never upscaled past its natural resolution.
 */

const SANITY_CDN_PREFIX = "https://cdn.sanity.io/";

export function isSanityImage(url?: string | null): boolean {
  return typeof url === "string" && url.startsWith(SANITY_CDN_PREFIX);
}

export function sanityImageUrl(url: string, width: number, quality = 75): string {
  if (!isSanityImage(url)) return url;

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

/**
 * Build a srcset so each viewport pulls only the width it needs. Returns
 * undefined for non-Sanity sources (local /blog/*.png files), which have no
 * transform endpoint and must be left as-is.
 */
export function sanityImageSrcSet(
  url: string,
  widths: number[],
  quality = 75
): string | undefined {
  if (!isSanityImage(url)) return undefined;
  return widths.map((w) => `${sanityImageUrl(url, w, quality)} ${w}w`).join(", ");
}
