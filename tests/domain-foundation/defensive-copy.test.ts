import { describe, expect, it } from "vitest";
import { createDungeon, type Tile, type Room, type Corridor } from "../../src/domain-foundation/index.js";
import { makeValidCandidate } from "./support/fixtures.js";

describe("defensive-copy isolation", () => {
  it("does not reflect later mutations to source tile grids", () => {
    const candidate = makeValidCandidate();
    const sourceTiles = candidate.tiles.map((row: readonly Tile[]) =>
      row.map((tile: Tile) => ({ ...tile })),
    );
    const mutableCandidate = {
      ...candidate,
      tiles: sourceTiles,
      rooms: candidate.rooms.map((room: Room) => ({ ...room })),
      corridors: candidate.corridors.map((corridor: Corridor) => ({
        path: corridor.path.map((point) => ({ ...point })),
      })),
    };

    const result = createDungeon(mutableCandidate);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    sourceTiles[0]![0]!.terrain = "blocked";
    sourceTiles[0]![0]!.marker = "none";

    expect(result.value.tiles[0]![0]).toEqual({
      terrain: "walkable",
      marker: "entrance",
    });
  });
});
