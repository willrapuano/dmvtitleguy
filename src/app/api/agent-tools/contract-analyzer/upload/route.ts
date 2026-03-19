import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import { detectFormType } from "@/lib/contract-analyzer/detect-form";
import { analyzeContract } from "@/lib/contract-analyzer/analyze";

async function parsePdf(buffer: Buffer): Promise<{ text: string }> {
  // Dynamic import to avoid build-time issues with pdf-parse
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await import("pdf-parse");
  const fn = mod.default || mod;
  return fn(buffer);
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF file required" }, { status: 400 });
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText: string;
    try {
      const parsed = await parsePdf(buffer);
      rawText = parsed.text || "";
    } catch (err) {
      console.error("PDF parse error:", err);
      return NextResponse.json({ error: `Failed to parse PDF: ${String(err)}` }, { status: 422 });
    }

    if (rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF appears to be empty or image-only. Text extraction failed." },
        { status: 422 }
      );
    }

    // Detect form type
    const { formType } = detectFormType(rawText);

    // Run analysis
    const result = await analyzeContract(rawText, formType);

    // Persist
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        fileName: file.name,
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
