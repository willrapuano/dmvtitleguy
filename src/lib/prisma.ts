import { PrismaClient } from "@/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * A credential pasted from a terminal can carry tool chatter ahead of it. From
 * 2026-08-31 to 2026-10-19 production's TURSO_AUTH_TOKEN began with dotenv's
 * "Loaded env from <path>" line, every Bearer header was invalid, and every site
 * form returned 503. Tokens contain no whitespace, so the last whitespace-separated
 * word is the token.
 */
export function cleanCredential(value: string | undefined): string | undefined {
  const words = value?.trim().split(/\s+/).filter(Boolean);
  return words?.length ? words[words.length - 1] : undefined;
}

function makePrisma() {
  const url = cleanCredential(process.env.TURSO_DATABASE_URL) || cleanCredential(process.env.DATABASE_URL) || "file:dev.db";
  const authToken = cleanCredential(process.env.TURSO_AUTH_TOKEN);

  const adapter = new PrismaLibSql({
    url,
    ...(authToken ? { authToken } : {}),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
