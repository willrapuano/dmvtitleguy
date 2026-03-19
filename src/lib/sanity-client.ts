import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim(),
  dataset: (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim(),
  apiVersion: "2024-01-01",
  useCdn: process.env.SANITY_API_TOKEN ? false : true,
  token: process.env.SANITY_API_TOKEN || undefined,
});

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
