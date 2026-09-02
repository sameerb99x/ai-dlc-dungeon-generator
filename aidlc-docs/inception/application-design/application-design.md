# Dungeon Generator Application Design

## Design Summary

The application is a client-side visual dungeon generator whose domain and application layers run synchronously on the browser main thread. Strict supported-size and work limits protect responsiveness. One initial deterministic generator implements a replaceable strategy contract. A separate validator decides whether candidates satisfy structural and configured playability rules. A synchronous application service owns normalization, seeded randomness, bounded retries, validation, and result assembly.

The web controller adapts this core to browser interactions. It coordinates an in-memory state store, a committed Canvas renderer, an accessible DOM view, and browser-local storage limited to exactly the most recent settings and accepted result. Expected failures travel through typed result values; unexpected faults terminate at one browser error boundary.

## Approved Architecture Decisions

| Decision | Selected approach | Consequence |
|---|---|---|
| Execution topology | Browser main thread | No backend or worker in the initial design; supported limits are mandatory |
| Generation abstraction | One implementation behind `DungeonGenerationStrategy` | Replacement is possible without exposing algorithm choice to users |
| Rendering | Canvas is the committed renderer and presentation boundary | Canvas-specific behavior is isolated in C-10; domain and application code remain Canvas-free |
| Orchestration | Synchronous use-case result | No cancellation or progress contract; UI yields once to paint busy state before the call |
| Expected failure model | Typed result values and structured diagnostics | Rule failures remain explicit and testable; exceptions represent unexpected faults |
| Interaction state | In-memory state plus one local latest record | Restores exactly one result and settings; no catalog, history, account, cloud, or sync capability |

## Component Architecture

| Layer | Components | Responsibility |
|---|---|---|
| Domain core | C-01 Domain Model, C-02 Seeded Random Source, C-03 Generation Strategy, C-04 Dungeon Validator, C-05 Settings Processor | Represent, generate, and validate deterministic dungeon data without browser dependencies |
| Application layer | C-06 Generation Service, C-07 Application State Store, C-08 Version Metadata Provider | Orchestrate accepted outcomes, state transitions, retry boundaries, and version metadata |
| Browser adapters | C-09 Web Controller, C-10 Canvas Renderer, C-11 Latest Result Storage, C-12 Accessible Web View | Adapt user events, Canvas, local storage, DOM status, metadata, and accessibility behavior |

Detailed responsibilities and prohibited responsibilities are defined in `components.md`.

## Principal Contracts

| Contract | Owner | Primary operation |
|---|---|---|
| `RandomSource` | C-02 | Produce deterministic bounded choices from an effective seed |
| `DungeonGenerationStrategy` | C-03 | `generateCandidate(request, random): CandidateOutcome` |
| `DungeonValidator` | C-04 | `validate(dungeon, constraints): ValidationReport` |
| `SettingsProcessor` | C-05 | `process(raw, limits, versions): SettingsOutcome` |
| `GenerateDungeonUseCase` | C-06 | `execute(rawSettings): GenerationOutcome` |
| `ApplicationStateStore` | C-07 | Apply settings, busy, success, failure, and restoration transitions |
| `CanvasDungeonRenderer` | C-10 | `render(result, options): RenderOutcome` |
| `LatestResultRepository` | C-11 | Load, save, clear, serialize, and deserialize one latest record |
| `DungeonView` | C-12 | Bind actions and render controls, status, diagnostics, metadata, and accessible summary |

Full technology-neutral signatures and purposes are defined in `component-methods.md`.

## Primary Orchestration

### Generate

1. The controller records a busy state and yields to a browser render opportunity.
2. The synchronous generation service processes and normalizes raw settings.
3. It constructs seeded randomness and asks the selected strategy for candidates.
4. The independent validator evaluates structural and playability rules.
5. The service retries within a bounded deterministic policy until one candidate passes or attempts are exhausted.
6. A successful result atomically replaces application state and is offered to the one-record local repository.
7. An expected failure updates diagnostics while preserving the previous valid result.
8. View and Canvas adapters consume a completed immutable state snapshot.

### Restore

1. Startup reads one fixed browser-local record.
2. The storage adapter treats it as untrusted, checks format compatibility, and validates its decoded shape.
3. A compatible record restores settings and one accepted result atomically.
4. Absent data leaves defaults unchanged.
5. Malformed or incompatible data is safely discarded and cannot block startup.

### Unexpected fault

Unexpected programming or platform faults propagate to the controller error boundary, which preserves the last safe state where possible and presents a user-safe message without exposing sensitive environment detail.

Detailed service flows, failure propagation, and consistency boundaries are defined in `services.md`.

## Dependency Direction

- Browser adapters may depend on application and domain contracts.
- Application services may depend on domain contracts.
- Domain components never depend on browser, DOM, Canvas, storage, controller, or framework code.
- C-10 alone owns Canvas access.
- C-11 alone owns the fixed local-storage key and record format.
- C-06 alone owns generation acceptance and bounded retry orchestration.
- C-03 produces candidates; C-04 independently determines validity.

The complete dependency matrix, Mermaid diagrams, text alternatives, and prohibited-coupling list are defined in `component-dependency.md`.

## Requirement and Story Traceability

| Requirements | Stories | Design ownership |
|---|---|---|
| FR-01 | US-03 | C-01, C-02, C-03, C-06 |
| FR-02 | US-01, US-02 | C-05, C-07, C-09, C-12 |
| FR-03 | US-04 | C-02, C-03, C-06, C-08 |
| FR-04 | US-07 | C-07, C-10, C-12 |
| FR-05, FR-06 | US-05 | C-01, C-04, C-06 |
| FR-07 | US-02, US-06 | C-05, C-06, C-07, C-09, C-12 |
| FR-08 | US-09 | C-07, C-09, C-12 |
| FR-09 | US-04, US-08 | C-01, C-06, C-08, C-12 |
| FR-10 | US-09 | C-07, C-09, C-11 |
| NFR-01 | US-01, US-02, US-06 through US-10 | C-07, C-09, C-10, C-12 |
| NFR-02 | US-01, US-02, US-06 through US-09 | C-09, C-10, C-12 |
| NFR-03 | US-03, US-07, US-10 | C-05, C-06, C-09, C-10 |
| NFR-04 | US-02 through US-06 | C-01 through C-09 |
| NFR-05 | US-03, US-10 | Layer boundaries and all explicit component contracts |
| NFR-06 | US-04, US-05, US-10 | C-02, C-03, C-04, C-06, C-11 test seams |
| NFR-07 | US-02, US-09, US-10 | C-05, C-09, C-11, C-12 |
| NFR-08 | US-10 | Component boundaries, version metadata, error boundary, and later infrastructure design |

## Quality Attribute Decisions

### Determinism

- All procedural variation enters through C-02.
- Effective seed, settings, strategy and version, and attempt policy version form the reproducibility boundary.
- Ambient time, unseeded randomness, and unstable iteration order are prohibited from deterministic generation.

### Responsiveness

- Generation remains synchronous by explicit decision.
- C-05 rejects workloads outside supported limits.
- C-09 yields once so a busy indicator can paint before generation.
- Concrete supported sizes and response targets must be selected and measured during NFR Requirements and NFR Design.
- If required targets cannot be achieved on the main thread, changing topology requires an approved architecture revision rather than an implicit worker or backend addition.

### Accessibility

- C-12 owns keyboard controls, programmatic labeling, status announcements, focus, diagnostics, and essential non-Canvas summaries.
- C-10 owns non-color visual distinctions and Canvas inspection controls.
- Relevant interface behavior retains the approved WCAG 2.2 AA target.

### Reliability and data safety

- Typed outcomes distinguish expected rule failures from unexpected faults.
- The previous accepted result survives failed generation.
- Local persistence follows in-memory success and cannot invalidate it.
- Restored data is untrusted, versioned, decoded defensively, and applied atomically or discarded.

### Testability

- Domain and application contracts accept immutable values and injectable dependencies.
- Generation and validation are browser-independent.
- C-11 provides an explicit serialization round-trip seam.
- Seeded failures can be replayed.
- Concrete PBT framework selection and test implementation remain later-stage responsibilities.

## Scope Enforcement

The design includes rooms, corridors, entrance, exit, settings, validation, visualization, metadata, regeneration, recovery, and exactly one latest browser-local record. It excludes loot, encounters, real-time gameplay, multiplayer, collaboration, authentication, accounts, a saved catalog, multiple-result history, cloud storage, synchronization, and a public integration API.

## Deferred to Later Stages

- Programming language, framework, build tooling, and test runner
- Property-based testing framework
- Exact generation algorithm and data structures
- Validation algorithms and diagnostic ordering
- Retry count and deterministic attempt derivation
- Numeric supported limits and response targets
- Canvas drawing library or direct Canvas API wrapper
- Local-record schema and compatibility policy
- Hosting, CI, observability, release, and infrastructure resources
- Detailed business rules and state transition specifications

## Artifact Index

- `components.md` — component purposes, responsibilities, boundaries, and coverage
- `component-methods.md` — technology-neutral signatures and contract rules
- `services.md` — orchestration, failure propagation, and consistency boundaries
- `component-dependency.md` — dependency matrix, diagrams, data flow, and prohibited couplings
- `application-design.md` — consolidated design entry point

## Extension Compliance

| Extension or rule | Status for Application Design | Rationale |
|---|---|---|
| Security Baseline | Skipped | Disabled by user selection |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | N/A | Application Design is not an enforcement stage for partial PBT. The design creates explicit seams and schedules enforcement for later applicable stages. |
| Resiliency Baseline | Skipped | Disabled by user selection |

No enabled extension has a blocking finding at this stage.
