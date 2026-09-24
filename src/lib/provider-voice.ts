const FIRST_PERSON_PROVIDER_ACTION =
  /\bwe (issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support|close|hold|disburse|prepare|record|clear|process|order|verify|explain|work with|make sure)\b/gi;

const THIRD_PERSON_PROVIDER_ACTIONS: Record<string, string> = {
  issues: "issue",
  handles: "handle",
  provides: "provide",
  serves: "serve",
  coordinates: "coordinate",
  conducts: "conduct",
  reviews: "review",
  opens: "open",
  begins: "begin",
  delivers: "deliver",
  turns: "turn",
  ensures: "ensure",
  supports: "support",
  closes: "close",
  holds: "hold",
  disburses: "disburse",
  prepares: "prepare",
  records: "record",
  clears: "clear",
  processes: "process",
  orders: "order",
  verifies: "verify",
  explains: "explain",
};

const TEAM_PROVIDER_ACTION = new RegExp(
  `\\bour (?:team|settlement team|closing team|title team) (${Object.keys(THIRD_PERSON_PROVIDER_ACTIONS).join("|")})\\b`,
  "gi",
);

function preserveSentenceCase(match: string, replacement: string): string {
  return /^[A-Z]/.test(match)
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement;
}

/**
 * Legacy articles were written in a first-person "we" voice. DMV Title Guy is
 * Will Rapuano's personal brand, not a company, so "we handle…" is rewritten to
 * name who actually does the work: Will and the Pruitt Title team. (An earlier
 * version rewrote it to "a selected title provider may…", which wrongly framed
 * Will as referring clients elsewhere; he closes them through Pruitt Title.)
 *
 * Third-person references to Pruitt Title are left intact.
 */
export function normalizeIndependentProviderVoice(input: string): string {
  return input
    .replace(
      /\b(?:at\s+)?(?:Pruitt Title(?: LLC)?|DMV Title Guy),?\s+we\s+(?=(?:issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support|close|hold|disburse|prepare|record|clear|process|order|verify|explain|work with|make sure)\b)/gi,
      (match) => preserveSentenceCase(match, "Will and the Pruitt Title team "),
    )
    .replace(FIRST_PERSON_PROVIDER_ACTION, (match, action: string) => {
      return preserveSentenceCase(match, `Will and the Pruitt Title team ${action.toLowerCase()}`);
    })
    .replace(TEAM_PROVIDER_ACTION, (match, action: string) => {
      return preserveSentenceCase(match, `the Pruitt Title team ${action.toLowerCase()}`);
    });
}

/** Clone and normalize nested Portable Text values without mutating CMS data. */
export function normalizeIndependentProviderValue<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeIndependentProviderVoice(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeIndependentProviderValue(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        normalizeIndependentProviderValue(item),
      ]),
    ) as T;
  }
  return value;
}
