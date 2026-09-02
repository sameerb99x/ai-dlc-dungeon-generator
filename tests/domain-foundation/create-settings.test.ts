import { describe, expect, it } from "vitest";
import { createSettings } from "../../src/domain-foundation/index.js";

describe("createSettings", () => {
  it("creates settings with defaults for optional constraints", () => {
    const result = createSettings({ width: 10, height: 8 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dimensions).toEqual({ width: 10, height: 8 });
      expect(result.value.constraints.minPathLength).toBe(5);
    }
  });

  it("rejects non-positive dimensions", () => {
    const result = createSettings({ width: 0, height: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "dimension.invalid")).toBe(true);
    }
  });

  it("rejects inconsistent room size bounds", () => {
    const result = createSettings({
      width: 10,
      height: 10,
      minRoomWidth: 8,
      maxRoomWidth: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "settings.invalid")).toBe(true);
    }
  });
});
