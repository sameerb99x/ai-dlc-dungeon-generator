import { describe, expect, it } from "vitest";
import { createCoordinate } from "../../src/domain-foundation/index.js";

describe("createCoordinate", () => {
  it("accepts integer coordinates", () => {
    const result = createCoordinate(0, 0);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ x: 0, y: 0 });
    }
  });

  it("rejects non-integer components", () => {
    const result = createCoordinate(1.5, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("coordinate.invalid");
    }
  });
});
