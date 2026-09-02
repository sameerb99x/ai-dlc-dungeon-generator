import { describe, expect, it } from "vitest";
import { dungeonsEqual } from "../../src/domain-foundation/index.js";
import { makeSampleResult, makeValidDungeon } from "./support/fixtures.js";

describe("dungeonsEqual", () => {
  it("returns true for identical results", () => {
    const left = makeSampleResult();
    const right = makeSampleResult();
    expect(dungeonsEqual(left, right)).toBe(true);
  });

  it("returns false when layout differs", () => {
    const left = makeSampleResult();
    const right = makeSampleResult(makeValidDungeon(6, 6));
    expect(dungeonsEqual(left, right)).toBe(false);
  });

  it("returns false when validation report differs", () => {
    const left = makeSampleResult();
    const right = {
      ...makeSampleResult(),
      report: {
        status: "failed" as const,
        ruleResults: [{ ruleId: "connectivity", passed: false, message: "Disconnected" }],
      },
    };
    expect(dungeonsEqual(left, right)).toBe(false);
  });

  it("returns false when version metadata differs", () => {
    const left = makeSampleResult();
    const right = {
      ...makeSampleResult(),
      versions: {
        applicationVersion: "9.9.9",
        generatorVersion: "1.0.0",
        formatVersion: "1",
      },
    };
    expect(dungeonsEqual(left, right)).toBe(false);
  });
});

describe("dungeonsEqual laws", () => {
  const sample = makeSampleResult();

  it("is reflexive", () => {
    expect(dungeonsEqual(sample, sample)).toBe(true);
  });

  it("is symmetric", () => {
    const other = makeSampleResult();
    expect(dungeonsEqual(sample, other)).toBe(dungeonsEqual(other, sample));
  });

  it("is transitive for equal copies", () => {
    const a = makeSampleResult();
    const b = makeSampleResult();
    const c = makeSampleResult();
    expect(dungeonsEqual(a, b)).toBe(true);
    expect(dungeonsEqual(b, c)).toBe(true);
    expect(dungeonsEqual(a, c)).toBe(true);
  });
});
