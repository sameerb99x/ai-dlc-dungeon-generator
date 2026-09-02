# Component Method Contracts

## Notation

Signatures are technology-neutral. `Result<Success, Failure>` denotes a typed value with exactly one success or failure branch. `Optional<T>` denotes explicit absence. `Readonly<T>` indicates that the receiver must not mutate the supplied value. Exact language syntax and field-level types will be chosen during NFR Requirements and Functional Design.

## C-01: Domain Model

| Signature | Purpose |
|---|---|
| `createSettings(raw: RawSettings): Result<DungeonSettings, SettingsDiagnostic[]>` | Construct settings from already parsed values while enforcing value-object constraints |
| `createCoordinate(x: Integer, y: Integer): Coordinate` | Construct a coordinate value |
| `createDungeon(candidate: DungeonCandidate): Result<Dungeon, DomainDiagnostic[]>` | Construct a bounded dungeon representation from candidate data |
| `dungeonsEqual(left: Readonly<Dungeon>, right: Readonly<Dungeon>): Boolean` | Compare structural content for reproducibility verification |

These constructors enforce only representation-level validity. Complete generation and playability rules remain the validator's responsibility.

## C-02: Seeded Random Source

### Interface `RandomSource`

| Signature | Purpose |
|---|---|
| `nextUnit(): Fraction` | Return the next deterministic value in the half-open unit interval |
| `nextInteger(minInclusive: Integer, maxInclusive: Integer): Integer` | Return a deterministic bounded integer |
| `choose<T>(values: ReadonlyList<T>): Result<T, RandomDiagnostic>` | Select one value deterministically, rejecting an empty collection |
| `shuffle<T>(values: ReadonlyList<T>): ReadonlyList<T>` | Return a deterministic permutation without mutating the input |
| `snapshot(): RandomState` | Expose replay state only where tests or bounded retry partitioning require it |

### Factory

| Signature | Purpose |
|---|---|
| `createRandomSource(seed: Seed): RandomSource` | Create a fresh deterministic sequence for an effective seed |

## C-03: Generation Strategy

### Interface `DungeonGenerationStrategy`

| Signature | Purpose |
|---|---|
| `generateCandidate(request: Readonly<EffectiveGenerationRequest>, random: RandomSource): CandidateOutcome` | Produce one bounded dungeon candidate or typed candidate-generation diagnostics |
| `strategyId(): GeneratorIdentifier` | Identify the strategy in result and reproducibility metadata |
| `strategyVersion(): Version` | Identify behavior changes affecting reproducibility |

`CandidateOutcome` is `Result<DungeonCandidate, GenerationDiagnostic[]>`. The initial implementation is `DefaultDungeonGenerator`; detailed layout mechanics are deferred to Functional Design.

## C-04: Dungeon Validator

### Interface `DungeonValidator`

| Signature | Purpose |
|---|---|
| `validate(dungeon: Readonly<Dungeon>, constraints: Readonly<PlayabilityConstraints>): ValidationReport` | Evaluate all enabled structural and playability rules |
| `validateStructure(dungeon: Readonly<Dungeon>): RuleResult[]` | Evaluate bounds, connectivity, entrance, exit, and reachability rules |
| `validatePlayability(dungeon: Readonly<Dungeon>, constraints: Readonly<PlayabilityConstraints>): RuleResult[]` | Evaluate path length, room size, corridor width, and dead-end rules |

Rule-level methods are public test seams and diagnostic boundaries, not an instruction that callers may bypass full validation when accepting a result.

## C-05: Settings Validator and Normalizer

### Interface `SettingsProcessor`

| Signature | Purpose |
|---|---|
| `process(raw: Readonly<RawSettings>, limits: Readonly<SupportedLimits>, versions: Readonly<VersionMetadata>): SettingsOutcome` | Parse, validate, normalize, and resolve a seed into an effective request |
| `validateFeasibility(settings: Readonly<DungeonSettings>, limits: Readonly<SupportedLimits>): SettingsDiagnostic[]` | Detect invalid ranges and statically detectable contradictions |
| `resolveSeed(optionalSeed: Optional<SeedInput>): Result<Seed, SettingsDiagnostic>` | Parse an explicit seed or create one when absent |

`SettingsOutcome` is `Result<EffectiveGenerationRequest, SettingsDiagnostic[]>`.

## C-06: Dungeon Generation Service

### Interface `GenerateDungeonUseCase`

| Signature | Purpose |
|---|---|
| `execute(rawSettings: Readonly<RawSettings>): GenerationOutcome` | Synchronously process settings, perform bounded candidate attempts, validate candidates, and return one accepted result or structured diagnostics |

### Supporting policy

| Signature | Purpose |
|---|---|
| `shouldRetry(attempt: AttemptNumber, candidateOutcome: CandidateOutcome, validation: Optional<ValidationReport>): Boolean` | Apply the bounded retry policy without embedding it in generator or validator |
| `createResult(request: Readonly<EffectiveGenerationRequest>, dungeon: Readonly<Dungeon>, validation: Readonly<ValidationReport>, versions: Readonly<VersionMetadata>): DungeonResult` | Assemble immutable accepted-result metadata |

Expected invalid settings, candidate failures, validation failures, and retry exhaustion are failure branches of `GenerationOutcome`. Unexpected programming or platform faults may throw to the browser error boundary.

## C-07: Application State Store

### Interface `ApplicationStateStore`

| Signature | Purpose |
|---|---|
| `getState(): Readonly<ApplicationState>` | Read the current state snapshot |
| `updateSettings(settings: Readonly<RawSettings>): Void` | Replace editable settings without changing the displayed result |
| `markGenerating(): Void` | Enter the synchronous generation busy state before invoking the use case |
| `applyGenerationSuccess(result: Readonly<DungeonResult>): Void` | Replace the current result and clear expected diagnostics |
| `applyGenerationFailure(diagnostics: ReadonlyList<GenerationDiagnostic>): Void` | Preserve the previous valid result and expose the current failure |
| `restore(latest: Readonly<StoredLatestResult>): Void` | Restore validated settings and one accepted result |
| `clearRestoredState(reason: RestoreDiagnostic): Void` | Fall back safely after absent or invalid local data |
| `subscribe(listener: StateListener): Unsubscribe` | Notify presentation adapters after state transitions |

## C-08: Version Metadata Provider

### Interface `VersionMetadataProvider`

| Signature | Purpose |
|---|---|
| `current(): Readonly<VersionMetadata>` | Return application, generator, and stored-format versions for the current build |
| `supportsStoredFormat(version: Version): Boolean` | Determine whether a local record can be decoded by this build |

## C-09: Web Application Controller

| Signature | Purpose |
|---|---|
| `start(): Void` | Bind events, subscribe the view and renderer, and attempt restoration |
| `generate(rawSettings: Readonly<RawSettings>): Void` | Set busy state, synchronously invoke generation, apply the typed outcome, and persist a success |
| `regenerate(seedMode: SeedMode): Void` | Reuse or replace the seed according to explicit user intent and invoke generation |
| `settingsChanged(rawSettings: Readonly<RawSettings>): Void` | Update editable state without mutating metadata belonging to the displayed result |
| `clearUnexpectedError(): Void` | Clear a user-safe unexpected-fault presentation after recovery |

The controller does not expose cancellation or progress events. Because the use case is synchronous, supported limits must make the call compatible with the responsiveness requirements.

## C-10: Canvas Dungeon Renderer

### Interface `CanvasDungeonRenderer`

| Signature | Purpose |
|---|---|
| `attach(canvas: CanvasSurface): Void` | Bind the committed Canvas surface and required resize observation |
| `render(result: Readonly<DungeonResult>, options: Readonly<RenderOptions>): RenderOutcome` | Draw a complete accepted result using scale and inspection options |
| `resize(viewport: Viewport): Void` | Update Canvas backing dimensions and redraw at the selected scale |
| `setZoom(zoom: ZoomLevel): Void` | Change inspection scale within supported bounds |
| `clear(): Void` | Clear the surface when no valid result is available |

`CanvasSurface` is the browser Canvas boundary. Generation, validation, and application services never depend on it.

## C-11: Latest Result Storage Adapter

### Interface `LatestResultRepository`

| Signature | Purpose |
|---|---|
| `load(): RestoreOutcome` | Read, decode, version-check, and validate the single fixed local record |
| `save(result: Readonly<DungeonResult>): Result<Void, StorageDiagnostic>` | Encode and atomically replace the single latest record |
| `clear(): Result<Void, StorageDiagnostic>` | Remove the fixed record |
| `serialize(result: Readonly<DungeonResult>): Result<SerializedRecord, StorageDiagnostic>` | Encode a versioned record through a directly testable round-trip boundary |
| `deserialize(record: SerializedRecord): Result<StoredLatestResult, StorageDiagnostic>` | Decode and structurally validate a versioned record without trusting its content |

`RestoreOutcome` distinguishes restored data, no data, incompatible data, malformed data, and unavailable storage. No method lists or addresses multiple records.

## C-12: Accessible Web View

### Interface `DungeonView`

| Signature | Purpose |
|---|---|
| `bind(actions: Readonly<ViewActions>): Void` | Connect user interactions to controller actions |
| `renderState(state: Readonly<ApplicationState>): Void` | Render controls, busy state, diagnostics, result metadata, and Canvas-adjacent information |
| `focusFirstInvalidField(diagnostics: ReadonlyList<SettingsDiagnostic>): Void` | Move focus to actionable configuration feedback |
| `announceStatus(message: StatusMessage): Void` | Programmatically announce important success, busy, or failure transitions |
| `createDungeonSummary(result: Readonly<DungeonResult>): AccessibleSummary` | Produce essential non-Canvas information about the current layout |

## Contract Rules

- All domain and application inputs are treated as immutable at component boundaries.
- Expected failures use typed result values and structured diagnostics.
- Exceptions represent unexpected faults and terminate the current orchestration call at the browser error boundary.
- Only C-09, C-10, and C-11 depend on browser APIs.
- Only C-10 depends on Canvas.
- Only C-11 knows the local-storage key and serialization format.
- Only C-06 owns bounded retry and acceptance orchestration.
- Detailed algorithms, rule formulas, and state-transition proofs remain deferred to Functional Design.

## Extension Compliance

Partial PBT rules are not directly enforced at Application Design, but C-04 exposes invariant test seams and C-11 exposes a serialization round-trip. C-02, C-03, C-04, and C-11 accept domain-shaped inputs suitable for later reusable generators and replayable seeded failures.
