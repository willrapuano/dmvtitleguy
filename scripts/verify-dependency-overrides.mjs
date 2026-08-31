import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { typeid } from "typeid-js";

const expectedVersions = {
  "deepmerge-ts": "8.0.2",
  dompurify: "3.4.14",
  nanoid: "3.3.18",
};

for (const [dependency, expected] of Object.entries(expectedVersions)) {
  const packageJson = JSON.parse(
    await readFile(new URL(`../node_modules/${dependency}/package.json`, import.meta.url), "utf8")
  );
  const actual = packageJson.version;
  assert.equal(actual, expected, `${dependency} override resolved to ${actual}, expected ${expected}`);
}

const generated = Array.from({ length: 10 }, () => String(typeid("test")));

assert.equal(new Set(generated).size, generated.length, "TypeID override generated duplicate identifiers");
for (const value of generated) {
  assert.match(value, /^test_[0-9a-z]{26}$/, `unexpected TypeID output: ${value}`);
}

console.log(
  `Dependency override smoke passed: ${generated.length} unique TypeIDs and ${Object.keys(expectedVersions).length} security overrides verified`
);
