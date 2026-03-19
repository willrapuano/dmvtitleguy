import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, randomInt } from "crypto";
import { addMinutes, addDays, isAfter } from "date-fns";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "ca_session";

// Admin emails are auto-approved on registration
const ADMIN_EMAILS = [
  "willrapuano@gmail.com",
  "wrapuano@pruitt-title.com",
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export async function createLoginCode(email: string) {
  const normalized = email.trim().toLowerCase();
  const code = String(randomInt(100000, 999999));
  const expiresAt = addMinutes(new Date(), 10);

  await prisma.loginCode.create({ data: { email: normalized, code, expiresAt } });
  return { code, expiresAt };
}

export async function verifyLoginCode(email: string, code: string) {
  const normalized = email.trim().toLowerCase();
  const rec = await prisma.loginCode.findFirst({
    where: { email: normalized, code: code.trim(), usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!rec || isAfter(new Date(), rec.expiresAt)) return null;

  const admin = isAdminEmail(normalized);
  const user =
    (await prisma.toolUser.findUnique({ where: { email: normalized } })) ||
    (await prisma.toolUser.create({
      data: {
        email: normalized,
        approved: admin,
        isAdmin: admin,
      },
    }));

  // If existing user becomes admin (e.g., email added to list later)
  if (admin && (!user.approved || !user.isAdmin)) {
    await prisma.toolUser.update({
      where: { id: user.id },
      data: { approved: true, isAdmin: true },
    });
    user.approved = true;
    user.isAdmin = true;
  }

  await prisma.loginCode.update({ where: { id: rec.id }, data: { usedAt: new Date(), userId: user.id } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = addDays(new Date(), 7);
  await prisma.toolSession.create({ data: { token, userId: user.id, expiresAt } });

  const jar = cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return user;
}

export async function getCurrentUser() {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.toolSession.findUnique({ where: { token }, include: { user: true } });
  if (!session || isAfter(new Date(), session.expiresAt)) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/agent-tools/contract-analyzer/login");
  return user;
}

export async function requireApprovedUser() {
  const user = await requireUser();
  if (!user.approved) redirect("/agent-tools/contract-analyzer/pending");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/agent-tools/contract-analyzer");
  return user;
}
