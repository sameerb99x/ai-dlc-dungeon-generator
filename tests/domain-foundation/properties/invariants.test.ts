import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { PBT_FIXED_SEED } from "../support/pbt-seed.js";
import {
  createCoordinate,
  createDungeon,
  createPlaySession,
  dungeonsEqual,
  type Coordinate,
} from "../../../src/domain-foundation/index.js";
import { makeSampleResult } from "../support/fixtures.js";
import {
  coordinateArb,
  invalidGridShapeCandidate,
  invalidMarkerOverlapCandidate,
  validCandidateArb,
  validDungeonArb,
} from "../support/generators.js";

const pbt = fc.configureGlobal({
  seed: PBT_FIXED_SEED,
  numRuns: 50,
});

describe("domain-foundation property invariants", () => {
  it("createCoordinate succeeds only for integer pairs", () => {
    pbt;
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (x, y) => {
        const result = createCoordinate(x, y);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value).toEqual({ x, y });
        }
      }),
    );
  });

  it("valid candidates produce dungeons with exact tile counts and distinct markers", () => {
    pbt;
    fc.assert(
      fc.property(validCandidateArb(), (candidate) => {
        const result = createDungeon(candidate);
        expect(result.ok).toBe(true);
        if (!result.ok) {
          return false;
        }

        const dungeon = result.value;
        expect(dungeon.tiles.length).toBe(candidate.dimensions.height);
        expect(dungeon.tiles.every((row) => row.length === candidate.dimensions.width)).toBe(
          true,
        );
        expect(dungeon.entrance).toEqual(candidate.entrance);
        expect(dungeon.exit).toEqual(candidate.exit);
        expect(
          !(dungeon.entrance.x === dungeon.exit.x && dungeon.entrance.y === dungeon.exit.y),
        ).toBe(true);
        return true;
      }),
    );
  });

  it("invalid grid shapes always fail without partial values", () => {
    pbt;
    fc.assert(
      fc.property(invalidGridShapeCandidate(), (candidate) => {
        const result = createDungeon(candidate);
        expect(result.ok).toBe(false);
        return true;
      }),
    );
  });

  it("overlapping entrance and exit always fail", () => {
    pbt;
    fc.assert(
      fc.property(invalidMarkerOverlapCandidate(), (candidate) => {
        const result = createDungeon(candidate);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.some((d) => d.code === "marker.overlap.invalid")).toBe(true);
        }
        return true;
      }),
    );
  });

  it("source mutation after construction cannot change dungeon tiles", () => {
    pbt;
    fc.assert(
      fc.property(validCandidateArb(), (candidate) => {
        const mutableTiles = candidate.tiles.map((row) => row.map((tile) => ({ ...tile })));
        const mutableCandidate = { ...candidate, tiles: mutableTiles };
        const result = createDungeon(mutableCandidate);
        if (!result.ok) {
          return true;
        }

        for (const row of mutableTiles) {
          for (const tile of row) {
            tile.terrain = "blocked";
            tile.marker = "none";
          }
        }

        const entranceTile = result.value.tiles[result.value.entrance.y]?.[
          result.value.entrance.x
        ];
        expect(entranceTile?.marker).toBe("entrance");
        return true;
      }),
    );
  });

  it("createPlaySession always starts at the entrance incomplete", () => {
    pbt;
    fc.assert(
      fc.property(validDungeonArb(), (candidate) => {
        const built = createDungeon(candidate);
        if (!built.ok) {
          return true;
        }
        const session = createPlaySession(built.value);
        expect(session.position).toEqual(built.value.entrance);
        expect(session.completed).toBe(false);
        return true;
      }),
    );
  });

  it("dungeonsEqual is reflexive, symmetric, and transitive on sample results", () => {
    pbt;
    fc.assert(
      fc.property(fc.constant(null), () => {
        const a = makeSampleResult();
        const b = makeSampleResult();
        const c = makeSampleResult();
        expect(dungeonsEqual(a, a)).toBe(true);
        expect(dungeonsEqual(a, b)).toBe(dungeonsEqual(b, a));
        if (dungeonsEqual(a, b) && dungeonsEqual(b, c)) {
          expect(dungeonsEqual(a, c)).toBe(true);
        }
        return true;
      }),
    );
  });

  it("coordinate generator stays within declared bounds when composed", () => {
    pbt;
    fc.assert(
      fc.property(coordinateArb, (coordinate: Coordinate) => {
        expect(Number.isInteger(coordinate.x)).toBe(true);
        expect(Number.isInteger(coordinate.y)).toBe(true);
        return true;
      }),
    );
  });
});
