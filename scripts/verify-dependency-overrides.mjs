import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import uri from "fast-uri";
import { typeid } from "typeid-js";

const expectedVersions = {
  "deepmerge-ts": "8.0.2",
  dompurify: "3.4.14",
  "fast-uri": "3.1.7",
  nanoid: "3.3.18",
};

for (const [dependency, expected] of Object.entries(expectedVersions)) {
  const packageJson = JSON.parse(
    await readFile(new URL(`../node_modules/${dependency}/package.json`, import.meta.url), "utf8")
  );
  const actual = packageJson.version;
  assert.equal(actual, expected, `${dependency} override resolved to ${actual}, expected ${expected}`);
}

// Check every locked copy, including nested copies that root-only checks miss.
const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
for (const [dependency, expected] of Object.entries({ "fast-uri": "3.1.7", mysql2: "3.24.3" })) {
  const copies = Object.entries(lock.packages).filter(([path]) =>
    path === `node_modules/${dependency}` || path.endsWith(`/node_modules/${dependency}`)
  );
  assert.ok(copies.length > 0, `missing locked ${dependency}`);
  for (const [path, entry] of copies) {
    assert.equal(entry.version, expected, `${path} is not the reviewed security version`);
    const installed = JSON.parse(await readFile(new URL(`../${path}/package.json`, import.meta.url), "utf8"));
    assert.equal(installed.version, expected, `${path} install disagrees with the reviewed lockfile`);
  }
}

assert.equal(uri.resolve("https://example.test/a/b", "../c"), "https://example.test/c");
assert.ok(uri.parse("http://[::not-valid]/private").error, "malformed IPv6 must not normalize to a valid host");

// Exercise Prisma's actual transitive driver without opening a database connection.
const prismaRequire = createRequire(new URL("../node_modules/prisma/package.json", import.meta.url));
assert.equal(prismaRequire("mysql2/package.json").version, "3.24.3");
const mysql = prismaRequire("mysql2");
assert.equal(mysql.format("SELECT ? AS value", ["O'Reilly"]), "SELECT 'O\\'Reilly' AS value");

const generated = Array.from({ length: 10 }, () => String(typeid("test")));

assert.equal(new Set(generated).size, generated.length, "TypeID override generated duplicate identifiers");
for (const value of generated) {
  assert.match(value, /^test_[0-9a-z]{26}$/, `unexpected TypeID output: ${value}`);
}

console.log(
  `Dependency override smoke passed: ${generated.length} unique TypeIDs, ${Object.keys(expectedVersions).length} root security overrides, all fast-uri/mysql2 copies, URI parsing, and Prisma driver formatting verified`
);
