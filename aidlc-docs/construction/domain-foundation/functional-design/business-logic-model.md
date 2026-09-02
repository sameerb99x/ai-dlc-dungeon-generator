# U1 Domain Foundation Business Logic Model

## Purpose and Boundary

U1 publishes deeply immutable, technology-agnostic values used by all remaining units. It accepts parsed candidate data, provides representation-level construction and comparison, and returns typed diagnostics for invalid caller input. U1 does not generate a layout, decide complete structural or playability validity, access browser APIs, serialize data, or mutate any supplied value.

## Construction Flow

1. A caller supplies parsed primitives and structured candidate data in the published bottom-left coordinate system.
2. Value constructors check their local representation rules and return either a complete immutable value or typed diagnostics.
3. `createDungeon` checks the bounded grid shape, coordinate references, room and corridor shapes, and unique distinct entrance and exit markers; it does not evaluate connectivity, path length, dead ends, or generator acceptance.
4. A successful `Dungeon` can be safely shared with generators, validators, play-session evaluation, rendering, and persistence without defensive mutation concerns.
5. A new play session starts at the dungeon entrance with `completed = false`; the distinct-marker invariant makes that state unambiguous.

## Entity Relationships

- `DungeonSettings` contains dimensions and `PlayabilityConstraints`.
- `Dungeon` contains a rectangular `TileGrid`, `Room` list, `Corridor` list, and distinct entrance and exit `Coordinate` values. Its zero-based origin is bottom-left; `x` increases rightward and `y` increases upward.
- A `Tile` has independent `Terrain` (`walkable` or `blocked`) and `Marker` (`none`, `entrance`, or `exit`). An entrance or exit tile must be walkable.
- `DungeonResult` joins an accepted `Dungeon`, its `EffectiveGenerationRequest`, `ValidationReport`, and immutable `VersionMetadata`.
- `PlaySessionState` references a coordinate in one displayed accepted dungeon and records completion; U5 later verifies moves and restored-session compatibility.

Browser-facing units must convert this domain convention to the browser Canvas convention at their boundary: for a dungeon of height `h`, domain coordinate `(x, y)` maps to canvas row `h - 1 - y`. No browser-oriented coordinate conversion enters U1.

## Constructor Outcomes

| Constructor | Success | Expected invalid-input outcome |
|---|---|---|
| `createCoordinate` | immutable zero-based integer coordinate | `CoordinateDiagnostic` |
| `createSettings` | normalized domain settings value | `SettingsDiagnostic[]` |
| `createDungeon` | immutable bounded dungeon | `DomainDiagnostic[]` |
| `createPlaySession` | session at entrance, incomplete | no caller-invalid path after a valid `Dungeon` exists |

Expected caller-data failures return typed results and never leave a partial domain value. Exceptions are reserved for programming defects or a violated internal invariant, and are handled by the later application error boundary.

## Equality Semantics

The user selected full accepted-result reproducibility equality. The U1 public comparison therefore evaluates the complete immutable `DungeonResult`: dungeon dimensions, terrain and markers, rooms, corridors, entrance, exit, effective settings, validation report, and generator, format, and application version metadata. The implementation may use a private layout-only helper, but it must not expose that helper as the reproducibility verdict.

## Testable Properties

| Area | Property category | Property to carry into Code Generation |
|---|---|---|
| Value constructors | Invariant | Every successful value satisfies its documented representation constraints; every invalid generated input returns diagnostics and no partial value. |
| Deep immutability | Invariant | Mutating source collections after construction cannot alter any observed domain value. |
| Grid representation | Invariant | A successful dungeon has exactly `width × height` addressable tiles and every stored coordinate is within bounds. |
| Markers | Invariant | A successful dungeon has exactly one walkable entrance and one walkable exit at distinct coordinates. |
| Equality | Invariant | Full-result equality is reflexive, symmetric, and transitive; changing any compared field makes otherwise equal results unequal. |
| Play session construction | Invariant | A new session position equals its dungeon entrance and is incomplete. |

There is no U1 serialization, parsing/formatting, or other logical inverse; PBT-02 is N/A for this unit. U7 owns the serialization round-trip boundary.

## PBT Handoff

Code Generation must provide reusable domain-specific generators for valid coordinates, rectangular tile grids, rooms, corridors, valid distinct-marker dungeons, constraints, diagnostics, version metadata, results, and intentionally invalid candidate variants. Generators must include minimum dimensions, maximum supported dimensions once selected, boundary coordinates, and malformed cases. Shrinking must remain enabled and failure output must expose a replayable seed. Framework selection is deferred to U1 NFR Requirements, before U1 Code Generation.

## Traceability

This model supports FR-01 through FR-06, FR-09, FR-11, FR-12, NFR-04, NFR-05, and NFR-06, plus U1 stories US-03 through US-05, US-08, US-11, and US-12.
