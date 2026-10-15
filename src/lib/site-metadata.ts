import type { Metadata } from "next";

const SITE_NAME = "Pruitt Title | DMV Title Guy";

/** Share-card image for pages without their own (link previews on social and in texts). */
export const DEFAULT_OG_IMAGE = { url: "/og-default.jpg", width: 1200, height: 630, alt: "Blue brick rowhouse in Washington, DC" };

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
