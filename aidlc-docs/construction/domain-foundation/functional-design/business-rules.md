# U1 Domain Foundation Business Rules

## Representation Rules

| ID | Rule | Enforcement boundary |
|---|---|---|
| DF-01 | Coordinates use zero-based integer `(x, y)` values; `(0, 0)` is the bottom-left, `x` grows rightward, and `y` grows upward. Browser adapters convert to their top-left raster origin at the rendering boundary. | Coordinate and dungeon construction |
| DF-02 | Dungeon width and height are positive integers; supported maximums are applied later by U2 settings processing. | Dungeon construction |
| DF-03 | A dungeon grid is rectangular and contains one tile for every coordinate in `[0, width)` × `[0, height)`. | Dungeon construction |
| DF-04 | Tile terrain is either `walkable` or `blocked`; its marker is independently `none`, `entrance`, or `exit`. | Tile and dungeon construction |
| DF-05 | An entrance or exit marker may appear only on a walkable tile. | Dungeon construction |
| DF-06 | A dungeon has exactly one entrance and exactly one exit; their coordinates must be distinct. | Dungeon construction |
| DF-07 | Every room and corridor has valid ordered, in-bounds geometry. Their overlap, connectivity, path length, corridor-width compliance, and dead-end compliance are deferred to U4. | Dungeon construction / U4 later |
| DF-08 | A successful constructor result defensively copies caller input and exposes readonly TypeScript contracts, including nested tiles, geometry, lists, diagnostics, and metadata. Recursive runtime freezing is not required; callers must honor the readonly boundary. | All U1 public values |
| DF-09 | Expected invalid caller data returns field- or rule-addressable diagnostics and no partial value. | All public constructors |
| DF-10 | A new play session starts at the accepted dungeon entrance with completion set to false. | Play-session construction |
| DF-11 | Full-result reproducibility equality includes all layout, effective-settings, validation-report, and version-metadata fields. | U1 comparison contract |

## Diagnostic Rules

Diagnostics are immutable typed values with a stable code, affected field or rule, human-safe message, and optional path or coordinate context. Diagnostics must not embed untrusted executable markup or sensitive runtime data.

| Category | Examples |
|---|---|
| `coordinate.invalid` | non-integer coordinate component |
| `dimension.invalid` | non-positive or non-integer width or height |
| `grid.shape.invalid` | missing, extra, or non-rectangular tile data |
| `tile.invalid` | unsupported terrain or marker value |
| `marker.count.invalid` | missing or duplicate entrance or exit |
| `marker.terrain.invalid` | marked tile is blocked |
| `marker.overlap.invalid` | entrance and exit share a coordinate |
| `geometry.invalid` | malformed, unordered, or out-of-bounds room/corridor geometry |
| `settings.invalid` | a value-object setting violates its local format or range rule |

## Deferred Rules

The following are intentionally not U1 acceptance rules: all-walkable connectivity, entrance-to-exit reachability, minimum path length, corridor-width validation, dead-end limits, feasible setting combinations, deterministic random behavior, bounded retries, and restored-session validity. These belong respectively to U4, U2, U5, and U6.

## PBT Compliance

| Enabled rule | Status | Evidence |
|---|---|---|
| PBT-02 Round-trip | N/A | U1 owns no serialization, parser/formatter, encoder/decoder, or other inverse pair. |
| PBT-03 Invariants | Compliant design handoff | DF-01 through DF-11 and their required property tests are explicit. |
| PBT-07 Generator quality | Compliant design handoff | Reusable structured domain generators are specified in the business-logic model. |
| PBT-08 Shrinking and reproducibility | Compliant design handoff | U1 code generation must retain shrinking and replayable failure seeds. |
| PBT-09 Framework selection | Deferred to next applicable stage | U1 NFR Requirements selects and documents the framework before Code Generation; no implementation dependency exists yet. |
