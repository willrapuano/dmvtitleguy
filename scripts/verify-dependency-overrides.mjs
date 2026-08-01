import assert from "node:assert/strict";
import { typeid } from "typeid-js";

const generated = Array.from({ length: 10 }, () => String(typeid("test")));

assert.equal(new Set(generated).size, generated.length, "TypeID override generated duplicate identifiers");
for (const value of generated) {
  assert.match(value, /^test_[0-9a-z]{26}$/, `unexpected TypeID output: ${value}`);
}

console.log(`Dependency override smoke passed: ${generated.length} unique TypeIDs generated`);
