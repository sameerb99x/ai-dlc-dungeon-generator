# U2 Deterministic Random and Settings Business Logic Model

## Purpose and Boundary

U2 converts raw editable settings into an immutable effective request and exposes all procedural variation through a fresh deterministic random source. It consumes U1 public values and typed-result conventions. It does not create a dungeon candidate, decide candidate validity, perform retry policy, render, persist, access browser state, or use mutable global randomness.

## Settings Processing Flow

1. The caller supplies raw settings, supported limits, and immutable version metadata.
2. U2 delegates positive-integer and local constraint construction to U1 `createSettings` and aggregates any typed settings diagnostics.
3. U2 preserves valid raw settings text for editable state and result metadata. In particular, `DungeonSettings.seedInput` retains the exact valid user-entered seed text, including surrounding whitespace.
4. U2 derives the deterministic seed by trimming `seedInput`. A non-empty trimmed string is the seed passed to `RandomSource`; it is carried as `resolvedSeed` in the effective request. Result presentation may show both the raw entered setting and the effective seed so the distinction is explicit.
5. If `seedInput` is blank or whitespace-only, U2 creates one cryptographically strong opaque seed string, records it as `resolvedSeed`, and returns it to the caller for display and later reproduction. If browser cryptographic entropy is unavailable, it uses a time-derived opaque seed and attaches a non-blocking `seed.entropy.fallback` warning to result metadata. The random source consumes no ambient entropy after this one resolution step.
6. U2 rejects values outside the application-supplied supported limits and direct contradictions: min room width or height above its maximum, any selected room dimension or corridor width larger than the map dimension, and any locally invalid value. It deliberately does not attempt path-capacity analysis or general topology feasibility; U3/U4/U6 own those concerns.
7. On success, U2 returns an `EffectiveGenerationRequest` made from immutable settings, resolved seed, and generator identity/version from supplied metadata. On expected failure, it returns stable field-addressable diagnostics and no partial request.

## Random Source Flow

1. `createRandomSource(resolvedSeed)` creates a new isolated sequence. Equal effective seed plus equal sequence of U2 operations produces equal observable outputs.
2. `nextUnit()` returns one value in the half-open interval `[0, 1)`.
3. `nextInteger(minInclusive, maxInclusive)` rejects an inverted or non-integer range with a typed random diagnostic; otherwise it returns a value in the inclusive range without relying on ambient randomness.
4. `choose(values)` returns a deterministic member of a non-empty input list; an empty input produces a typed diagnostic.
5. `shuffle(values)` returns a deterministic permutation and never mutates the supplied list.
6. `snapshot()` returns an immutable pair of the resolved seed and draw count. A later consumer can recreate a fresh source and advance it by the recorded draw count to reproduce the next operation. Snapshot is an observable replay contract, not permission to expose implementation-specific mutable state.

## Expected-Failure Boundary

Expected malformed, unsupported, out-of-range, contradictory, empty-choice, or invalid-range input returns typed diagnostics. Errors from a violated internal invariant are unexpected programming failures and propagate to the later browser error boundary. U2 never silently substitutes a different explicit seed or clamps a present invalid user value; it applies documented defaults only for absent optional fields.

## Testable Properties

| Area | Property category | Property to carry into Code Generation |
|---|---|---|
| Random construction and snapshot replay | Invariant | Equal seed and operation sequence yield equal values and snapshots; recreating from snapshot seed and advancing its draw count reaches the same next observable state. |
| Bounded random operations | Invariant | Unit values are in `[0, 1)`; integer values are in the requested inclusive interval; successful choices belong to their supplied lists. |
| Shuffle | Invariant | A shuffle preserves list length and element multiset while leaving its input unchanged. |
| Settings processing | Invariant | Every successful request satisfies U1 local settings rules, supplied limits, and direct contradiction rules. |
| Settings processing | Idempotence | Reprocessing the same valid raw settings, limits, and versions with a supplied explicit seed produces equal effective settings and resolved seed. Missing-seed resolution is intentionally not idempotent because it creates a new seed per request. |

PBT-02 is N/A: U2 has no serialization, parser/formatter inverse pair, encoding/decoding pair, or other logical inverse. U2 has no stateful component: each random source owns private sequence state, but no shared store or command-driven state machine is exposed; Partial enforcement treats PBT-06 as advisory.

## Traceability

This model supports FR-02, FR-03, FR-06, FR-07, NFR-03, NFR-04, NFR-07, and U2 contributions to US-01, US-02, US-04, and US-09.
