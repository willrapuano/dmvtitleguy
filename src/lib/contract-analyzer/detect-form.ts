/**
 * Detect whether a PDF is NVAR K1321, GCAAR 1301, or MAR based on extracted text.
 */
export function detectFormType(text: string): { formType: string; confidence: number } {
  const upper = text.toUpperCase();

  const nvarSignals = [
    "K1321",
    "NVAR",
    "NORTHERN VIRGINIA ASSOCIATION OF REALTORS",
    "RESIDENTIAL SALES CONTRACT",
    "NORTHERN VIRGINIA",
  ];

  const gcaarSignals = [
    "1301",
    "GCAAR",
    "GREATER CAPITAL AREA ASSOCIATION OF REALTORS",
    "REGIONAL SALES CONTRACT",
    "GREATER CAPITAL",
  ];

  const marSignals = [
    "MARYLAND RESIDENTIAL CONTRACT OF SALE",
    "THIS FORM IS DESIGNED AND INTENDED FOR THE SALE AND PURCHASE OF IMPROVED SINGLE FAMILY RESIDENTIAL REAL ESTATE LOCATED IN MARYLAND ONLY",
    "LOCATED IN MARYLAND ONLY",
    "AGRICULTURAL ASSESSMENT",
    "FOREST CONSERVATION",
  ];

  let nvarScore = 0;
  let gcaarScore = 0;
  let marScore = 0;

  for (const sig of nvarSignals) if (upper.includes(sig)) nvarScore++;
  for (const sig of gcaarSignals) if (upper.includes(sig)) gcaarScore++;
  for (const sig of marSignals) if (upper.includes(sig)) marScore++;

  const hasMarylandAnchor =
    upper.includes("MARYLAND") || upper.includes("MARYLAND RESIDENTIAL CONTRACT OF SALE");

  if (hasMarylandAnchor && marScore >= 2 && marScore >= nvarScore && marScore >= gcaarScore) {
    return { formType: "MAR", confidence: Math.min(marScore / marSignals.length, 1) };
  }
  if (nvarScore > gcaarScore && nvarScore >= 2) {
    return { formType: "NVAR K1321", confidence: Math.min(nvarScore / nvarSignals.length, 1) };
  }
  if (gcaarScore >= nvarScore && gcaarScore >= 2) {
    return { formType: "GCAAR 1301", confidence: Math.min(gcaarScore / gcaarSignals.length, 1) };
  }
  if (hasMarylandAnchor && marScore > 0) return { formType: "MAR", confidence: 0.4 };
  if (nvarScore > 0) return { formType: "NVAR K1321", confidence: 0.4 };
  if (gcaarScore > 0) return { formType: "GCAAR 1301", confidence: 0.4 };

  return { formType: "UNKNOWN", confidence: 0 };
}
