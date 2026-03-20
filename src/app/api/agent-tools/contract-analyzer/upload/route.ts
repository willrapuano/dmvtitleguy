import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getCurrentUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import { detectFormType } from "@/lib/contract-analyzer/detect-form";
import { analyzeContract } from "@/lib/contract-analyzer/analyze";

export const maxDuration = 60;

async function parsePdf(buffer: Buffer): Promise<{ text: string }> {
  // Polyfill DOMMatrix for serverless environments (Vercel)
  if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      m11 = 1; m12 = 0; m13 = 0; m14 = 0;
      m21 = 0; m22 = 1; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41 = 0; m42 = 0; m43 = 0; m44 = 1;
      is2D = true; isIdentity = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(init?: any) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init;
          this.m11 = this.a; this.m12 = this.b;
          this.m21 = this.c; this.m22 = this.d;
          this.m41 = this.e; this.m42 = this.f;
          this.isIdentity = false;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inverse() { return new (globalThis as any).DOMMatrix(); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      multiply() { return new (globalThis as any).DOMMatrix(); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scale() { return new (globalThis as any).DOMMatrix(); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      translate() { return new (globalThis as any).DOMMatrix(); }
      transformPoint(p: { x: number; y: number }) { return p; }
    };
  }

  // pdf-parse v2 uses PDFParse class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { PDFParse } = await import("pdf-parse") as any;
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return { text: result.text };
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
      const parsed = await parsePdf(buffer);
      rawText = parsed.text || "";
    } catch (err) {
      console.error("PDF parse error:", err);
      return NextResponse.json({ error: `Failed to parse PDF: ${String(err)}` }, { status: 422 });
    }

    // Clean up blob after reading (don't leave PDFs in storage)
    try { await del(blobUrl); } catch { /* ignore cleanup errors */ }

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
