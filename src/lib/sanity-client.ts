import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Force production dataset - environment variable was set incorrectly to 'development'
const DATASET = "production";

export const sanityClient = createClient({
  projectId: (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim(),
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined,
  stega: { enabled: false },
});

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
