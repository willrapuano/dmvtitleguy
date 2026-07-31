import { NextRequest } from "next/server";
import { handleProtectedFunnelLead, leadRequiredText, leadText } from "@/lib/protected-lead-route";

export async function POST(request: NextRequest) {
  return handleProtectedFunnelLead(request, "investor-due-diligence", (body) => ({
    phone: leadRequiredText(body.phone, "Phone", 60),
    propertyAddress: leadRequiredText(body.propertyAddress, "Property address", 240),
    buyerType: leadText(body.buyerType, 60),
    acquisitionSource: leadText(body.source, 80),
    timeframe: leadText(body.timeframe, 80),
    notes: leadText(body.notes, 2_000),
  }));
}
