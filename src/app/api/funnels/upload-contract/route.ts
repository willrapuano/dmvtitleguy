import { NextRequest } from "next/server";
import { handleProtectedFunnelLead, leadRequiredText, leadText } from "@/lib/protected-lead-route";

export async function POST(request: NextRequest) {
  return handleProtectedFunnelLead(request, "upload-contract", (body) => ({
    phone: leadRequiredText(body.phone, "Phone", 60),
    transactionType: leadText(body.transactionType, 80),
    closingTimeline: leadText(body.closingTimeline, 120),
    notes: leadText(body.notes, 2_000),
    secureDocumentFollowUpRequired: true,
  }));
}
