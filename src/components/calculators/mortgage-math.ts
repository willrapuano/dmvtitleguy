/** Monthly principal-and-interest payment for a fully amortizing loan. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = years * 12;
  const i = annualRatePct / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  if (i === 0) return principal / n;
  return (principal * i) / (1 - (1 + i) ** -n);
}

/** Remaining balance after `months` payments. */
export function balanceAfter(principal: number, annualRatePct: number, years: number, months: number) {
  const i = annualRatePct / 100 / 12;
  const payment = monthlyPayment(principal, annualRatePct, years);
  if (principal <= 0) return 0;
  if (i === 0) return Math.max(0, principal - payment * months);
  return Math.max(0, principal * (1 + i) ** months - (payment * ((1 + i) ** months - 1)) / i);
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** Parses a form field; blank or invalid input counts as 0. */
export function num(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}
