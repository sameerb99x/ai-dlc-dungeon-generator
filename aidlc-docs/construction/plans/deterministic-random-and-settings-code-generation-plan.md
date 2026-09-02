# U2 Deterministic Random and Settings Code Generation Plan

## Objective

Implement U2 under `src/deterministic-random-and-settings/` and tests under `tests/deterministic-random-and-settings/`. The unit will provide a deterministic seeded PRNG, typed bounded operations, snapshot replay, U2 supported-limit and feasibility processing with a 128-entry LRU cache, direct browser entropy/time fallback, separate warning metadata, and example/property tests.

## Context and Boundaries

- **Stories**: US-01, US-02, US-04, US-09
- **Upstream**: U1 public exports only
- **Downstream**: U3 consumes `RandomSource`; U6 supplies limits and versions and consumes settings outcomes
- **Out of scope**: dungeon generation, candidate validation, retries, rendering, storage, network, and UI
- **PRNG decision**: use a documented `xmur3` string hash plus `mulberry32` deterministic sequence. The algorithm identifier/version becomes part of the U2 reproducibility contract before U3 uses it.

## Public Contracts

| Export | Contract |
|---|---|
| `createRandomSource(seed)` | Fresh `RandomSource` with `nextUnit`, `nextInteger`, `choose`, `shuffle`, and `snapshot`. |
| `SupportedLimits` | Immutable 10–120 dimension and 14,400-tile workload policy shape. |
| `createSettingsProcessor()` | Isolated processor with typed `process`, `validateFeasibility`, and `resolveSeed` outcomes. |
| `SettingsProcessingOutcome` | Success contains immutable effective request plus separate warnings; failure contains typed diagnostics and no request. |

## Planning Checklist

- [x] Load U2 Functional Design, NFR Requirements, NFR Design, U1 boundary, workspace state, and enabled PBT rules
- [x] Select exact code/test locations and PRNG implementation approach
- [x] Define numbered generation steps, contracts, story traceability, and PBT obligations
- [x] Save this plan as the single source of truth for U2 Code Generation
- [x] Obtain explicit user approval before Part 2 generation begins

## Generation Steps

### Step 1: U2 types, diagnostics, and public barrel

- [x] Create U2 types for random state/diagnostics, supported limits, warning metadata, settings outcome, and processor contracts.
- [x] Confirm U1 `EffectiveGenerationRequest` already carries stable generator identity/version; no U1 type change is required.
- [x] Create `src/deterministic-random-and-settings/index.ts` as the U2 public boundary.

**Stories**: US-01, US-02, US-04

### Step 2: Deterministic random source

- [x] Implement private `xmur3`/`mulberry32` deterministic sequence and public `RandomSource` operations.
- [x] Implement inclusive integer selection, typed invalid-range/empty-choice diagnostics, immutable snapshot, and non-mutating deterministic shuffle.

**Stories**: US-04

### Step 3: Settings processor and feasibility cache

- [x] Implement defaults-for-absent-only processing, U1 construction delegation, supported-limit checks, direct contradictions, and stable diagnostic order.
- [x] Implement 128-entry deterministic LRU cache keyed by feasibility-affecting settings and limits; clear on structurally changed limits.
- [x] Implement explicit-seed trim, direct Web Crypto absent-seed generation, `Date.now` fallback, and separate typed warning metadata.

**Stories**: US-01, US-02, US-09

### Step 4: Example-based tests

- [x] Add random-source tests for deterministic replay, range bounds, choice failure, and shuffle membership/input isolation.
- [x] Add settings tests for limits, raw/effective seed distinction, and fallback warnings.

**Stories**: US-01, US-02, US-04, US-09

### Step 5: Property tests and generators

- [x] Add constrained U2 property inputs for seeds, integer ranges, and lists.
- [x] Add properties for bounded integers and shuffle preservation/input isolation.
- [x] Reuse U1 fixed PBT seed and retain fast-check shrinking/replay behavior.

**PBT**: PBT-03, PBT-07, PBT-08, PBT-09; PBT-02 N/A

### Step 6: Boundary and performance verification

- [x] Add an import-boundary check preventing U2 imports of React, rendering, storage, network, and later units.
- [x] Add a local/scheduled U2 benchmark contract script; timing measurement is deferred until the production bundle exists.

### Step 7: Code summary and verification

- [x] Run typecheck and U1/U2 test suites; fix issues within this plan's scope.
- [x] Create `aidlc-docs/construction/deterministic-random-and-settings/code/code-generation-summary.md` with files, public exports, test coverage, PBT configuration, performance script, and deferred work.

## Extension Compliance Target

| Rule | Target |
|---|---|
| PBT-02 | N/A — no inverse or serialization transformation |
| PBT-03 | Properties in Step 5 cover every documented U2 invariant |
| PBT-07 | Centralized U2 domain generators in Step 5 |
| PBT-08 | Existing fixed seed, default shrinking, and replay output |
| PBT-09 | Existing fast-check/Vitest configuration |

This plan is the single source of truth for U2 Code Generation Part 2. Do not begin implementation until explicitly approved.
