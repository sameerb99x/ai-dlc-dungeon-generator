# U2 Deterministic Random and Settings Business Rules

## Random Source Rules

| ID | Rule | Enforcement boundary |
|---|---|---|
| RS-01 | All procedural variation originates from an explicit `RandomSource`; generation code must not use ambient time, `Math.random`, or global mutable random state. | Random source and downstream import boundary |
| RS-02 | Equal resolved seed and equal ordered random operations produce equal observable results. | Random source |
| RS-03 | `nextUnit()` returns a finite value greater than or equal to zero and less than one. | Random source |
| RS-04 | `nextInteger(min, max)` accepts only finite integers where `min <= max`, and returns an integer in `[min, max]`. Invalid bounds produce a typed random diagnostic. | Random source |
| RS-05 | `choose(values)` returns only a member of a non-empty list and returns a typed `random.choice.empty` diagnostic for an empty list. | Random source |
| RS-06 | `shuffle(values)` returns a permutation with the same elements and length and never mutates the supplied list. | Random source |
| RS-07 | A snapshot contains the resolved seed and count of random draws consumed. Replaying a fresh source for that count reproduces the same next state. | Random source |

## Settings Rules

| ID | Rule | Enforcement boundary |
|---|---|---|
| SP-01 | U2 accepts only settings that first pass U1 representation-level construction. | Settings processor |
| SP-02 | A valid raw seed remains exactly as entered in `DungeonSettings.seedInput`, including surrounding whitespace, for editable state and result metadata. | Settings processor |
| SP-03 | A non-empty explicit effective seed is `seedInput.trim()`. It is the only seed passed to deterministic generation and recorded as `resolvedSeed`. | Settings processor |
| SP-04 | Blank or whitespace-only seed input resolves once to a cryptographically strong opaque string. If cryptographic entropy is unavailable, U2 uses a time-derived opaque seed and attaches `seed.entropy.fallback` as non-blocking result metadata. The returned effective seed must be displayed and reused for reproduction. | Settings processor |
| SP-05 | U2 rejects, rather than clamps, a value outside a supplied supported limit. | Settings processor |
| SP-06 | U2 rejects direct cross-field contradictions: minimum room width/height exceeding its maximum; selected room width/height exceeding map width/height; and corridor width exceeding either map dimension. | Settings processor |
| SP-07 | U2 does not reject a setting based on hypothetical dungeon topology, path capacity, reachability, dead-end count, or candidate acceptance. Those decisions belong to U3, U4, and U6. | Unit boundary |
| SP-08 | A successful effective request includes normalized U1 settings, resolved seed, and supplied generator identity/version. It does not include retry policy or result validation. | Settings processor |
| SP-09 | U2 applies documented defaults only for absent optional fields. Present malformed, out-of-range, or contradictory input returns a stable field-addressable diagnostic list in deterministic field order and never returns a partial effective request. | Settings processor |

## Diagnostic Rules

Diagnostics use the U1 safe structured shape: stable code, human-safe message, and affected field or rule. U2 adds the following codes during Code Generation:

| Code | Meaning | Field or rule |
|---|---|---|
| `seed.invalid` | seed input cannot be interpreted under the published input contract | `seedInput` |
| `settings.limit.exceeded` | a setting exceeds an application-supported bound | affected setting field |
| `settings.feasibility.invalid` | a direct, statically detectable cross-field contradiction exists | affected setting field and rule ID |
| `random.range.invalid` | integer bounds are non-integer, non-finite, or inverted | random range parameter |
| `random.choice.empty` | deterministic choice was requested from an empty list | `values` |

Diagnostics must not include secrets, executable markup, random-source internal state beyond the explicitly requested snapshot contract, or untrusted rendered HTML.

## PBT Compliance

| Enabled rule | Status | Evidence |
|---|---|---|
| PBT-02 Round-trip | N/A | U2 has no inverse transformation or serialization boundary. |
| PBT-03 Invariants | Compliant design handoff | RS-02 through RS-07 and SP-01 through SP-09 identify general property-test obligations. |
| PBT-07 Generator quality | Compliant design handoff | Later tests must use reusable constrained seed, settings, supported-limit, non-empty-list, operation-sequence, and invalid-single-rule-violation generators. |
| PBT-08 Shrinking and reproducibility | Compliant design handoff | Existing fast-check shrinking and fixed CI seed configuration are retained; failures must expose the framework replay data. |
| PBT-09 Framework selection | Compliant | fast-check is selected, installed, and integrated with Vitest by U1. |
