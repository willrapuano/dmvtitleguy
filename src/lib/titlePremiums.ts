/**
 * Title insurance premiums as Pruitt Title's own quote calculator prices them
 * (https://pruitt-title.titlecapture.com/title-quote, the source of TITLECAPTURE_QUOTE_URL).
 * That calculator writes First American Title Insurance Company policies: an Eagle
 * owner's policy plus a simultaneously issued Eagle loan policy.
 *
 * The schedules below were read from that calculator on 2026-10-26 by sampling
 * every $10,000 from $10,000 to $1.5 million, every $50,000 from $1.55 million to
 * $5 million, and off-grid prices. Each schedule reproduces every sample exactly:
 * the price is rounded up to the next $1,000, each band's rate applies to the
 * thousands inside that band, the total is rounded up to the next dollar, and the
 * state minimum applies. scripts/verify-title-premiums.mjs holds the samples.
 *
 * Pruitt's quote page shows the same two premiums the way a Loan Estimate must
 * (CFPB TRID): the lender's policy at its full stand-alone rate and the owner's
 * policy reduced by the difference. The total is identical; the calculator on
 * this site shows the premiums actually charged for each policy.
 */

export type PremiumState = "VA" | "MD" | "DC";

interface PremiumBand {
  /** Upper bound of the band in dollars of coverage (inclusive). */
  upTo: number;
  /** Charge per $1,000 of coverage inside the band, in cents. */
  centsPerThousand: number;
}

interface PremiumSchedule {
  minimumOwnersPremium: number;
  bands: PremiumBand[];
  /** Flat charge for the lender's policy issued with the owner's policy. */
  simultaneousLendersPremium: number;
}

export const PRUITT_TITLE_PREMIUM_SCHEDULES: Record<PremiumState, PremiumSchedule> = {
  VA: {
    minimumOwnersPremium: 300,
    bands: [
      { upTo: 250_000, centsPerThousand: 517 },
      { upTo: 500_000, centsPerThousand: 490 },
      { upTo: 1_000_000, centsPerThousand: 450 },
      { upTo: 2_000_000, centsPerThousand: 297 },
      { upTo: 5_000_000, centsPerThousand: 265 },
    ],
    simultaneousLendersPremium: 200,
  },
  MD: {
    minimumOwnersPremium: 300,
    bands: [
      { upTo: 250_000, centsPerThousand: 646 },
      { upTo: 500_000, centsPerThousand: 551 },
      { upTo: 1_000_000, centsPerThousand: 473 },
      { upTo: 5_000_000, centsPerThousand: 373 },
    ],
    simultaneousLendersPremium: 275,
  },
  DC: {
    minimumOwnersPremium: 342,
    bands: [
      { upTo: 250_000, centsPerThousand: 684 },
      { upTo: 500_000, centsPerThousand: 612 },
      { upTo: 1_000_000, centsPerThousand: 540 },
      { upTo: 5_000_000, centsPerThousand: 468 },
    ],
    simultaneousLendersPremium: 150,
  },
};

export const TITLE_PREMIUM_SOURCE_NOTE =
  "Title insurance uses Pruitt Title's rates: a First American Eagle owner's policy and the lender's policy issued with it, before reissue or other discounts.";

/** Owner's policy premium on a purchase at `price`. */
export function ownersTitlePremium(state: PremiumState, price: number): number {
  const schedule = PRUITT_TITLE_PREMIUM_SCHEDULES[state];
  const coverage = Math.ceil(Math.max(0, price) / 1000) * 1000;
  let cents = 0;
  let previousLimit = 0;
  for (const band of schedule.bands) {
    if (coverage <= previousLimit) break;
    const thousandsInBand = (Math.min(coverage, band.upTo) - previousLimit) / 1000;
    cents += thousandsInBand * band.centsPerThousand;
    previousLimit = band.upTo;
  }
  return Math.max(schedule.minimumOwnersPremium, Math.ceil(cents / 100));
}

/** Lender's policy premium when issued with the owner's policy; none on a cash purchase. */
export function simultaneousLendersTitlePremium(state: PremiumState, loanAmount: number): number {
  return loanAmount > 0 ? PRUITT_TITLE_PREMIUM_SCHEDULES[state].simultaneousLendersPremium : 0;
}
