# U2 Technology Stack Decisions

## Inherited Stack

| Concern | Decision | U2 rationale |
|---|---|---|
| Language | TypeScript in strict mode | Preserves typed results, readonly settings contracts, and deterministic public interfaces. |
| Test runner | Vitest | Runs U2 example and property suites with the existing project configuration. |
| Property testing | fast-check | Supports constrained U2 generators, shrinking, replay seeds, and Vitest integration. |
| Browser baseline | Latest two stable desktop Chrome, Edge, and Firefox releases | Provides Web Crypto in normal supported environments and matches the approved project scope. |
| Entropy source | Direct `crypto.getRandomValues` with `Date.now` fallback inside `SettingsProcessor` | Keeps the absent-seed path small; tests mock browser globals while later draws remain deterministic. |

## U2-Specific Decisions

| Concern | Decision | Rationale |
|---|---|---|
| Supported dimensions | 10–120 per axis; ≤14,400 total tiles | Bounded browser-main-thread input envelope before U3 performance measurements. |
| U2 latency | p95 ≤20 ms on a typical current desktop browser | Keeps validation and random-source setup below visible interaction disruption. |
| Entropy fallback | Time-derived opaque seed with non-blocking `seed.entropy.fallback` metadata | Preserves generation and reproducibility on an unexpectedly limited platform while making weaker entropy visible. |
| Untrusted present values | Reject with typed diagnostics; no coercion | Prevents silent generation from altered user/restored input. |
| Absent optional values | Apply existing documented defaults | Supports usable defaults without masking malformed present data. |

## Boundary Constraints

- U2 may call Web Crypto and the clock only for the one absent-seed resolution operation. All later random draws remain deterministic plain TypeScript behavior.
- U2 must not import React, DOM rendering APIs, Canvas, storage, networking, or later-unit implementation code.
- The pseudo-random algorithm identity and implementation details are selected during U2 Code Generation planning and must become part of the generator/version reproducibility contract before implementation.

## PBT Configuration

U2 reuses the project fast-check dependency, default shrinking, fixed CI seed, and Vitest integration. Code Generation must centralize constrained arbitraries for settings, limits, seed input, random ranges, lists, and operation sequences. No new PBT framework or browser test runtime is required for this pure-logic unit.
