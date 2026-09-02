import { describe, expect, it } from "vitest";
import { createDungeon, type Tile } from "../../src/domain-foundation/index.js";
import {
  makeCorridor,
  makeRoom,
  makeTile,
  makeValidCandidate,
} from "./support/fixtures.js";

describe("createDungeon", () => {
  it("accepts a valid candidate", () => {
    const result = createDungeon(makeValidCandidate());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dimensions).toEqual({ width: 5, height: 5 });
      expect(result.value.entrance).toEqual({ x: 0, y: 0 });
    }
  });

  it("rejects a mismatched grid shape", () => {
    const candidate = makeValidCandidate();
    const result = createDungeon({
      ...candidate,
      tiles: candidate.tiles.slice(0, 2),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "grid.shape.invalid")).toBe(true);
    }
  });

  it("rejects blocked entrance markers", () => {
    const candidate = makeValidCandidate();
    const tiles = candidate.tiles.map((row: readonly Tile[]) =>
      row.map((tile: Tile) => ({ ...tile })),
    );
    tiles[0]![0] = { terrain: "blocked", marker: "entrance" };

    const result = createDungeon({ ...candidate, tiles });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "marker.terrain.invalid")).toBe(true);
    }
  });

  it("rejects overlapping entrance and exit", () => {
    const candidate = makeValidCandidate(4, 4, { x: 1, y: 1 }, { x: 1, y: 1 });
    const result = createDungeon(candidate);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "marker.overlap.invalid")).toBe(true);
    }
  });

  it("rejects out-of-bounds room geometry", () => {
    const candidate = makeValidCandidate();
    const result = createDungeon({
      ...candidate,
      rooms: [makeRoom({ x: 4, y: 4, width: 3, height: 3 })],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "geometry.invalid")).toBe(true);
    }
  });

  it("rejects corridor paths with fewer than two points", () => {
    const candidate = makeValidCandidate();
    const result = createDungeon({
      ...candidate,
      corridors: [makeCorridor([{ x: 0, y: 0 }])],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "geometry.invalid")).toBe(true);
    }
  });

  it("rejects invalid tile values", () => {
    const candidate = makeValidCandidate();
    const tiles = candidate.tiles.map((row: readonly Tile[]) =>
      row.map((tile: Tile) => ({ ...tile })),
    );
    tiles[1]![1] = makeTile("walkable", "none");
    (tiles[1]![1] as { terrain: string }).terrain = "lava";

    const result = createDungeon({ ...candidate, tiles });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((d) => d.code === "tile.invalid")).toBe(true);
    }
  });
});
