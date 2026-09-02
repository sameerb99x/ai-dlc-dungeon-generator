import type { Coordinate } from "../types/coordinate.js";
import type { Corridor, Room } from "../types/geometry.js";
import type { TileGrid } from "../types/tile.js";
import type { Dungeon } from "../types/dungeon.js";
import type { DungeonResult } from "../types/dungeon-result.js";
import type { EffectiveGenerationRequest } from "../types/generation-request.js";
import type { PlayabilityConstraints } from "../types/constraints.js";
import type { MapDimensions } from "../types/dimensions.js";
import type { DungeonSettings } from "../types/settings.js";
import type { RuleResult, ValidationReport } from "../types/validation.js";
import type { VersionMetadata } from "../types/version.js";

function coordinatesEqual(a: Coordinate, b: Coordinate): boolean {
  return a.x === b.x && a.y === b.y;
}

function tilesEqual(left: TileGrid, right: TileGrid): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let y = 0; y < left.length; y += 1) {
    const leftRow = left[y];
    const rightRow = right[y];
    if (!leftRow || !rightRow || leftRow.length !== rightRow.length) {
      return false;
    }

    for (let x = 0; x < leftRow.length; x += 1) {
      const leftTile = leftRow[x];
      const rightTile = rightRow[x];
      if (
        !leftTile ||
        !rightTile ||
        leftTile.terrain !== rightTile.terrain ||
        leftTile.marker !== rightTile.marker
      ) {
        return false;
      }
    }
  }

  return true;
}

function roomsEqual(left: ReadonlyArray<Room>, right: ReadonlyArray<Room>): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftRoom = left[index];
    const rightRoom = right[index];
    if (
      !leftRoom ||
      !rightRoom ||
      leftRoom.x !== rightRoom.x ||
      leftRoom.y !== rightRoom.y ||
      leftRoom.width !== rightRoom.width ||
      leftRoom.height !== rightRoom.height
    ) {
      return false;
    }
  }

  return true;
}

function corridorsEqual(
  left: ReadonlyArray<Corridor>,
  right: ReadonlyArray<Corridor>,
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftCorridor = left[index];
    const rightCorridor = right[index];
    if (!leftCorridor || !rightCorridor) {
      return false;
    }
    if (leftCorridor.path.length !== rightCorridor.path.length) {
      return false;
    }

    for (let pointIndex = 0; pointIndex < leftCorridor.path.length; pointIndex += 1) {
      const leftPoint = leftCorridor.path[pointIndex];
      const rightPoint = rightCorridor.path[pointIndex];
      if (!leftPoint || !rightPoint || !coordinatesEqual(leftPoint, rightPoint)) {
        return false;
      }
    }
  }

  return true;
}

function dungeonsLayoutEqual(left: Dungeon, right: Dungeon): boolean {
  return (
    left.dimensions.width === right.dimensions.width &&
    left.dimensions.height === right.dimensions.height &&
    coordinatesEqual(left.entrance, right.entrance) &&
    coordinatesEqual(left.exit, right.exit) &&
    tilesEqual(left.tiles, right.tiles) &&
    roomsEqual(left.rooms, right.rooms) &&
    corridorsEqual(left.corridors, right.corridors)
  );
}

function constraintsEqual(
  left: PlayabilityConstraints,
  right: PlayabilityConstraints,
): boolean {
  return (
    left.minPathLength === right.minPathLength &&
    left.minRoomWidth === right.minRoomWidth &&
    left.minRoomHeight === right.minRoomHeight &&
    left.maxRoomWidth === right.maxRoomWidth &&
    left.maxRoomHeight === right.maxRoomHeight &&
    left.corridorWidth === right.corridorWidth &&
    left.maxDeadEnds === right.maxDeadEnds
  );
}

function dimensionsEqual(left: MapDimensions, right: MapDimensions): boolean {
  return left.width === right.width && left.height === right.height;
}

function settingsEqual(left: DungeonSettings, right: DungeonSettings): boolean {
  return (
    dimensionsEqual(left.dimensions, right.dimensions) &&
    left.seedInput === right.seedInput &&
    constraintsEqual(left.constraints, right.constraints)
  );
}

function requestsEqual(
  left: EffectiveGenerationRequest,
  right: EffectiveGenerationRequest,
): boolean {
  return (
    settingsEqual(left.settings, right.settings) &&
    left.resolvedSeed === right.resolvedSeed &&
    left.generatorId === right.generatorId &&
    left.generatorVersion === right.generatorVersion
  );
}

function ruleResultsEqual(
  left: ReadonlyArray<RuleResult>,
  right: ReadonlyArray<RuleResult>,
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftResult = left[index];
    const rightResult = right[index];
    if (
      !leftResult ||
      !rightResult ||
      leftResult.ruleId !== rightResult.ruleId ||
      leftResult.passed !== rightResult.passed ||
      leftResult.message !== rightResult.message
    ) {
      return false;
    }
  }

  return true;
}

function reportsEqual(left: ValidationReport, right: ValidationReport): boolean {
  return (
    left.status === right.status &&
    ruleResultsEqual(left.ruleResults, right.ruleResults)
  );
}

function versionsEqual(left: VersionMetadata, right: VersionMetadata): boolean {
  return (
    left.applicationVersion === right.applicationVersion &&
    left.generatorVersion === right.generatorVersion &&
    left.formatVersion === right.formatVersion
  );
}

export function dungeonsEqual(left: DungeonResult, right: DungeonResult): boolean {
  return (
    dungeonsLayoutEqual(left.dungeon, right.dungeon) &&
    requestsEqual(left.request, right.request) &&
    reportsEqual(left.report, right.report) &&
    versionsEqual(left.versions, right.versions)
  );
}
