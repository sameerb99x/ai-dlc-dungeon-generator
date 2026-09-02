# Application Components

## Architecture Shape

The application uses a dependency-rule architecture with three conceptual layers:

1. **Domain core** — deterministic models, seeded randomness, generation strategy, and validation; no browser or Canvas dependencies.
2. **Application layer** — synchronous orchestration, typed outcomes, in-memory interaction state, and version-aware result assembly.
3. **Browser adapters** — web interaction, Canvas rendering, and browser-local storage of one latest record.

All generation runs on the browser main thread. Supported-size and work limits are part of the application boundary so callers cannot request workloads that violate the responsiveness contract.

## Shared Contract Types

These technology-neutral types are used across component interfaces. Exact field definitions and invariants are deferred to Functional Design.

| Type | Purpose |
|---|---|
| `DungeonSettings` | Requested dimensions, optional seed, and generation controls |
| `PlayabilityConstraints` | Minimum path, room-size, corridor-width, and dead-end rules |
| `EffectiveGenerationRequest` | Normalized settings, resolved seed, and generator version |
| `Dungeon` | Bounded tile grid plus rooms, corridors, entrance, and exit |
| `ValidationReport` | Overall status plus structural and playability diagnostics |
| `DungeonResult` | Accepted dungeon, effective request, validation report, and version metadata |
| `GenerationDiagnostic` | Typed, actionable expected-failure detail |
| `GenerationOutcome` | Typed success containing `DungeonResult` or failure containing diagnostics |
| `ApplicationState` | Current editable settings, busy state, displayed result, and latest diagnostics |
| `StoredLatestResult` | Versioned serialization envelope for exactly one settings-and-result record |
| `RenderOptions` | Canvas viewport, scale, visual theme, and inspection state |

## Domain Components

### C-01: Domain Model

**Purpose**: Define immutable or controlled-value representations for settings, coordinates, tiles, rooms, corridors, dungeons, validation reports, results, and diagnostics.

**Responsibilities**:

- Represent the domain without browser, Canvas, storage, or framework concepts.
- Make invalid states difficult to construct where practical.
- Support structural equality required by seeded reproducibility tests.
- Carry explicit generator, format, and application version metadata.

**Boundary interfaces**: Domain types and constructors consumed by all other components.

**Must not**: Generate layouts, validate complete dungeons, render, persist, or orchestrate workflows.

### C-02: Seeded Random Source

**Purpose**: Provide all procedural variation through a deterministic, seed-derived sequence.

**Responsibilities**:

- Create a random sequence from the effective seed.
- Supply bounded numeric and selection operations required by generation strategies.
- Keep ambient time and platform randomness outside deterministic generation.

**Boundary interface**: `RandomSource`.

**Must not**: Know dungeon rules, UI state, storage, or rendering.

### C-03: Generation Strategy

**Purpose**: Define a replaceable boundary for producing dungeon candidates from an effective request.

**Responsibilities**:

- Expose one strategy contract and one initial implementation.
- Consume only normalized settings and a seeded random source.
- Produce bounded candidate dungeons or typed candidate-generation diagnostics.
- Remain independent of validation acceptance, Canvas rendering, and browser storage.

**Boundary interface**: `DungeonGenerationStrategy`.

**Initial implementation**: `DefaultDungeonGenerator`.

**Must not**: Select its own unseeded randomness, accept invalid settings, decide final validity, render, or persist.

### C-04: Dungeon Validator

**Purpose**: Evaluate a generated candidate against structural and configured playability rules independently of the generator.

**Responsibilities**:

- Verify bounds, connected walkable space, exactly one entrance and exit, and mutual reachability.
- Verify minimum path length, room dimensions, corridor width, and dead-end limits.
- Return a structured validation report suitable for users, tests, and metadata display.
- Keep each validation rule identifiable so failures remain actionable.

**Boundary interface**: `DungeonValidator`.

**Must not**: Mutate or repair a candidate, render it, persist it, or own retry policy.

### C-05: Settings Validator and Normalizer

**Purpose**: Validate raw user or restored settings before generation and produce an effective request.

**Responsibilities**:

- Enforce supported dimensions and work limits.
- Detect impossible or contradictory setting combinations where possible.
- Resolve a missing seed and normalize accepted values.
- Return field-addressable typed diagnostics for expected failures.

**Boundary interface**: `SettingsProcessor`.

**Must not**: Generate or validate a dungeon candidate.

## Application Components

### C-06: Dungeon Generation Service

**Purpose**: Orchestrate one synchronous generation request from raw settings to an accepted result or structured failure.

**Responsibilities**:

- Coordinate settings processing, seeded randomness, the selected generation strategy, validation, bounded retries, and result metadata.
- Keep retry and acceptance policy outside both generator and validator.
- Return `GenerationOutcome`; expected failures do not escape as exceptions.
- Allow unexpected faults to propagate to the browser error boundary after contextual logging or translation.

**Boundary interface**: `GenerateDungeonUseCase`.

**Must not**: Render, mutate UI controls, or access browser storage directly.

### C-07: Application State Store

**Purpose**: Hold current-session interaction state and expose predictable state transitions to the web UI.

**Responsibilities**:

- Hold editable settings, busy state, current result, and current diagnostics.
- Preserve a previous valid result while a new request is processed or fails.
- Notify subscribed presentation code of state changes.
- Coordinate restoration state without interpreting storage formats.

**Boundary interface**: `ApplicationStateStore`.

**Must not**: Generate, validate, serialize, render, or call browser APIs.

### C-08: Version Metadata Provider

**Purpose**: Supply generator, stored-format, and application versions used in results and compatibility checks.

**Responsibilities**:

- Provide immutable build-time version metadata.
- Keep version acquisition separate from generation behavior.

**Boundary interface**: `VersionMetadataProvider`.

## Browser Adapter Components

### C-09: Web Application Controller

**Purpose**: Translate browser user actions into synchronous use-case calls and state transitions.

**Responsibilities**:

- Read and validate control input through the application service boundary.
- Set and clear busy state around the synchronous generation call.
- Apply success or failure outcomes to application state.
- Trigger Canvas rendering through state observation.
- Initiate restoration at application startup and persistence after accepted results.
- Route unexpected exceptions to a user-safe error boundary.

**Boundary interface**: Browser event handlers and application bootstrap contract.

**Must not**: Implement generation, validation, or storage serialization rules.

### C-10: Canvas Dungeon Renderer

**Purpose**: Render the current accepted dungeon and inspection state into an HTML Canvas.

**Responsibilities**:

- Draw rooms, corridors, blocked areas, entrance, and exit.
- Implement the committed Canvas rendering boundary.
- Support the selected scaling, scrolling, zooming, focus, and non-color distinction behavior.
- Render only accepted `DungeonResult` data supplied by the application state.

**Boundary interface**: `CanvasDungeonRenderer`.

**Must not**: Generate, validate, persist, or mutate domain results.

### C-11: Latest Result Storage Adapter

**Purpose**: Persist and restore exactly one versioned settings-and-result record using browser-local storage.

**Responsibilities**:

- Serialize, write, read, and deserialize one fixed storage key.
- Validate envelope and format versions before returning restored data.
- Return typed absence or invalid-data outcomes without preventing startup.
- Remove incompatible or malformed data safely.

**Boundary interface**: `LatestResultRepository`.

**Must not**: Maintain a catalog, multiple-result history, accounts, synchronization, or cloud storage.

### C-12: Accessible Web View

**Purpose**: Present controls, status, diagnostics, metadata, and Canvas-adjacent accessible information.

**Responsibilities**:

- Bind controls and status displays to application state.
- Provide keyboard-operable controls, programmatic labels, focus management, and non-color-only status cues.
- Present result metadata and structured diagnostics.
- Provide an accessible textual summary or equivalent information for essential Canvas content.

**Boundary interface**: `DungeonView`.

**Must not**: Own domain, generation, validation, persistence, or retry rules.

## Component Coverage

| Capability | Owning components |
|---|---|
| Configuration and early validation | C-05, C-07, C-09, C-12 |
| Seeded deterministic generation | C-01, C-02, C-03, C-06 |
| Structural and playability acceptance | C-04, C-06 |
| Synchronous orchestration and recovery | C-06, C-07, C-09 |
| Canvas visualization and accessibility | C-10, C-12 |
| Result metadata and version boundaries | C-01, C-08, C-12 |
| Most-recent local restoration | C-07, C-09, C-11 |
| Production-oriented diagnostics and testing seams | All components through explicit contracts; especially C-02 through C-06 and C-11 |

## Extension Compliance

Security Baseline and Resiliency Baseline are skipped because they are disabled. Partial Property-Based Testing rules are not directly enforced during Application Design. The boundaries preserve later testability for round trips, generation invariants, domain generators, shrinking and replay seeds, and framework integration.
