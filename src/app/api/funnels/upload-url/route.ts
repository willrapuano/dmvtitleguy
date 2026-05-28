import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel Blob client upload handler for funnel file uploads.
 * In @vercel/blob v2, the client-side upload() function handles the entire
 * upload flow. This endpoint exists so handleUploadUrl has a valid target,
 * but the actual upload is managed by the client library.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In v2, the client upload handles the blob creation directly.
    // This endpoint simply acknowledges the request.
    return NextResponse.json(body);
  } catch (error) {
    console.error("[Upload URL] Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}