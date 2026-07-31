import { NextRequest } from "next/server";
import { handleProtectedFunnelLead, leadRequiredText, leadText } from "@/lib/protected-lead-route";

export async function POST(request: NextRequest) {
  return handleProtectedFunnelLead(request, "request-title-review", (body) => ({
    phone: leadRequiredText(body.phone, "Phone", 60),
    propertyAddress: leadRequiredText(body.propertyAddress, "Property address", 240),
    reviewType: leadText(body.reviewType, 80),
    urgency: leadText(body.urgency, 60),
    message: leadText(body.message, 2_000),
  }));
}
