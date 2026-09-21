import Link from "next/link";

interface LeadRoutingNoticeProps {
  kind?: "transaction" | "advertising" | "newsletter";
}

export function LeadRoutingNotice({ kind = "transaction" }: LeadRoutingNoticeProps) {
  const message =
    kind === "newsletter"
      ? "By subscribing, you ask DMV Title Guy to email these updates. This does not enroll you in Pruitt Title marketing, and you may unsubscribe at any time."
      : kind === "advertising"
        ? "This request is sent to Will for review. It does not create a Pruitt Title service relationship or require a transaction referral."
        : "Your request is sent to Will and may be shared with Pruitt Title to review and respond. Submission does not mean Pruitt has accepted the transaction.";

  return (
    <p className="text-center text-xs leading-relaxed text-slate-500">
      {message}{" "}
      <Link href="/privacy-policy" className="font-medium text-brand-blue-deep underline underline-offset-2">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
