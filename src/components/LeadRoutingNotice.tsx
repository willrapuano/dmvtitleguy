import Link from "next/link";

interface LeadRoutingNoticeProps {
  kind?: "transaction" | "advertising" | "newsletter";
}

export function LeadRoutingNotice({ kind = "transaction" }: LeadRoutingNoticeProps) {
  const message =
    kind === "newsletter"
      ? "By subscribing, you ask DMV Title Guy to email these updates. This does not enroll you in Pruitt Title marketing, and you may unsubscribe at any time."
      : kind === "advertising"
        ? "This request goes to Will. Advertising is not tied to sending any closings to Pruitt Title."
        : "Your request goes to Will and the Pruitt Title team. Sending it doesn't open an order; Will confirms next steps with you.";

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
