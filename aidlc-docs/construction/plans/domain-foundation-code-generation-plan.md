# U1 Domain Foundation Code Generation Plan

## Objective

Bootstrap the greenfield TypeScript workspace and implement the pure domain-foundation unit: immutable value types, defensive-copy boundaries, typed diagnostics, public constructors, full-result reproducibility equality, example-based tests, and fast-check property tests. U1 must remain free of React, browser APIs, persistence, generation, validation orchestration, and infrastructure.

## Context Loaded

- Approved functional design: `aidlc-docs/construction/domain-foundation/functional-design/`
- Approved NFR requirements and stack: `aidlc-docs/construction/domain-foundation/nfr-requirements/`
- Approved NFR design: `aidlc-docs/construction/domain-foundation/nfr-design/`
- Component contract baseline: C-01 Domain Model in `aidlc-docs/inception/application-design/component-methods.md`, revised by approved U1 functional design where they differ
- Enabled partial PBT rules: PBT-03, PBT-07, PBT-08, PBT-09 (PBT-02 N/A)

## Unit Context

### Stories implemented by this unit

| Story | U1 contribution |
|---|---|
| US-03 | Bounded dungeon representation types and `createDungeon` |
| US-04 | Full-result reproducibility equality via `dungeonsEqual` |
| US-05 | Representation-level validity and diagnostic model consumed by U4 |
| US-08 | `DungeonResult`, `ValidationReport`, and version metadata types |
| US-11 | `PlaySessionState` and `createPlaySession` initial state |
| US-12 | Play-session representation used by U5 for reset and restoration validation |

### Dependencies

- **Upstream**: none — U1 is the foundation unit
- **Downstream consumers**: U2 through U9 import U1 public types and constructors only

### Public interfaces and contracts

| Export | Contract |
|---|---|
| `createCoordinate(x, y)` | Returns `Result<Coordinate, CoordinateDiagnostic>` for invalid integer input |
| `createSettings(raw)` | Returns `Result<DungeonSettings, SettingsDiagnostic[]>` |
| `createDungeon(candidate)` | Returns `Result<Dungeon, DomainDiagnostic[]>`; enforces DF-01 through DF-09 |
| `createPlaySession(dungeon)` | Returns initial session at entrance with `completed = false` |
| `dungeonsEqual(left, right)` | Compares complete immutable `DungeonResult` fields in stable order |
| Diagnostic types | Immutable, field- or rule-addressable expected-failure details |
| Domain types | Readonly TypeScript contracts with defensive-copy construction |

**Authoritative revision**: Where the earlier C-01 sketch differs, the approved U1 functional design governs — especially bottom-left `(0, 0)` coordinates, typed `createCoordinate`, and full-result `dungeonsEqual`.

### Code location (greenfield monolith, multi-unit)

| Artifact kind | Path |
|---|---|
| Application code | `src/domain-foundation/` |
| Unit tests | `tests/domain-foundation/` |
| Shared test utilities | `tests/domain-foundation/support/` |
| Root tooling | workspace root (`package.json`, `tsconfig.json`, `vitest.config.ts`) |
| Markdown code summary | `aidlc-docs/construction/domain-foundation/code/` |

Application code must never be written under `aidlc-docs/`.

## Planning Checklist

- [x] Analyze unit design artifacts, story map, dependencies, and readiness
- [x] Determine code location and exact paths for this greenfield monolith
- [x] Document explicit numbered generation steps with story traceability
- [x] Include unit context, interfaces, and PBT obligations
- [x] Save this plan as the single source of truth for U1 Code Generation
- [x] Obtain explicit user approval before Part 2 generation begins

## Generation Steps

### Step 1: Project bootstrap and import boundaries

- [x] Create root `package.json` with TypeScript, Vitest, fast-check, and Vite/React placeholders for later units without wiring UI yet
- [x] Create `tsconfig.json` with strict mode and path aliases if needed for `src/domain-foundation`
- [x] Create `vitest.config.ts` with a documented fixed PBT seed constant shared by property tests
- [x] Add npm scripts for `test`, `test:unit`, and `typecheck`
- [x] Add a minimal `.gitignore` for `node_modules`, build output, and coverage if not already present

**Stories**: enables US-04, US-05, US-10 test infrastructure  
**Verification**: scripts exist; no React or DOM imports in U1 modules

### Step 2: Core type definitions

- [x] Create `src/domain-foundation/types/` modules for coordinates, dimensions, terrain, markers, tiles, geometry, settings, constraints, candidates, dungeons, validation reports, generation requests, results, play sessions, version metadata, diagnostics, and the shared `Result` discriminant
- [x] Apply readonly TypeScript contracts to all public fields and collection types
- [x] Export a single public barrel `src/domain-foundation/index.ts`

**Stories**: US-03, US-05, US-08, US-11, US-12  
**Rules**: DF-01 through DF-04, diagnostic shape rules

### Step 3: Defensive-copy and diagnostic utilities

- [x] Implement `src/domain-foundation/internal/defensive-copy.ts` to deep-copy nested aggregate input before exposure
- [x] Implement `src/domain-foundation/internal/diagnostics.ts` with stable diagnostic codes aligned to `business-rules.md`
- [x] Ensure utilities depend only on plain TypeScript language features

**Stories**: US-05  
**NFR**: U1-NFR-01, U1-NFR-03

### Step 4: Value constructors

- [x] Implement `createCoordinate` with integer validation and typed failure
- [x] Implement `createSettings` with local value-object constraint checks
- [x] Implement tile, room, corridor, and candidate helpers required by `createDungeon`
- [x] Implement `createDungeon` enforcing rectangular grid shape, in-bounds geometry, marker counts, walkable markers, and distinct entrance/exit
- [x] Implement `createPlaySession` from a valid `Dungeon`, placing the session at the entrance with `completed = false`
- [x] Reserve exceptions for programming defects or broken internal invariants only

**Stories**: US-03, US-05, US-11, US-12  
**Rules**: DF-01 through DF-10

### Step 5: Full-result reproducibility equality

- [x] Implement `dungeonsEqual(left, right)` comparing every field of `DungeonResult` in documented stable order
- [x] Keep any layout-only helper private; do not expose it as the reproducibility verdict
- [x] Prove reflexivity, symmetry, and transitivity in tests

**Stories**: US-04, US-08  
**Rules**: DF-11

### Step 6: Example-based unit tests

- [x] Create `tests/domain-foundation/create-coordinate.test.ts`
- [x] Create `tests/domain-foundation/create-settings.test.ts`
- [x] Create `tests/domain-foundation/create-dungeon.test.ts` covering valid dungeons and representative invalid cases (grid shape, marker count, blocked markers, overlapping entrance/exit, malformed geometry)
- [x] Create `tests/domain-foundation/create-play-session.test.ts`
- [x] Create `tests/domain-foundation/dungeons-equal.test.ts` with equal and field-differing `DungeonResult` pairs
- [x] Create `tests/domain-foundation/defensive-copy.test.ts` proving source mutation after construction does not change observed values

**Stories**: US-03 through US-05, US-08, US-11, US-12  
**NFR**: U1-NFR-01 through U1-NFR-03, U1-NFR-06

### Step 7: Property-based tests and reusable generators

- [x] Create `tests/domain-foundation/support/generators.ts` with centralized fast-check arbitraries for valid coordinates, dimensions, tile grids, rooms, corridors, dungeons, results, diagnostics, and focused invalid variants that violate exactly one rule
- [x] Include boundary sizes and coordinates; retain default shrinking
- [x] Create `tests/domain-foundation/properties/invariants.test.ts` for constructor, grid, marker, immutability, equality-law, and play-session properties
- [x] Configure the property suite to use the documented fixed CI seed and emit replay information on failure

**Stories**: US-04, US-05  
**PBT**: PBT-03, PBT-07, PBT-08, PBT-09

### Step 8: Import-boundary verification

- [x] Add a test or static check ensuring `src/domain-foundation/**` imports no React, DOM, Canvas, storage, network, Vite runtime, or later-unit modules
- [x] Document the boundary in the code summary

**Stories**: indirect support for all downstream units  
**NFR**: U1-NFR-05

### Step 9: Code summary documentation

- [x] Create `aidlc-docs/construction/domain-foundation/code/code-generation-summary.md` listing created files, public exports, test coverage areas, fixed PBT seed, and deferred concerns owned by later units

**Stories**: traceability for US-03 through US-12

## Explicitly out of scope for U1

- API layer, repository layer, frontend components, database migrations, deployment artifacts, CI workflow files beyond local test scripts, serialization (U7), generation (U3), validation semantics (U4), play-session transitions (U5), application orchestration (U6), rendering (U8), and web shell wiring (U9)

## Extension compliance target

| Rule | Target |
|---|---|
| PBT-02 | N/A — no serialization boundary in U1 |
| PBT-03 | Satisfied by Step 7 invariant properties |
| PBT-07 | Satisfied by centralized generators in Step 7 |
| PBT-08 | Satisfied by fixed seed, shrinking, and failure replay in Step 7 |
| PBT-09 | Satisfied by fast-check dependency and Vitest integration in Steps 1 and 7 |
| Security Baseline | Skipped — extension disabled |
| Resiliency Baseline | Skipped — extension disabled |

## Estimated scope

- **Application files**: approximately 15–25 TypeScript modules under `src/domain-foundation/`
- **Test files**: approximately 8–12 files under `tests/domain-foundation/`
- **Root config files**: 3–4 new or updated files at workspace root
- **Documentation**: 1 markdown summary under `aidlc-docs/construction/domain-foundation/code/`

This plan is the single source of truth for U1 Code Generation Part 2. Do not begin generation until explicitly approved.
