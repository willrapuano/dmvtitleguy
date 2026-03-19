import { NextRequest, NextResponse } from "next/server";
import { verifyLoginCode } from "@/lib/contract-analyzer/auth";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code required" }, { status: 400 });
  }

  const user = await verifyLoginCode(email, code);
  if (!user) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, email: user.email });
}
