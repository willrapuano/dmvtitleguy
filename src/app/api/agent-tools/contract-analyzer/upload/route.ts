import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getCurrentUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import { detectFormType } from "@/lib/contract-analyzer/detect-form";
import { analyzeContract } from "@/lib/contract-analyzer/analyze";

export const maxDuration = 60;

async function parsePdf(buffer: Buffer): Promise<string> {
  // Import the lib directly to skip pdf-parse's broken test-file auto-run
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse/lib/pdf-parse.js");
  const result = await pdfParse(buffer);
  return result.text || "";
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.approved) {
      return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
    }

    const { blobUrl, fileName } = await req.json();
    if (!blobUrl || typeof blobUrl !== "string") {
      return NextResponse.json({ error: "blobUrl required" }, { status: 400 });
    }

    // Download PDF from Vercel Blob
    const blobRes = await fetch(blobUrl);
    if (!blobRes.ok) {
      return NextResponse.json({ error: "Failed to fetch uploaded PDF" }, { status: 422 });
    }
    const buffer = Buffer.from(await blobRes.arrayBuffer());

    // Extract text
    let rawText: string;
    try {
      rawText = await parsePdf(buffer);
    } catch (err) {
      console.error("PDF parse error:", err);
      return NextResponse.json({ error: `Failed to parse PDF: ${String(err)}` }, { status: 422 });
    }

    // Clean up blob after reading
    try { await del(blobUrl); } catch { /* ignore */ }

    if (rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF appears to be empty or image-only. Text extraction failed." },
        { status: 422 }
      );
    }

    const { formType } = detectFormType(rawText);
    const result = await analyzeContract(rawText, formType);

    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        fileName: fileName || "contract.pdf",
        formType,
        overallStatus: result.findings.some((f) => f.severity === "critical")
          ? "FAIL"
          : result.findings.some((f) => f.severity === "warning")
          ? "WARN"
          : "PASS",
        summary: result.summary,
        rawText: rawText.slice(0, 100000),
        aiSource: result.aiSource,
        sectionsJson: JSON.stringify(result.sections),
        metadataJson: JSON.stringify(result.metadata),
        findings: {
          create: result.findings.map((f) => ({
            section: f.section,
            severity: f.severity,
            title: f.title,
            description: f.description,
            pageRef: f.pageRef || null,
            lineRef: f.lineRef || null,
          })),
        },
      },
    });

    return NextResponse.json({ ok: true, analysisId: analysis.id });
  } catch (err) {
    console.error("[upload] Unhandled error:", err);
    return NextResponse.json(
      { error: `Server error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
