# Application Services and Orchestration

## Service Boundary Principles

- Services coordinate components; they do not absorb generator algorithms or validation rules.
- The core generation use case is synchronous and runs on the browser main thread.
- The browser coordinator yields to a render opportunity before invoking synchronous generation so a busy state can become visible.
- There is no initial cancellation or incremental progress contract.
- Strict supported-size and work limits bound the duration of one call.
- Expected failures are typed results; unexpected faults reach one browser error boundary.
- A successful result may be displayed even if browser-local persistence subsequently fails.

## S-01: Generate Dungeon Service

**Implemented by**: C-06 Dungeon Generation Service

**Purpose**: Convert raw settings into one accepted, metadata-complete `DungeonResult` or structured expected failure.

**Dependencies**:

- C-05 Settings Validator and Normalizer
- C-02 Seeded Random Source factory
- C-03 selected Dungeon Generation Strategy
- C-04 Dungeon Validator
- C-08 Version Metadata Provider

**Synchronous orchestration**:

1. Load immutable version metadata and supported limits.
2. Process raw settings into an effective request or return field-addressable settings diagnostics.
3. For each permitted attempt, derive deterministic attempt randomness from the effective seed and attempt number.
4. Ask the selected strategy for one candidate.
5. Convert representation-valid candidate data into a domain dungeon.
6. Validate the complete dungeon structurally and against configured playability constraints.
7. On a passing report, assemble and return a successful `DungeonResult`.
8. On a retryable candidate or validation failure, continue while the attempt policy permits.
9. When attempts are exhausted, return structured diagnostics containing relevant failed constraints and attempt metadata.

**Acceptance invariant**: No result enters the success branch unless the complete validation report passes.

**Determinism boundary**: Effective seed, settings, strategy identifier and version, and attempt policy version completely determine the candidate sequence and accepted outcome.

## S-02: Browser Session Coordinator

**Implemented by**: C-09 Web Application Controller

**Purpose**: Coordinate view actions, application state, synchronous generation, Canvas updates, local persistence, and safe error presentation.

**Dependencies**:

- C-06 Generate Dungeon Use Case
- C-07 Application State Store
- C-10 Canvas Dungeon Renderer
- C-11 Latest Result Storage Adapter
- C-12 Accessible Web View

### Startup flow

1. Bind view actions to controller methods.
2. Subscribe the view and Canvas renderer to state changes.
3. Ask C-11 to load the single local record.
4. If restoration succeeds, apply the validated settings and result to C-07.
5. If no record exists, keep defaults.
6. If the record is malformed or incompatible, discard it safely, keep defaults, and expose a non-blocking diagnostic when useful.
7. Render the resulting state and accepted dungeon, if present.

### Generation flow

1. Accept the current raw settings from the view.
2. Mark C-07 as generating while preserving any previous valid result.
3. Allow the browser one render opportunity so the busy state is visible.
4. Invoke C-06 synchronously on the main thread.
5. If successful, apply the new result to C-07 and ask C-11 to replace the single local record.
6. If generation fails as expected, apply diagnostics to C-07 and preserve the previous valid result.
7. If local persistence fails after generation succeeds, keep the successful result visible and expose a non-blocking storage diagnostic.
8. Notify the view and renderer through state subscriptions.

### Regeneration flow

1. Preserve all current settings.
2. Retain the effective seed for reproduction or clear it for a newly selected seed according to explicit user action.
3. Follow the normal generation flow.

### Unexpected-fault flow

1. Catch the exception at the controller's browser error boundary.
2. Preserve the last safe application state and previous valid result where possible.
3. Present a generic user-safe fault message and record technical diagnostics through the later-selected observability adapter.
4. Never expose secrets or environment internals in the browser message.

## S-03: Latest Result Restoration Service

**Implemented through**: C-11 Latest Result Storage Adapter coordinated by C-09

**Purpose**: Maintain the narrow one-record local restoration capability without becoming a general persistence subsystem.

### Save policy

- Save only after C-06 returns an accepted result.
- Replace one fixed local-storage key; never append history.
- Store effective settings, accepted dungeon, validation report, and required version metadata in one versioned envelope.
- Treat storage quota, permission, or availability failures as non-fatal to the current successful session.

### Restore policy

- Treat local data as untrusted input.
- Decode and structurally validate the envelope.
- Check the stored-format version before decoding payload details.
- Validate the restored result sufficiently to prevent malformed data from entering application state; detailed validation depth will be finalized in Functional Design.
- Return explicit outcomes for restored, absent, malformed, incompatible, and unavailable storage.
- Clear malformed or incompatible data when safe so repeated startup does not fail on the same record.

### Round-trip boundary

`serialize` and `deserialize` form a logical inverse for all valid storable results. This boundary is reserved for PBT-02 enforcement during Code Generation.

## S-04: Presentation Update Service

**Implemented through**: C-07 state subscriptions, C-10 renderer, and C-12 view

**Purpose**: Keep controls, status, metadata, accessible summaries, and Canvas output consistent with one application-state snapshot.

### Update rules

- C-12 owns DOM controls, diagnostics, metadata, accessible summaries, and status announcements.
- C-10 owns Canvas drawing, sizing, and zoom behavior.
- C-10 renders only an accepted result from C-07.
- Editing settings does not alter metadata associated with the currently displayed result.
- Generation failure updates diagnostics without clearing a previous valid result.
- Essential map meaning has a non-Canvas accessible summary supplied by C-12.

## Typed Failure Propagation

| Failure category | Origin | Propagation | User-visible handling |
|---|---|---|---|
| Invalid setting | C-05 | `SettingsOutcome` failure to C-06, then `GenerationOutcome` failure to C-09 | Field-addressable feedback; preserve other settings and prior result |
| Candidate construction failure | C-03 or C-01 | `CandidateOutcome` failure into retry policy | Retry within bounds; summarize if exhausted |
| Validation failure | C-04 | Failed `ValidationReport` into retry policy | Never display candidate as valid; summarize relevant constraints if exhausted |
| Retry exhaustion | C-06 | `GenerationOutcome` failure | Actionable recovery guidance; preserve settings and prior result |
| Invalid local record | C-11 | `RestoreOutcome` malformed or incompatible branch | Discard safely; start with defaults; optional non-blocking notice |
| Local storage unavailable | C-11 | Typed storage diagnostic | Continue current session without restoration |
| Unexpected fault | Any | Exception to C-09 error boundary | Safe generic error; preserve last safe state where possible |

## Transaction and Consistency Boundaries

- One generation call is an in-memory application transaction: either a complete accepted result replaces the current result or the previous valid result remains.
- Canvas rendering consumes a completed state snapshot and never observes a partially assembled result.
- Local persistence follows in-memory success and is not part of the generation transaction.
- A storage failure cannot roll back a successfully generated current-session result.
- Restoration either supplies one complete compatible record or no record; partial restoration is prohibited.

## Deferred Detailed Design

- Candidate-attempt derivation and retry counts
- Exact rule evaluation and diagnostic priority
- Exact browser render-yield mechanism before synchronous generation
- Local-record schema and compatibility migration policy
- Canvas drawing, zoom, and hit-testing mechanics
- Concrete logging, metrics, and error-reporting adapters

## Extension Compliance

No partial PBT rule is directly enforced during Application Design. The service boundaries explicitly carry forward PBT-02 for storage round trips, PBT-03 for generation and validation invariants, PBT-07 for domain generators, PBT-08 for shrinking and replayable seeds, and PBT-09 for later framework selection.
