# Dungeon Generator Units

## Decomposition Summary

The system is decomposed into nine units that follow the approved dependency direction: domain core first, then generation and validation, then play-session logic, then application orchestration, then browser adapters, and finally the web shell that wires them together.

Each unit owns one primary code location in the workspace root once implementation begins. Exact directory names will be finalized during Code Generation planning, but each unit must remain independently testable at its boundary.

## Unit Catalog

### U1: domain-foundation

**Purpose**: Provide immutable domain types, constructors, and structural equality required by every other unit.

**Primary components**: C-01 Domain Model

**Owns**:

- `DungeonSettings`, `PlayabilityConstraints`, coordinates, tiles, rooms, corridors, dungeons
- `ValidationReport`, `DungeonResult`, diagnostics, and `PlaySessionState`
- Representation-level constructors and `dungeonsEqual`

**Requirements**: FR-01 through FR-06 (data representation), FR-09, FR-11, FR-12 (play-session representation), NFR-04, NFR-05, NFR-06

**Stories**: US-03 through US-05, US-08, US-11, US-12

**Deliverables**:

- Domain type definitions and constructors
- Example-based tests for representation validity
- Property-based round-trip or structural-equality support where applicable

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Comprehensive | New data models and invariants |
| NFR Requirements | Minimal | Types only; stack selection deferred |
| NFR Design | Skip | No runtime NFR patterns at type layer |
| Infrastructure Design | Skip | No infrastructure |
| Code Generation | Execute | Required foundation unit |

---

### U2: deterministic-random-and-settings

**Purpose**: Supply all deterministic procedural variation and normalize user or restored settings before generation.

**Primary components**: C-02 Seeded Random Source, C-05 Settings Processor

**Owns**:

- `RandomSource` factory and bounded deterministic operations
- `SettingsProcessor` parsing, feasibility checks, seed resolution, and supported-limit enforcement

**Requirements**: FR-02, FR-03, FR-06, FR-07, NFR-03, NFR-04, NFR-07

**Stories**: US-01, US-02, US-04, US-09

**Dependencies**: U1 `domain-foundation`

**Deliverables**:

- Seeded random source implementation
- Settings processor with field-addressable diagnostics
- Example-based and property-based tests for seed resolution and invalid-setting rejection

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Standard | Clear input/output rules with bounded edge cases |
| NFR Requirements | Standard | Supported limits affect responsiveness |
| NFR Design | Standard | Limit enforcement patterns |
| Infrastructure Design | Skip | Pure logic |
| Code Generation | Execute | Required before orchestration |

---

### U3: dungeon-generation-strategy

**Purpose**: Implement the replaceable generation strategy that produces bounded dungeon candidates from an effective request and seeded randomness.

**Primary components**: C-03 Generation Strategy (`DefaultDungeonGenerator`)

**Owns**:

- `DungeonGenerationStrategy.generateCandidate`
- Initial rooms-and-corridors candidate algorithm
- Candidate-generation diagnostics

**Requirements**: FR-01, FR-03, FR-05, NFR-04, NFR-05, NFR-06

**Stories**: US-03, US-04, US-05

**Dependencies**: U1 `domain-foundation`, U2 `deterministic-random-and-settings`

**Deliverables**:

- Default generation strategy implementation
- Candidate-generation tests independent of browser rendering
- Property-based tests over domain-valid requests and seeds

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Comprehensive | Complex procedural algorithm |
| NFR Requirements | Standard | Performance-sensitive candidate work |
| NFR Design | Standard | Main-thread work limits |
| Infrastructure Design | Skip | Pure logic |
| Code Generation | Execute | Core product capability |

---

### U4: dungeon-validator

**Purpose**: Independently evaluate candidates against structural and configured playability rules.

**Primary components**: C-04 Dungeon Validator

**Owns**:

- Full `validate`, `validateStructure`, and `validatePlayability`
- Rule-identifiable diagnostics and validation reports

**Requirements**: FR-05, FR-06, FR-07, NFR-04, NFR-06

**Stories**: US-05, US-06

**Dependencies**: U1 `domain-foundation`

**Deliverables**:

- Validator implementation with identifiable rule failures
- Example-based boundary tests
- Property-based invariant tests with domain generators

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Comprehensive | Many interacting validation rules |
| NFR Requirements | Minimal | Logic-only unit |
| NFR Design | Skip | No additional NFR patterns beyond tests |
| Infrastructure Design | Skip | Pure logic |
| Code Generation | Execute | Required acceptance gate for valid dungeons |

---

### U5: play-session-evaluator

**Purpose**: Evaluate cardinal movement, completion, reset, and restored-session validity without mutating dungeon topology.

**Primary components**: C-13 Play Session Evaluator

**Owns**:

- `createInitialSession`, `attemptMove`, `isComplete`, `resetSession`, `validateRestoredSession`
- Movement and completion diagnostics

**Requirements**: FR-11, FR-12, NFR-04, NFR-06

**Stories**: US-11, US-12

**Dependencies**: U1 `domain-foundation`

**Deliverables**:

- Play-session evaluator implementation
- Example-based movement, blocked-move, completion, and reset tests
- Property-based movement and completion invariant tests

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Standard | Focused movement rules |
| NFR Requirements | Minimal | Lightweight logic |
| NFR Design | Skip | No runtime patterns |
| Infrastructure Design | Skip | Pure logic |
| Code Generation | Execute | Required for playable maze |

---

### U6: application-core

**Purpose**: Orchestrate synchronous generation, bounded retries, typed outcomes, application state, and version metadata.

**Primary components**: C-06 Generation Service, C-07 Application State Store, C-08 Version Metadata Provider

**Owns**:

- `GenerateDungeonUseCase` orchestration and retry policy
- `ApplicationStateStore` transitions for settings, busy, success, failure, play, reset, and restoration
- `VersionMetadataProvider` for reproducibility and storage compatibility

**Requirements**: FR-01 through FR-10, FR-12, NFR-03 through NFR-06

**Stories**: US-03 through US-10, US-12

**Dependencies**: U1 through U5

**Deliverables**:

- Generation service with typed `GenerationOutcome`
- Application state store with play-session integration
- Version metadata provider
- Orchestration tests with fake domain dependencies

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Comprehensive | Orchestration, retries, and state transitions |
| NFR Requirements | Comprehensive | Responsiveness and determinism boundaries |
| NFR Design | Comprehensive | Synchronous main-thread orchestration patterns |
| Infrastructure Design | Minimal | Version metadata only |
| Code Generation | Execute | Central application coordination |

---

### U7: browser-local-storage

**Purpose**: Persist and restore exactly one versioned settings, result, and play-session record through browser-local storage.

**Primary components**: C-11 Latest Result Storage Adapter

**Owns**:

- `LatestResultRepository` load, save, clear, serialize, deserialize
- Fixed-key one-record policy and untrusted-data handling

**Requirements**: FR-10, FR-12, NFR-06, NFR-07

**Stories**: US-09, US-12

**Dependencies**: U1 `domain-foundation`, U6 `application-core` (version metadata contract)

**Deliverables**:

- Local storage adapter with defensive decode and discard behavior
- Serialization round-trip tests (PBT-02 seam)
- Restore outcome handling for absent, malformed, incompatible, and invalid play-session data

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Standard | Clear storage envelope and restore rules |
| NFR Requirements | Standard | Browser storage limits and security fundamentals |
| NFR Design | Standard | Untrusted local data handling |
| Infrastructure Design | Skip | Browser API only |
| Code Generation | Execute | Narrow persistence exception |

---

### U8: browser-presentation

**Purpose**: Render the accepted dungeon and character on Canvas and present accessible controls, status, diagnostics, metadata, completion, and reset affordances in the DOM.

**Primary components**: C-10 Canvas Renderer, C-12 Accessible Web View

**Owns**:

- `CanvasDungeonRenderer` drawing, sizing, zoom, and character rendering
- `DungeonView` controls, status, diagnostics, metadata, completion messaging, reset action, and accessible summaries

**Requirements**: FR-04, FR-11, FR-12, NFR-01, NFR-02, NFR-03

**Stories**: US-01, US-02, US-06 through US-08, US-11, US-12

**Dependencies**: U1 `domain-foundation`, U6 `application-core`

**Deliverables**:

- Canvas renderer for dungeon terrain, entrance, exit, and character
- Accessible DOM view and play-surface focus behavior
- Visual and accessibility verification hooks for later browser tests

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Standard | Rendering and view-state binding rules |
| NFR Requirements | Comprehensive | WCAG 2.2 AA, contrast, keyboard behavior, rendering performance |
| NFR Design | Comprehensive | Canvas and accessibility patterns |
| Infrastructure Design | Minimal | Static asset delivery only if needed |
| Code Generation | Execute | Primary user-visible presentation |

---

### U9: web-application

**Purpose**: Bootstrap the browser application, wire controller actions to use cases and adapters, and provide the deployable application shell.

**Primary components**: C-09 Web Application Controller plus application entry and build shell

**Owns**:

- Startup, restoration, generation, regeneration, movement, reset, and error-boundary flows
- Dependency wiring between application-core, presentation, and persistence units
- Application bootstrap, routing if needed, and top-level build entry

**Requirements**: FR-02 through FR-10, FR-11, FR-12, NFR-01 through NFR-08

**Stories**: US-01 through US-12

**Dependencies**: U6, U7, U8

**Deliverables**:

- Web controller implementation
- Application bootstrap and dependency wiring
- End-to-end browser workflow tests for critical journeys
- Build and test entry configuration

**Construction recommendation**:

| Stage | Depth | Rationale |
|---|---|---|
| Functional Design | Standard | Orchestration mostly defined in services.md |
| NFR Requirements | Comprehensive | Delivery, security fundamentals, CI, hosting |
| NFR Design | Comprehensive | Deployment and runtime integration |
| Infrastructure Design | Standard | Hosting, CI, and release architecture |
| Code Generation | Execute | Final integration unit |

## Requirement Coverage Matrix

| Requirement | Owning units |
|---|---|
| FR-01 | U1, U3, U6 |
| FR-02 | U2, U8, U9 |
| FR-03 | U2, U3, U6 |
| FR-04 | U8 |
| FR-05 | U1, U3, U4, U6 |
| FR-06 | U2, U4, U6 |
| FR-07 | U2, U4, U6, U8, U9 |
| FR-08 | U6, U8, U9 |
| FR-09 | U1, U6, U8 |
| FR-10 | U6, U7, U9 |
| FR-11 | U1, U5, U6, U8, U9 |
| FR-12 | U1, U5, U6, U7, U8, U9 |
| NFR-01 | U8, U9 |
| NFR-02 | U8, U9 |
| NFR-03 | U2, U3, U6, U8, U9 |
| NFR-04 | U1 through U6, U9 |
| NFR-05 | U1, U3, U6, U9 |
| NFR-06 | U1 through U7, U9 |
| NFR-07 | U2, U7, U8, U9 |
| NFR-08 | U9 |

Every approved story maps to at least one unit through its requirement references. US-01 through US-12 are fully covered by the matrix above.

## Component Ownership

| Component | Primary unit |
|---|---|
| C-01 Domain Model | U1 |
| C-02 Seeded Random Source | U2 |
| C-03 Generation Strategy | U3 |
| C-04 Dungeon Validator | U4 |
| C-05 Settings Processor | U2 |
| C-06 Generation Service | U6 |
| C-07 Application State Store | U6 |
| C-08 Version Metadata Provider | U6 |
| C-09 Web Controller | U9 |
| C-10 Canvas Renderer | U8 |
| C-11 Latest Result Storage | U7 |
| C-12 Accessible Web View | U8 |
| C-13 Play Session Evaluator | U5 |

## Implementation Order

1. U1 `domain-foundation`
2. U2 `deterministic-random-and-settings` and U4 `dungeon-validator` and U5 `play-session-evaluator` may proceed in parallel after U1
3. U3 `dungeon-generation-strategy` after U1 and U2
4. U6 `application-core` after U1 through U5
5. U7 `browser-local-storage` and U8 `browser-presentation` may proceed in parallel after U6
6. U9 `web-application` after U6, U7, and U8

## Scope Enforcement

The unit set includes generation, validation, play-session navigation, presentation, one-record local restoration, and application shell integration. It excludes loot, encounters, enemies, combat, inventory, health, scoring, timers, multiplayer, accounts, catalogs, cloud storage, and synchronization.

## Extension Compliance

| Extension or rule | Status for Units Generation | Rationale |
|---|---|---|
| Security Baseline | Skipped | Disabled by user selection |
| PBT-02 Round Trips | N/A | Scheduled for U7 Code Generation via explicit serialize/deserialize seam |
| PBT-03 Invariants | N/A | Scheduled for U3, U4, U5, and U6 in applicable construction stages |
| PBT-07 Generator Quality | N/A | Scheduled for domain and generation test design in U3 and U4 |
| PBT-08 Shrinking and Reproducibility | N/A | Scheduled during Code Generation and Build and Test |
| PBT-09 Framework Selection | N/A | Scheduled during U9 NFR Requirements and Code Generation |
| Resiliency Baseline | Skipped | Disabled by user selection |

No enabled extension has a blocking finding at this stage.
