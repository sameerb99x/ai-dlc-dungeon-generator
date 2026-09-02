import type {
  Corridor,
  Coordinate,
  Dungeon,
  DungeonCandidate,
  DungeonResult,
  EffectiveGenerationRequest,
  Room,
  Tile,
  ValidationReport,
  VersionMetadata,
} from "../../../src/domain-foundation/index.js";
import { createDungeon } from "../../../src/domain-foundation/index.js";

export function makeTile(
  terrain: Tile["terrain"] = "walkable",
  marker: Tile["marker"] = "none",
): { terrain: Tile["terrain"]; marker: Tile["marker"] } {
  return { terrain, marker };
}

type MutableTile = { terrain: Tile["terrain"]; marker: Tile["marker"] };
export type MutableGrid = MutableTile[][];

export function makeGrid(
  width: number,
  height: number,
  fill: Tile = makeTile(),
): MutableGrid {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ terrain: fill.terrain, marker: fill.marker })),
  );
}

export function withMarkers(
  grid: MutableGrid,
  entrance: Coordinate,
  exit: Coordinate,
): MutableGrid {
  const copy = grid.map((row) =>
    row.map((tile) => ({ terrain: tile.terrain, marker: tile.marker })),
  );
  const entranceRow = copy[entrance.y];
  const exitRow = copy[exit.y];
  if (entranceRow?.[entrance.x]) {
    entranceRow[entrance.x] = { terrain: "walkable", marker: "entrance" };
  }
  if (exitRow?.[exit.x]) {
    exitRow[exit.x] = { terrain: "walkable", marker: "exit" };
  }
  return copy;
}

export function makeValidCandidate(
  width = 5,
  height = 5,
  entrance = { x: 0, y: 0 },
  exit = { x: 4, y: 4 },
): DungeonCandidate {
  const tiles = withMarkers(makeGrid(width, height, makeTile("blocked")), entrance, exit);
  tiles[entrance.y]![entrance.x]!.terrain = "walkable";
  tiles[exit.y]![exit.x]!.terrain = "walkable";

  return {
    dimensions: { width, height },
    tiles,
    rooms: [{ x: 0, y: 0, width: 2, height: 2 }],
    corridors: [
      {
        path: [
          { x: 0, y: 0 },
          { x: 4, y: 4 },
        ],
      },
    ],
    entrance,
    exit,
  };
}

export function makeValidDungeon(width = 5, height = 5): Dungeon {
  const result = createDungeon(makeValidCandidate(width, height));
  if (!result.ok) {
    throw new Error("Expected valid dungeon fixture");
  }
  return result.value;
}

export function makeSampleRequest(): EffectiveGenerationRequest {
  return {
    settings: {
      dimensions: { width: 5, height: 5 },
      seedInput: "test-seed",
      constraints: {
        minPathLength: 5,
        minRoomWidth: 3,
        minRoomHeight: 3,
        maxRoomWidth: 12,
        maxRoomHeight: 12,
        corridorWidth: 1,
        maxDeadEnds: 10,
      },
    },
    resolvedSeed: "resolved-test-seed",
    generatorId: "default",
    generatorVersion: "1.0.0",
  };
}

export function makeSampleReport(): ValidationReport {
  return {
    status: "passed",
    ruleResults: [{ ruleId: "connectivity", passed: true, message: "Connected" }],
  };
}

export function makeSampleVersions(): VersionMetadata {
  return {
    applicationVersion: "0.1.0",
    generatorVersion: "1.0.0",
    formatVersion: "1",
  };
}

export function makeSampleResult(dungeon = makeValidDungeon()): DungeonResult {
  return {
    dungeon,
    request: makeSampleRequest(),
    report: makeSampleReport(),
    versions: makeSampleVersions(),
  };
}

export function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    ...overrides,
  };
}

export function makeCorridor(path: Corridor["path"]): Corridor {
  return { path };
}
