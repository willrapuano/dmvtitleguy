import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisPayload, RuleFinding, SectionStatus } from "./types";

const ANALYSIS_SECTIONS = [
  "Parties & Property",
  "Purchase Price & Financing",
  "Deposit & Escrow",
  "Settlement & Dates",
  "Contingencies & Addenda",
  "Signatures & Initials",
  "Disclosures & Compliance",
];

const SYSTEM_PROMPT = `You are a real estate contract compliance analyst for the DC/Virginia metro area.
Analyze the uploaded contract text and produce structured findings.

You MUST check for ALL of the following:
1. MISSING REQUIRED FIELDS — buyer name, seller name, property address, legal description, listing/selling broker info
2. REQUIRED CHECKBOXES — financing type must be selected, contingency boxes must be checked where applicable
3. MISSING INITIALS/SIGNATURES — check each page reference for buyer/seller initials, final signatures on signature page
4. ADDENDA DEPENDENCY GAPS — if an addendum is referenced but not attached, flag it; if contingency references an addendum, verify consistency
5. DATE CONSISTENCY — ratification/offer/acceptance dates must be logical; settlement date must be after ratification; all deadlines must be after ratification
6. DEPOSIT/ESCROW TIMELINE — deposit timing must be specified and compliant for the form/association; escrow agent must be named
7. PRICE/FINANCING MATH — purchase price = down payment + loan amount (if financed); earnest money amounts must be specified; check percentage calculations

AND if form type is MAR (Maryland Residential Contract of Sale), include these MAR-specific checks:
8. TIME IS OF THE ESSENCE clause present and not contradicted by other timing language
9. FINANCING CONTINGENCY mechanics (paragraphs 9-11) complete and consistent: loan type/amount, application deadline, commitment date, notice/default mechanics
10. AGRICULTURAL ASSESSMENT / agricultural transfer tax provisions properly addressed (whether applicable and who pays)
11. FOREST CONSERVATION PROGRAM provisions addressed (disclosure/acknowledgement if applicable)
12. MAR separate addenda checklist format completed; referenced addenda in checklist match addenda referenced elsewhere in contract

Return ONLY valid JSON (no markdown fencing) with this structure:
{
  "summary": "1-2 sentence overall assessment",
  "findings": [
    {
      "section": "one of: Parties & Property, Purchase Price & Financing, Deposit & Escrow, Settlement & Dates, Contingencies & Addenda, Signatures & Initials, Disclosures & Compliance",
      "severity": "critical | warning | info",
      "title": "short title",
      "description": "detailed explanation",
      "pageRef": "Page X or null",
      "lineRef": "paragraph/line reference or null"
    }
  ],
  "metadata": {
    "formType": "detected form type",
    "buyerName": "if found",
    "sellerName": "if found",
    "propertyAddress": "if found",
    "purchasePrice": "if found",
    "settlementDate": "if found",
    "ratificationDate": "if found"
  }
}

Be thorough. For a blank/template contract, flag every blank required field. For a filled contract, validate all values.
Severity guide:
- critical: Missing signatures, math errors, missing essential terms that void enforceability
- warning: Missing initials, incomplete fields, timeline issues, missing addenda references
- info: Best practice suggestions, optional fields not filled`;

export async function analyzeContract(
  text: string,
  formType: string
): Promise<AnalysisPayload> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackAnalysis(text, formType);
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Form type detected: ${formType}\n\nContract text:\n\n${text.slice(0, 80000)}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: {
      summary: string;
      findings: RuleFinding[];
      metadata: Record<string, unknown>;
    };

    try {
      const cleaned = responseText
        .replace(/^```json?\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return fallbackAnalysis(text, formType);
    }

    const sections = buildSections(parsed.findings);

    return {
      summary: parsed.summary,
      findings: parsed.findings,
      sections,
      metadata: parsed.metadata || {},
      aiSource: "claude",
    };
  } catch (err) {
    console.error("Claude API error:", err);
    return fallbackAnalysis(text, formType);
  }
}

function buildSections(findings: RuleFinding[]): SectionStatus[] {
  return ANALYSIS_SECTIONS.map((section) => {
    const sectionFindings = findings.filter((f) => f.section === section);
    const hasCritical = sectionFindings.some((f) => f.severity === "critical");
    return {
      section,
      passed: !hasCritical,
      issueCount: sectionFindings.length,
    };
  });
}

function fallbackAnalysis(text: string, formType: string): AnalysisPayload {
  const findings: RuleFinding[] = [];
  const upper = text.toUpperCase();

  if (!text.match(/buyer[:\s]*\w{2,}/i)) {
    findings.push({
      section: "Parties & Property",
      severity: "critical",
      title: "Buyer name may be missing",
      description: "Could not detect a buyer name in the contract text. Ensure the buyer field is completed.",
      pageRef: "Page 1",
    });
  }
  if (!text.match(/seller[:\s]*\w{2,}/i)) {
    findings.push({
      section: "Parties & Property",
      severity: "critical",
      title: "Seller name may be missing",
      description: "Could not detect a seller name in the contract text. Ensure the seller field is completed.",
      pageRef: "Page 1",
    });
  }
  if (!text.match(/property\s+address|premises/i)) {
    findings.push({
      section: "Parties & Property",
      severity: "critical",
      title: "Property address may be missing",
      description: "No property address or premises description detected.",
      pageRef: "Page 1",
    });
  }
  if (!text.match(/purchase\s+price[:\s]*\$?([\d,]+)/i)) {
    findings.push({
      section: "Purchase Price & Financing",
      severity: "critical",
      title: "Purchase price not detected",
      description: "Could not find a purchase price value. This is a required field.",
    });
  }
  if (!text.match(/settlement\s+date|closing\s+date/i)) {
    findings.push({
      section: "Settlement & Dates",
      severity: "warning",
      title: "Settlement date not clearly specified",
      description: "Could not identify a settlement/closing date in the contract.",
    });
  }
  if (!text.match(/earnest\s+money|deposit|escrow/i)) {
    findings.push({
      section: "Deposit & Escrow",
      severity: "warning",
      title: "Deposit/escrow terms not detected",
      description: "Could not find earnest money deposit or escrow terms.",
    });
  }
  if (!upper.includes("SIGNATURE") && !upper.includes("SIGN BELOW")) {
    findings.push({
      section: "Signatures & Initials",
      severity: "warning",
      title: "Signature section not clearly identified",
      description: "Could not detect a clear signature section in the extracted text.",
    });
  }
  if (upper.includes("ADDEND") && !upper.includes("ATTACHED")) {
    findings.push({
      section: "Contingencies & Addenda",
      severity: "warning",
      title: "Addenda referenced but attachment unclear",
      description: "Contract references addenda but could not verify they are attached.",
    });
  }

  // MAR-specific checks
  if (formType === "MAR") {
    if (!upper.includes("TIME IS OF THE ESSENCE")) {
      findings.push({
        section: "Settlement & Dates",
        severity: "warning",
        title: "Time is of the Essence clause not detected",
        description: "MAR contracts should include a Time is of the Essence clause.",
        pageRef: "Page 1",
      });
    }
    if (!upper.includes("FINANCING CONTINGENCY") && !/\b9\.|\b10\.|\b11\./.test(upper)) {
      findings.push({
        section: "Purchase Price & Financing",
        severity: "critical",
        title: "Financing contingency paragraphs 9-11 may be incomplete",
        description: "Could not confirm financing contingency mechanics for MAR paragraphs 9-11.",
      });
    }
    if (!/AGRICULTURAL\s+ASSESSMENT|AGRICULTURAL\s+TRANSFER\s+TAX/i.test(upper)) {
      findings.push({
        section: "Disclosures & Compliance",
        severity: "warning",
        title: "Agricultural assessment/tax provision not detected",
        description: "Could not detect MAR agricultural assessment / transfer tax language.",
      });
    }
    if (!/FOREST\s+CONSERVATION/i.test(upper)) {
      findings.push({
        section: "Disclosures & Compliance",
        severity: "warning",
        title: "Forest Conservation Program provision not detected",
        description: "Could not detect MAR forest conservation disclosure/provision.",
      });
    }
    if (!/ADDENDA\s+CHECKLIST|CHECKLIST\s+OF\s+ADDENDA|SEPARATE\s+ADDENDA/i.test(upper)) {
      findings.push({
        section: "Contingencies & Addenda",
        severity: "warning",
        title: "MAR addenda checklist format not detected",
        description: "MAR typically uses a separate addenda checklist format.",
      });
    }
  }

  const sections = buildSections(findings);

  return {
    summary: `Fallback analysis completed for ${formType}. Found ${findings.length} potential issue(s). For full AI-powered analysis, configure ANTHROPIC_API_KEY.`,
    findings,
    sections,
    metadata: { formType, analysisMode: "fallback-regex" },
    aiSource: "fallback",
  };
}
