import { NextResponse } from "next/server";

// Public uploads are intentionally disabled for this release. Contracts and
// title documents require a private, authenticated retrieval workflow before
// they can be accepted safely. The lead forms arrange that secure follow-up.
export async function POST() {
  return NextResponse.json(
    { error: "Document upload is not available" },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
