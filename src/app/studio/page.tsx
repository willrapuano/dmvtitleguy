/**
 * Sanity Studio route
 * See https://www.sanity.io/docs/cms-as-code
 */

"use client";

import { Suspense } from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity/sanity.config";

// Disable static generation - this is a client-side only route
export const dynamic = "force-dynamic";

function StudioLoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p>Loading Sanity Studio...</p>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <NextStudio config={config} />
    </Suspense>
  );
}