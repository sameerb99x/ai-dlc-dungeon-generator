import { describe, expect, it } from "vitest";
import { createRandomSource } from "../../src/deterministic-random-and-settings/index.js";

describe("RandomSource", () => {
  it("replays a sequence for the same seed", () => { const left = createRandomSource("seed"); const right = createRandomSource("seed"); expect([left.nextUnit(), left.nextUnit(), left.nextInteger(2, 5)]).toEqual([right.nextUnit(), right.nextUnit(), right.nextInteger(2, 5)]); });
  it("bounds integer values and rejects invalid ranges", () => { const source = createRandomSource("bounds"); for (let i = 0; i < 100; i += 1) { const value = source.nextInteger(-2, 3); expect(value.ok && value.value >= -2 && value.value <= 3).toBe(true); } expect(source.nextInteger(3, 2)).toMatchObject({ ok: false, error: { code: "random.range.invalid" } }); });
  it("does not mutate shuffled input and rejects empty choices", () => { const source = createRandomSource("shuffle"); const input = [1, 2, 3, 4]; expect([...source.shuffle(input)].sort()).toEqual(input); expect(input).toEqual([1, 2, 3, 4]); expect(source.choose([])).toMatchObject({ ok: false, error: { code: "random.choice.empty" } }); });
});
