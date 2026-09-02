# U2 Deterministic Random and Settings Functional Design Plan

## Objective

Define the technology-agnostic business behavior for U2: one deterministic random source and one settings processor that converts editable settings into a bounded, reproducible effective generation request or field-addressable expected-failure diagnostics. U2 consumes only the completed U1 domain-foundation public boundary. It does not generate dungeon topology, validate candidate dungeons, own retries, render, or persist data.

## Context Loaded

- U2 definition and dependency boundary: `aidlc-docs/inception/units-generation/units.md` and `unit-dependencies.md`
- Approved requirements: FR-02, FR-03, FR-06, FR-07 and NFR-03, NFR-04, NFR-07
- Approved stories: US-01, US-02, US-04, and US-09
- Approved component contracts: C-02 `RandomSource` and C-05 `SettingsProcessor`
- Completed U1 public types, constructors, typed-result convention, immutability boundary, and fixed-seed PBT configuration
- Enabled Partial Property-Based Testing extension: PBT-02, PBT-03, PBT-07, PBT-08, and PBT-09 are blocking; PBT-01 is documented as advisory at this Functional Design stage

## Unit Boundary

### Inputs

- Raw editable settings, including dimensions, optional seed input, and playability constraints
- Supported work limits supplied by the application layer
- Immutable version metadata supplied by the application layer
- A resolved effective seed for creation of a fresh deterministic random source

### Outputs

- A reproducible sequence of bounded random values, choices, permutations, and replay snapshots
- An `EffectiveGenerationRequest` containing normalized settings, the effective seed, and generator identity/version
- Typed, field-addressable diagnostics for malformed, out-of-range, unsupported, or statically contradictory settings

### Explicit exclusions

- Dungeon candidate construction or topology generation (U3)
- Candidate structural or playability evaluation (U4)
- Generation-attempt limits and retries (U6)
- Browser parsing, DOM feedback, storage, rendering, network access, or mutable global random state

## Planning Checklist

- [x] Load U2 scope, dependencies, requirements, stories, component contracts, and the completed U1 boundary
- [x] Identify decisions that materially affect settings normalization and deterministic-random behavior
- [x] Identify PBT handoff properties and extension compliance obligations
- [x] Create the functional-design plan and focused question set
- [x] Validate every answer for ambiguity or contradiction
- [x] Create clarification questions after detecting an unresolved raw-versus-effective seed representation boundary
- [x] Produce U2 business-logic, business-rules, and domain-entities artifacts
- [x] Complete the U2 Functional Design review gate

## Proposed Functional-Design Work

1. Define U2 value concepts: supported limits, normalized settings outcome, seed representation, random state, and U2 diagnostics.
2. Define deterministic `RandomSource` behavior for unit values, inclusive integers, empty and non-empty choices, input-preserving shuffles, and snapshots.
3. Define `SettingsProcessor` parsing, defaulting, canonicalization, supported-limit checks, and feasibility checks.
4. Specify stable diagnostic codes, fields, and ordering for expected setting and random-operation failures.
5. Document testable properties for later Code Generation: deterministic replay, bounded output, permutation preservation, normalization idempotence where applicable, and feasibility invariants.
6. Record U2-to-U3/U6 contracts without designing those downstream units.

## Functional Design Questions

Please complete each `[Answer]:` field below. These choices establish U2's externally observable behavior; numeric caps and responsiveness measurements remain the next NFR Requirements decision unless selected here.

## Question 1

How should an explicit seed be represented and canonicalized for the reproducibility boundary?

A) Treat the supplied seed as a non-empty trimmed Unicode string; use the trimmed string unchanged as the displayed and effective seed.

B) Accept only a signed base-10 integer string; canonicalize equivalent forms (for example, leading zeroes) to one numeric string.

C) Accept either a trimmed arbitrary string or a signed base-10 integer string, preserving the trimmed text exactly in both cases.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 2

When a seed is absent, how should U2 create the displayed effective seed?

A) Create a cryptographically strong random opaque string once, then pass only that stored string through the deterministic generator.

B) Create a time-derived numeric seed and display it.

C) Use a fixed default seed so blank seed input always reproduces the same dungeon.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 3

What should settings normalization do with valid textual user input that is semantically equivalent but not in canonical form (for example, whitespace around a seed or numeric strings provided by a browser form)?

A) Trim and parse valid input into canonical typed values; retain only the normalized effective values in the request.

B) Preserve the raw text exactly whenever it is valid, while separately carrying parsed values for generation.

C) Reject any input that is not already in canonical form.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 4

Which pre-generation contradictions should U2 reject as infeasible before U3 attempts generation?

A) Only direct range and ordering contradictions, such as minimum room size above maximum room size or a room/corridor size larger than a map dimension.

B) Direct contradictions plus simple capacity checks, such as a requested minimum path length exceeding the maximum possible grid distance or a minimum room that cannot fit with required corridor width.

C) Attempt all configurations that pass individual field ranges; leave every cross-field feasibility decision to U3/U4.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 5

What must `RandomSource.snapshot()` expose for deterministic test replay and any later bounded-retry partitioning?

A) An opaque immutable state token that can be compared and logged, with restoration intentionally unsupported.

B) The original effective seed plus a deterministic draw count, allowing a fresh source to replay the same next value by advancing that count.

C) Full algorithm-specific internal state, allowing exact restoration without replaying prior draws.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Testable Properties and PBT Handoff

| Component | Property category | Later Code Generation requirement |
|---|---|---|
| `createRandomSource` and `snapshot` | Invariant | Equal seed and equal operation sequence produce equal observable values and snapshots. |
| `nextUnit` and `nextInteger` | Invariant | Unit values remain in `[0, 1)` and bounded integers remain in their inclusive requested range. |
| `choose` | Invariant | A successful choice is an element of the non-empty supplied collection; an empty collection returns a typed diagnostic. |
| `shuffle` | Invariant | Output is a permutation of input and the input remains unchanged. |
| `process` normalization | Idempotence, if a canonical raw representation is selected | Reprocessing normalized settings yields the same effective settings and seed behavior. |
| `validateFeasibility` | Invariant | Accepted settings satisfy each documented supported-limit and contradiction rule. |

PBT-02 is N/A for U2 because it owns no serialization, encoding, or inverse transformation. PBT-03, PBT-07, PBT-08, and PBT-09 will be blocking Code Generation obligations; custom generators must reuse U1 domain generators where applicable, preserve fast-check shrinking, and use the documented fixed CI seed.

## Extension Compliance (Current Plan)

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Advisory analysis complete | Testable properties are identified above; Partial enforcement does not make PBT-01 blocking. |
| PBT-02 | N/A | U2 has no inverse transformation or serialization boundary. |
| PBT-03 | Planned | U2 invariants are identified for later generated property tests. |
| PBT-07 | Planned | Code generation will use constrained domain-specific U2 settings and random-operation generators. |
| PBT-08 | Planned | Existing fast-check shrinking and fixed-seed replay configuration will be reused. |
| PBT-09 | Compliant | U1 selected and installed fast-check with Vitest integration. |
| Security Baseline | Skipped | Disabled in `aidlc-state.md`; NFR-07 input-validation requirements remain in scope. |
| Resiliency Baseline | Skipped | Disabled in `aidlc-state.md`. |
