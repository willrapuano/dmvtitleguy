import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, approved } = await req.json();
  if (!userId || typeof approved !== "boolean") {
    return NextResponse.json({ error: "userId and approved required" }, { status: 400 });
  }

  // Prevent revoking own admin access
  if (userId === admin.id && !approved) {
    return NextResponse.json({ error: "Cannot revoke your own access" }, { status: 400 });
  }

  await prisma.toolUser.update({
    where: { id: userId },
    data: { approved },
  });

  return NextResponse.json({ ok: true });
}
