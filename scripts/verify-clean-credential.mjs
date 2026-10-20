// Guards src/lib/prisma.ts cleanCredential: CLI chatter pasted ahead of a token
// (the Aug-Oct 2026 outage of every form) must be stripped, clean tokens untouched.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/lib/prisma.ts", "utf8");
assert.match(source, /const authToken = cleanCredential\(process\.env\.TURSO_AUTH_TOKEN\)/, "prisma.ts must clean TURSO_AUTH_TOKEN");
const body = source.match(/export function cleanCredential[\s\S]*?\n}\n/)[0]
  .replace("export function", "function")
  .replace(/\(value: string \| undefined\): string \| undefined/, "(value)");
const cleanCredential = new Function(`${body}; return cleanCredential;`)();

assert.equal(cleanCredential("Loaded env from /Volumes/x/.env.local\neyJabc.def.ghi"), "eyJabc.def.ghi");
assert.equal(cleanCredential("  eyJabc.def.ghi \n"), "eyJabc.def.ghi");
assert.equal(cleanCredential("eyJabc.def.ghi"), "eyJabc.def.ghi");
assert.equal(cleanCredential(""), undefined);
assert.equal(cleanCredential(undefined), undefined);
console.log("Credential cleaning verified: pasted CLI output is stripped from TURSO_AUTH_TOKEN");
