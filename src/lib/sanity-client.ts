import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Force production dataset - environment variable was set incorrectly to 'development'
const DATASET = "production";
const PROJECT_ID = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim();
const TOKEN = process.env.SANITY_API_TOKEN;

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN || undefined,
  stega: { enabled: false },
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
