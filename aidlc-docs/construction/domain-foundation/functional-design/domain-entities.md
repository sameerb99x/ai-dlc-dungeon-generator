# U1 Domain Foundation Entities

## Value Entities

| Entity | Essential fields | Notes |
|---|---|---|
| `Coordinate` | `x`, `y` | Zero-based integer map position with `(0, 0)` at the bottom-left; `x` grows rightward and `y` upward. |
| `MapDimensions` | `width`, `height` | Positive integer rectangular bounds. |
| `Terrain` | `walkable` or `blocked` | Independent from marker state. |
| `Marker` | `none`, `entrance`, or `exit` | Entrance and exit require walkable terrain. |
| `Tile` | `terrain`, `marker` | Immutable grid cell. |
| `Room` | bounded rectangular geometry | Local shape validity only. |
| `Corridor` | bounded path or segment geometry | Local shape validity only. |
| `PlayabilityConstraints` | path, room-size, corridor-width, dead-end limits | Rule semantics evaluated by U4. |
| `DungeonSettings` | dimensions, seed input, generation controls, constraints | Settings value-object constraints only. |
| `VersionMetadata` | application, generator, format versions | Immutable reproducibility boundary. |

## Aggregate Entities

| Entity | Contains | Invariants |
|---|---|---|
| `DungeonCandidate` | dimensions, tile grid, rooms, corridors, entrance, exit | Shape and references are constructible; full validation is not implied. |
| `Dungeon` | immutable successful candidate representation | Rectangular, bounded, distinct walkable markers. |
| `ValidationReport` | overall status and rule results | Immutable report; U4 creates its semantic contents. |
| `EffectiveGenerationRequest` | normalized settings, resolved seed, generator identity | U2 owns normalization and seed resolution. |
| `DungeonResult` | accepted dungeon, request, report, versions | Complete reproducibility comparison input. |
| `PlaySessionState` | position, completed | Newly created session is at the entrance and incomplete. |

## Outcome and Diagnostic Entities

`Result<Success, Failure>` has exactly one immutable branch. `DomainDiagnostic` and `SettingsDiagnostic` carry the category, stable code, message, affected field or rule, and optional coordinate or data path. No partial aggregate is returned in a failure branch.

## Ownership and Lifecycle

- U1 creates and owns the representation types and their local validity rules.
- U2 creates `EffectiveGenerationRequest`; U3 creates candidate data; U4 creates validation reports; U5 transitions play sessions; U6 assembles accepted results; U7 serializes results; U8 and U9 only consume them.
- Values cross boundaries only as deeply immutable data. Any collection exposed to a caller is read-only and cannot mutate the aggregate that produced it.

## Equality Model

The public reproducibility comparison works over `DungeonResult`, despite the legacy `dungeonsEqual` name in the earlier component contract. It compares every field in the result recursively. A layout-only helper may be private for implementation efficiency but must not be used as the public reproducibility assertion.

## Property-Test Generator Model

Later tests use centrally defined reusable generators:

- valid bounded coordinates and dimensions;
- rectangular tile grids with independently generated terrain and markers;
- distinct entrance and exit placements on walkable tiles;
- ordered in-bounds room and corridor geometry;
- valid aggregate results and focused invalid variants that violate exactly one representation rule.

The generator suite must include boundary sizes and coordinates and allow framework-provided shrinking to produce minimal, replayable failures.
