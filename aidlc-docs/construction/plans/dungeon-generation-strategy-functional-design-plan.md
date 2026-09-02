# Superseded: U3 Dungeon Generation Strategy Functional Design Plan

> This plan belonged to the production-oriented U3–U9 decomposition. It is retained for history only and must not be used for POC implementation; `poc-web-app` is now the sole remaining construction unit.

## Objective

Define the technology-agnostic business behavior for U3: one replaceable generation strategy (`DungeonGenerationStrategy`) and its initial implementation (`DefaultDungeonGenerator`) that turns an `EffectiveGenerationRequest` and a seeded `RandomSource` into one bounded `DungeonCandidate` or typed candidate-generation diagnostics. U3 consumes only the completed U1 domain-foundation and U2 deterministic-random-and-settings public boundaries. It does not normalize settings, validate structural or playability acceptance, own retries, render, or persist data.

## Context Loaded

- U3 definition and dependency boundary: `aidlc-docs/inception/units-generation/units.md`
- Approved requirements: FR-01, FR-03, FR-05 (candidate production aspects), NFR-04, NFR-05, NFR-06
- Approved stories: US-03, US-04, US-05 (generator-side obligations only)
- Approved component contracts: C-03 `DungeonGenerationStrategy` / `DefaultDungeonGenerator`
- Completed U1 public types: `DungeonCandidate`, rooms, corridors, tiles, entrance/exit, bottom-left coordinates, typed `Result`
- Completed U2 public contracts: `RandomSource`, `EffectiveGenerationRequest`, deterministic draw/snapshot behavior
- Enabled Partial Property-Based Testing extension: PBT-02, PBT-03, PBT-07, PBT-08, and PBT-09 are blocking; PBT-01 is advisory at this Functional Design stage under Partial enforcement and will still be documented

## Unit Boundary

### Inputs

- `Readonly<EffectiveGenerationRequest>` containing normalized settings, resolved seed, and generator identity/version
- A fresh or caller-supplied `RandomSource` already seeded with the effective seed
- Implicit map and room/corridor constraints carried in the request settings

### Outputs

- `CandidateOutcome` = `Result<DungeonCandidate, GenerationDiagnostic[]>`
- A successful candidate includes dimensions, tile grid, rooms, corridors, exactly one entrance, and exactly one exit
- Typed, rule-addressable diagnostics when candidate construction cannot complete under documented generation failure rules

### Explicit exclusions

- Settings parsing, seed resolution, supported-limit enforcement, or feasibility rejection (U2)
- Structural or playability acceptance decisions and validation reports (U4)
- Generation-attempt limits, retries, and result assembly (U6)
- Browser rendering, storage, DOM, network, ambient time, or unseeded randomness

## Planning Checklist

- [x] Load U3 scope, dependencies, requirements, stories, component contracts, and completed U1/U2 boundaries
- [x] Identify decisions that materially affect candidate layout, determinism, and failure boundaries
- [x] Identify PBT handoff properties and extension compliance obligations
- [x] Create the functional-design plan and focused question set
- [ ] Validate every answer for ambiguity or contradiction
- [ ] Produce U3 business-logic, business-rules, and domain-entities artifacts
- [ ] Complete the U3 Functional Design review gate

## Proposed Functional-Design Work

1. Define U3 value concepts: strategy identity, candidate construction stages, generation diagnostics, and the success/failure boundary versus U4 rejection.
2. Define the default rooms-and-corridors algorithm: room placement, corridor topology, tile rasterization, and entrance/exit selection.
3. Specify how configured playability constraints influence generation versus remaining U4 acceptance checks.
4. Specify deterministic random-consumption rules and reproducibility obligations.
5. Specify stable diagnostic codes, fields, and ordering for expected generation failures.
6. Document testable properties for later Code Generation: deterministic replay, bounds, marker counts, and constraint-aware construction invariants.
7. Record U3-to-U4/U6 contracts without designing those downstream units.

## Functional Design Questions

Please complete each `[Answer]:` field below. These choices establish U3's externally observable candidate-generation behavior. Numeric performance budgets remain the next NFR Requirements decision unless selected here.

## Question 1

Which initial layout algorithm should `DefaultDungeonGenerator` use to place rooms?

A) Place non-overlapping axis-aligned rooms by repeatedly sampling random rectangles inside the map until a target room count is reached or placement attempts are exhausted.

B) Recursively partition the map with a binary space partition (BSP), then place one room inside each leaf region.

C) Start from a cellular or drunkard-walk dig and derive rooms afterward from contiguous open regions.

D) Other (please describe after [Answer]: tag below)

[Answer]:  D - Any reasonable choice here is fine.

## Question 2

How should the default strategy decide how many rooms to attempt?

A) Derive a deterministic target from map area and configured min/max room sizes, then stop early if placement cannot reach that target.

B) Use a fixed small absolute room-count range (for example, 3–8) scaled only by whether the map is near the supported minimum or maximum size.

C) Keep placing rooms until a configured fraction of the map area is occupied by rooms, subject to a hard attempt cap.

D) Other (please describe after [Answer]: tag below)

[Answer]: D - Any reasonable choice here is fine.

## Question 3

How should corridors connect the placed rooms?

A) Build a spanning tree over room centers so every room is reachable, using only L-shaped or straight orthogonal corridors.

B) Build a spanning tree and then add a deterministic number of extra loops so some alternate paths exist.

C) Connect each room only to its spatially nearest neighbor without guaranteeing a single connected component from generation alone.

D) Other (please describe after [Answer]: tag below)

[Answer]:  D - Anything is fine.

## Question 4

How should entrance and exit be chosen on a successful candidate?

A) Place both on walkable tiles belonging to rooms (not corridor-only tiles), maximizing approximate entrance-to-exit separation subject to map bounds.

B) Place the entrance in the first placed room and the exit in the last placed room on walkable room tiles, without a distance-maximization pass.

C) Place entrance and exit on any walkable tiles, including corridor tiles, using a deterministic farthest-pair selection over the walkable set.

D) Other (please describe after [Answer]: tag below)

[Answer]:  D - Anything is fine

## Question 5

How aggressively should U3 try to satisfy configurable playability constraints during candidate construction?

A) Bias room sizes, corridor width, and entrance/exit separation toward the configured constraints, but still emit a candidate whenever a bounded layout can be built; leave acceptance to U4.

B) Treat minimum path length, room-size bounds, corridor width, and dead-end limits as hard construction requirements; return generation diagnostics if the strategy cannot satisfy them.

C) Honor only geometric construction needs (room fit, corridor carving, marker placement); ignore playability constraint values entirely inside U3.

D) Other (please describe after [Answer]: tag below)

[Answer]: D - A decent level of playability is good enough.

## Question 6

When should `generateCandidate` return typed generation diagnostics instead of a `DungeonCandidate`?

A) Only for internal construction impossibilities after consuming a valid effective request—for example, zero rooms placed, inability to carve any corridor graph, or inability to place distinct entrance and exit markers.

B) For construction impossibilities and also whenever the candidate would obviously fail a structural rule the generator already knows it violated.

C) Almost never: always return some candidate grid, even if empty or marker-deficient, and rely on U4/U6 to reject it.

D) Other (please describe after [Answer]: tag below)

[Answer]: D - Anything is fine

## Question 7

How should overlapping geometry be resolved when carving the final tile grid?

A) Rooms are placed without overlap; corridors may cross rooms and other corridors; walkable terrain is the union of room interiors and corridor footprints; blocked tiles fill the remainder.

B) Rooms may overlap during placement and are merged into larger walkable regions before corridors are added.

C) Rooms and corridors are exclusive regions; corridors stop at room boundaries and never overwrite room tiles.

D) Other (please describe after [Answer]: tag below)

[Answer]: D - Anything reasonable is fine.

## Question 8

What corridor geometry should the default strategy carve relative to `corridorWidth`?

A) Orthogonal corridors whose carved footprint is exactly `corridorWidth` tiles thick along each segment.

B) Always carve 1-tile-wide corridors regardless of `corridorWidth`, leaving width enforcement entirely to U4.

C) Carve center-line paths one tile wide and expand them symmetrically toward `corridorWidth` where space allows, shrinking only when blocked by map bounds.

D) Other (please describe after [Answer]: tag below)

[Answer]: D Anything reasonable is fine.

## Testable Properties and PBT Handoff

| Component | Property category | Later Code Generation requirement |
|---|---|---|
| `generateCandidate` determinism | Invariant | Equal effective request and equal random operation sequence produce equal candidates or equal diagnostics. |
| Successful candidate bounds | Invariant | Every tile, room, corridor vertex, entrance, and exit lies inside configured dimensions. |
| Marker cardinality | Invariant | A successful candidate has exactly one entrance marker and exactly one exit marker on walkable tiles. |
| Random isolation | Invariant | Generation uses only the supplied `RandomSource`; no ambient time or unseeded randomness. |
| Room geometry | Invariant | Emitted rooms are axis-aligned, positive-area, and inside map bounds. |
| Strategy metadata | Invariant | `strategyId` and `strategyVersion` are stable for a given implementation behavior revision. |

PBT-02 is N/A for U3 because it owns no serialization or inverse transformation. PBT-03, PBT-07, PBT-08, and PBT-09 remain blocking Code Generation obligations; custom generators must reuse U1/U2 domain generators where applicable, preserve fast-check shrinking, and use the documented fixed CI seed.

## Extension Compliance (Current Plan)

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Advisory analysis complete | Testable properties are identified above; Partial enforcement does not make PBT-01 blocking. |
| PBT-02 | N/A | U3 has no inverse transformation or serialization boundary. |
| PBT-03 | Planned | U3 invariants are identified for later generated property tests. |
| PBT-07 | Planned | Code generation will use constrained effective-request and seed generators reused from U1/U2 where possible. |
| PBT-08 | Planned | Existing fast-check shrinking and fixed-seed replay configuration will be reused. |
| PBT-09 | Compliant | U1 selected and installed fast-check with Vitest integration. |
| Security Baseline | Skipped | Disabled in `aidlc-state.md`. |
| Resiliency Baseline | Skipped | Disabled in `aidlc-state.md`. |
