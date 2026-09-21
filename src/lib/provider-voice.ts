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
  ensures: "help ensure",
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
 * Legacy articles were originally written in a title provider's first-person
 * voice. DMV Title Guy is an independent education and business-development
 * site, so rendered copy must not imply that the site itself performs a title
 * provider's regulated or operational work.
 *
 * This deliberately leaves third-person, factual references to Pruitt Title
 * intact. Those references are separately governed by the visible disclosure
 * and the provider-truth release gate.
 */
export function normalizeIndependentProviderVoice(input: string): string {
  return input
    .replace(
      /\b(?:at\s+)?(?:Pruitt Title(?: LLC)?|DMV Title Guy),?\s+we\s+(?=(?:issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support|close|hold|disburse|prepare|record|clear|process|order|verify|explain|work with|make sure)\b)/gi,
      (match) => preserveSentenceCase(match, "a selected title provider may "),
    )
    .replace(FIRST_PERSON_PROVIDER_ACTION, (match, action: string) => {
      const normalizedAction = action.toLowerCase() === "ensure" ? "help ensure" : action.toLowerCase();
      return preserveSentenceCase(match, `a selected title provider may ${normalizedAction}`);
    })
    .replace(TEAM_PROVIDER_ACTION, (match, action: string) => {
      const normalizedAction = THIRD_PERSON_PROVIDER_ACTIONS[action.toLowerCase()] ?? action.toLowerCase();
      return preserveSentenceCase(match, `a selected title provider may ${normalizedAction}`);
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
