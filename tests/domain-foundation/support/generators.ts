import * as fc from "fast-check";
import type {
  Coordinate,
  Corridor,
  DomainDiagnostic,
  DungeonCandidate,
  Room,
  Tile,
} from "../../../src/domain-foundation/index.js";
import { createCoordinate, createDungeon } from "../../../src/domain-foundation/index.js";
import { makeTile, makeValidCandidate, withMarkers, type MutableGrid } from "./fixtures.js";

export const coordinateArb = fc
  .record({ x: fc.integer({ min: 0, max: 20 }), y: fc.integer({ min: 0, max: 20 }) })
  .filter(({ x, y }) => createCoordinate(x, y).ok);

export const dimensionsArb = fc.record({
  width: fc.integer({ min: 2, max: 12 }),
  height: fc.integer({ min: 2, max: 12 }),
});

export const tileArb = fc.record({
  terrain: fc.constantFrom<Tile["terrain"]>("walkable", "blocked"),
  marker: fc.constantFrom<Tile["marker"]>("none", "entrance", "exit"),
});

export const roomArb = (maxWidth: number, maxHeight: number) =>
  fc
    .record({
      x: fc.integer({ min: 0, max: maxWidth - 1 }),
      y: fc.integer({ min: 0, max: maxHeight - 1 }),
      width: fc.integer({ min: 1, max: maxWidth }),
      height: fc.integer({ min: 1, max: maxHeight }),
    })
    .filter(
      (room) =>
        room.x + room.width <= maxWidth && room.y + room.height <= maxHeight,
    );

export const corridorArb = (maxWidth: number, maxHeight: number) =>
  fc
    .array(coordinateArb, { minLength: 2, maxLength: 8 })
    .filter((path) => path.every((point) => point.x < maxWidth && point.y < maxHeight))
    .map((path): Corridor => ({ path }));

function distinctWalkableCoordinates(
  width: number,
  height: number,
): fc.Arbitrary<{ entrance: Coordinate; exit: Coordinate }> {
  return fc
    .tuple(coordinateArb, coordinateArb)
    .filter(([a, b]) => !(a.x === b.x && a.y === b.y))
    .filter(([a, b]) => a.x < width && a.y < height && b.x < width && b.y < height)
    .map(([entrance, exit]) => ({ entrance, exit }));
}

export function validCandidateArb(): fc.Arbitrary<DungeonCandidate> {
  return dimensionsArb.chain(({ width, height }) =>
    distinctWalkableCoordinates(width, height).chain(({ entrance, exit }) =>
      fc
        .tuple(
          fc.array(roomArb(width, height), { maxLength: 4 }),
          fc.array(corridorArb(width, height), { maxLength: 4 }),
        )
        .map(([rooms, corridors]) => {
          const base = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => makeTile("blocked", "none")),
          );
          const tiles = withMarkers(base, entrance, exit);
          tiles[entrance.y]![entrance.x]!.terrain = "walkable";
          tiles[exit.y]![exit.x]!.terrain = "walkable";
          return {
            dimensions: { width, height },
            tiles,
            rooms,
            corridors,
            entrance,
            exit,
          };
        }),
    ),
  );
}

export function validDungeonArb() {
  return validCandidateArb().filter((candidate) => createDungeon(candidate).ok);
}

export function invalidGridShapeCandidate(): fc.Arbitrary<DungeonCandidate> {
  return validCandidateArb().map((candidate) => ({
    ...candidate,
    tiles: candidate.tiles.slice(0, Math.max(0, candidate.dimensions.height - 1)),
  }));
}

export function invalidMarkerOverlapCandidate(): fc.Arbitrary<DungeonCandidate> {
  return dimensionsArb.chain(({ width, height }) => {
    const point = { x: 0, y: 0 };
    const tiles = withMarkers(
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => makeTile("blocked", "none")),
      ),
      point,
      point,
    ) as MutableGrid;
    tiles[0]![0]!.terrain = "walkable";

    return fc.constant({
      dimensions: { width, height },
      tiles,
      rooms: [],
      corridors: [{ path: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }],
      entrance: point,
      exit: point,
    });
  });
}

export function expectDiagnostics(error: DomainDiagnostic[] | unknown): DomainDiagnostic[] {
  if (!Array.isArray(error)) {
    throw new Error("Expected diagnostic array");
  }
  return error as DomainDiagnostic[];
}
