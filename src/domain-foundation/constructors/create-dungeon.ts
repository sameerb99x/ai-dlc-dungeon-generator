import {
  copyCorridors,
  copyRooms,
  copyTileGrid,
} from "../internal/defensive-copy.js";
import {
  dimensionInvalidForDomain,
  geometryInvalid,
  gridShapeInvalid,
  markerCountInvalid,
  markerOverlapInvalid,
  markerTerrainInvalid,
  tileInvalid,
} from "../internal/diagnostics.js";
import type { Coordinate } from "../types/coordinate.js";
import type { DomainDiagnostic } from "../types/diagnostics.js";
import type { MapDimensions } from "../types/dimensions.js";
import type { Corridor, Room } from "../types/geometry.js";
import { isMarker } from "../types/marker.js";
import type { Result } from "../types/result.js";
import { ok, err } from "../types/result.js";
import { isTerrain } from "../types/terrain.js";
import type { Tile, TileGrid } from "../types/tile.js";
import type { Dungeon, DungeonCandidate } from "../types/dungeon.js";

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function coordinatesEqual(a: Coordinate, b: Coordinate): boolean {
  return a.x === b.x && a.y === b.y;
}

function getTileAt(grid: TileGrid, coordinate: Coordinate): Tile | undefined {
  const row = grid[coordinate.y];
  return row?.[coordinate.x];
}

function validateDimensions(
  dimensions: MapDimensions,
  diagnostics: DomainDiagnostic[],
): boolean {
  if (!isPositiveInteger(dimensions.width)) {
    diagnostics.push(
      dimensionInvalidForDomain("Dungeon width must be a positive integer.", {
        field: "dimensions.width",
      }),
    );
  }
  if (!isPositiveInteger(dimensions.height)) {
    diagnostics.push(
      dimensionInvalidForDomain("Dungeon height must be a positive integer.", {
        field: "dimensions.height",
      }),
    );
  }
  return diagnostics.length === 0;
}

function validateTileGrid(
  dimensions: MapDimensions,
  tiles: TileGrid,
  diagnostics: DomainDiagnostic[],
): boolean {
  if (tiles.length !== dimensions.height) {
    diagnostics.push(
      gridShapeInvalid(
        `Tile grid row count ${tiles.length} does not match height ${dimensions.height}.`,
        { field: "tiles" },
      ),
    );
    return false;
  }

  for (let y = 0; y < dimensions.height; y += 1) {
    const row = tiles[y];
    if (!row || row.length !== dimensions.width) {
      diagnostics.push(
        gridShapeInvalid(
          `Tile row ${y} width ${row?.length ?? 0} does not match dungeon width ${dimensions.width}.`,
          { field: `tiles[${y}]`, coordinate: { x: 0, y } },
        ),
      );
      return false;
    }

    for (let x = 0; x < dimensions.width; x += 1) {
      const tile = row[x];
      if (!tile) {
        diagnostics.push(
          gridShapeInvalid(`Missing tile at (${x}, ${y}).`, {
            coordinate: { x, y },
          }),
        );
        return false;
      }

      if (!isTerrain(tile.terrain)) {
        diagnostics.push(
          tileInvalid(`Unsupported terrain at (${x}, ${y}).`, {
            coordinate: { x, y },
            field: "terrain",
          }),
        );
      }
      if (!isMarker(tile.marker)) {
        diagnostics.push(
          tileInvalid(`Unsupported marker at (${x}, ${y}).`, {
            coordinate: { x, y },
            field: "marker",
          }),
        );
      }
    }
  }

  return diagnostics.length === 0;
}

function validateMarkers(
  dimensions: MapDimensions,
  tiles: TileGrid,
  entrance: Coordinate,
  exit: Coordinate,
  diagnostics: DomainDiagnostic[],
): boolean {
  if (coordinatesEqual(entrance, exit)) {
    diagnostics.push(
      markerOverlapInvalid("Entrance and exit must be at distinct coordinates."),
    );
    return false;
  }

  let entranceCount = 0;
  let exitCount = 0;

  for (let y = 0; y < dimensions.height; y += 1) {
    for (let x = 0; x < dimensions.width; x += 1) {
      const tile = tiles[y]?.[x];
      if (!tile) {
        continue;
      }

      if (tile.marker === "entrance") {
        entranceCount += 1;
        if (!coordinatesEqual({ x, y }, entrance)) {
          diagnostics.push(
            markerCountInvalid(
              `Entrance marker at (${x}, ${y}) does not match declared entrance.`,
              { coordinate: { x, y } },
            ),
          );
        }
        if (tile.terrain !== "walkable") {
          diagnostics.push(
            markerTerrainInvalid(
              "Entrance marker requires walkable terrain.",
              { x, y },
            ),
          );
        }
      }

      if (tile.marker === "exit") {
        exitCount += 1;
        if (!coordinatesEqual({ x, y }, exit)) {
          diagnostics.push(
            markerCountInvalid(
              `Exit marker at (${x}, ${y}) does not match declared exit.`,
              { coordinate: { x, y } },
            ),
          );
        }
        if (tile.terrain !== "walkable") {
          diagnostics.push(
            markerTerrainInvalid("Exit marker requires walkable terrain.", { x, y }),
          );
        }
      }
    }
  }

  if (entranceCount !== 1) {
    diagnostics.push(
      markerCountInvalid(
        `Expected exactly one entrance marker, found ${entranceCount}.`,
        { field: "entrance" },
      ),
    );
  }

  if (exitCount !== 1) {
    diagnostics.push(
      markerCountInvalid(`Expected exactly one exit marker, found ${exitCount}.`, {
        field: "exit",
      }),
    );
  }

  const entranceTile = getTileAt(tiles, entrance);
  if (entranceTile && entranceTile.marker !== "entrance") {
    diagnostics.push(
      markerCountInvalid("Declared entrance coordinate lacks an entrance marker.", {
        coordinate: entrance,
      }),
    );
  }

  const exitTile = getTileAt(tiles, exit);
  if (exitTile && exitTile.marker !== "exit") {
    diagnostics.push(
      markerCountInvalid("Declared exit coordinate lacks an exit marker.", {
        coordinate: exit,
      }),
    );
  }

  return diagnostics.length === 0;
}

function isInBounds(
  coordinate: Coordinate,
  dimensions: MapDimensions,
): boolean {
  return (
    coordinate.x >= 0 &&
    coordinate.y >= 0 &&
    coordinate.x < dimensions.width &&
    coordinate.y < dimensions.height
  );
}

function validateRoom(
  room: Room,
  index: number,
  dimensions: MapDimensions,
  diagnostics: DomainDiagnostic[],
): void {
  const fields: Array<[string, number]> = [
    ["x", room.x],
    ["y", room.y],
    ["width", room.width],
    ["height", room.height],
  ];

  for (const [field, value] of fields) {
    if (!Number.isInteger(value)) {
      diagnostics.push(
        geometryInvalid(`Room ${index} ${field} must be an integer.`, {
          field: `rooms[${index}].${field}`,
        }),
      );
    }
  }

  if (room.width <= 0 || room.height <= 0) {
    diagnostics.push(
      geometryInvalid(`Room ${index} width and height must be positive.`, {
        field: `rooms[${index}]`,
      }),
    );
    return;
  }

  if (
    room.x < 0 ||
    room.y < 0 ||
    room.x + room.width > dimensions.width ||
    room.y + room.height > dimensions.height
  ) {
    diagnostics.push(
      geometryInvalid(`Room ${index} extends outside dungeon bounds.`, {
        field: `rooms[${index}]`,
      }),
    );
  }
}

function validateCorridor(
  corridor: Corridor,
  index: number,
  dimensions: MapDimensions,
  diagnostics: DomainDiagnostic[],
): void {
  if (corridor.path.length < 2) {
    diagnostics.push(
      geometryInvalid(`Corridor ${index} must contain at least two path points.`, {
        field: `corridors[${index}].path`,
      }),
    );
    return;
  }

  for (let pointIndex = 0; pointIndex < corridor.path.length; pointIndex += 1) {
    const point = corridor.path[pointIndex];
    if (!point || !Number.isInteger(point.x) || !Number.isInteger(point.y)) {
      diagnostics.push(
        geometryInvalid(
          `Corridor ${index} point ${pointIndex} must use integer coordinates.`,
          { field: `corridors[${index}].path[${pointIndex}]` },
        ),
      );
      continue;
    }

    if (!isInBounds(point, dimensions)) {
      diagnostics.push(
        geometryInvalid(
          `Corridor ${index} point (${point.x}, ${point.y}) is out of bounds.`,
          {
            field: `corridors[${index}].path[${pointIndex}]`,
            coordinate: { x: point.x, y: point.y },
          },
        ),
      );
    }
  }
}

export function createDungeon(
  candidate: DungeonCandidate,
): Result<Dungeon, DomainDiagnostic[]> {
  const diagnostics: DomainDiagnostic[] = [];

  if (!validateDimensions(candidate.dimensions, diagnostics)) {
    return err(diagnostics);
  }

  const { dimensions } = candidate;

  if (
    !validateTileGrid(dimensions, candidate.tiles, diagnostics) ||
    !validateMarkers(
      dimensions,
      candidate.tiles,
      candidate.entrance,
      candidate.exit,
      diagnostics,
    )
  ) {
    return err(diagnostics);
  }

  candidate.rooms.forEach((room, index) =>
    validateRoom(room, index, dimensions, diagnostics),
  );
  candidate.corridors.forEach((corridor, index) =>
    validateCorridor(corridor, index, dimensions, diagnostics),
  );

  if (diagnostics.length > 0) {
    return err(diagnostics);
  }

  const dungeon: Dungeon = {
    dimensions: { ...candidate.dimensions },
    tiles: copyTileGrid(candidate.tiles),
    rooms: copyRooms(candidate.rooms),
    corridors: copyCorridors(candidate.corridors),
    entrance: { ...candidate.entrance },
    exit: { ...candidate.exit },
  };

  return ok(dungeon);
}
