import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRandomSource } from "../../src/deterministic-random-and-settings/index.js";
import { PBT_FIXED_SEED } from "../domain-foundation/support/pbt-seed.js";
import { integerListArbitrary, integerRangeArbitrary, seedArbitrary } from "./support/generators.js";
describe("U2 properties", () => {
  it("keeps bounded integers in range", () => { fc.assert(fc.property(seedArbitrary, integerRangeArbitrary, (seed, range) => { const result = createRandomSource(seed).nextInteger(range.min, range.min + range.span); return result.ok && result.value >= range.min && result.value <= range.min + range.span; }), { seed: PBT_FIXED_SEED }); });
  it("preserves shuffled elements without mutating input", () => { fc.assert(fc.property(seedArbitrary, integerListArbitrary, (seed, values) => { const original = [...values]; const shuffled = createRandomSource(seed).shuffle(values); return values.every((value, index) => value === original[index]) && [...shuffled].sort((a, b) => a - b).every((value, index) => value === [...original].sort((a, b) => a - b)[index]); }), { seed: PBT_FIXED_SEED }); });
});
