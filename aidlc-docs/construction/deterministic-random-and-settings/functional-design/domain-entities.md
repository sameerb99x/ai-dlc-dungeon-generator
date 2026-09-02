# U2 Deterministic Random and Settings Entities

## Value Entities

| Entity | Essential fields | Ownership and notes |
|---|---|---|
| `SeedInput` | raw user-entered string | U1 `DungeonSettings.seedInput` retains valid text exactly for editable settings and result metadata. |
| `ResolvedSeed` | non-empty opaque string | U2 derived seed used solely by deterministic random operations; explicit input is trimmed, missing input is cryptographically generated once. |
| `RandomState` | `resolvedSeed`, `drawCount` | Immutable replay snapshot; no algorithm-specific mutable state is exposed. |
| `SupportedLimits` | minimum/maximum map dimensions and work-related settings bounds | Application-supplied immutable policy; U2 checks it but does not select production values until NFR design. |
| `RandomDiagnostic` | U1-style diagnostic fields plus stable U2 code | Typed expected failure for invalid random-operation input. |
| `SettingsDiagnostic` | U1 structured diagnostic fields plus U2 stable codes | Typed expected failure for local, limit, or direct-feasibility failure. |

## Service Entities

| Entity | Inputs | Output | Invariants |
|---|---|---|---|
| `RandomSource` | resolved seed | deterministic random operations and snapshots | Isolated sequence; no ambient or global randomness; bounded operations return typed failures for invalid input. |
| `SettingsProcessor` | raw settings, supported limits, version metadata | `Result<EffectiveGenerationRequest, SettingsDiagnostic[]>` | Does not mutate raw input; no partial request on failure; preserves raw seed input while recording resolved seed. |

## Aggregate Relationship

`DungeonSettings` remains the U1-owned editable-settings aggregate and contains the raw seed input. U2 derives `ResolvedSeed` and creates the U1-owned `EffectiveGenerationRequest`, which combines immutable settings, resolved seed, and generator identity/version. U6 later combines the request with accepted dungeon and validation data into a `DungeonResult`.

This deliberately provides two observable seed values when whitespace is supplied:

- the raw setting for editability and result metadata; and
- the trimmed effective seed for generation and reproducibility replay.

The result view must label these distinctly if both are shown. Reproducibility comparisons use the effective request's resolved seed and full U1 result comparison semantics.

## Ownership and Lifecycle

- The UI or restore adapter supplies raw settings; it owns neither normalization nor random-state progression.
- U2 constructs a fresh random source per effective generation request and hands it to U3. U3 may consume it but must not replace it with ambient randomness.
- U2 returns settings failures to U6; U6 determines the overall generation outcome and preservation of the previous valid result.
- Supported limits, generator identity, and generator version are supplied by U6 or its configuration provider; U2 validates and carries them but does not own retry, validation, or release policy.

## Property-Test Generator Model

Later tests must centralize reusable fast-check generators for:

- trimmed and whitespace-padded explicit seed strings, blank seed input, and opaque generated seed representations;
- valid and one-rule-invalid raw settings built from U1 settings generators;
- supported limits that include minimum and maximum boundaries;
- valid integer ranges, invalid inverted/non-finite ranges, empty and non-empty lists, and operation sequences;
- snapshot seed/draw-count pairs derived from actual consumed operation sequences.

Generators must include boundary values, preserve framework shrinking, and keep the documented fixed CI seed/replay behavior.
