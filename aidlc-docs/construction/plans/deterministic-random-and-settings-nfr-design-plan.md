# U2 Deterministic Random and Settings NFR Design Plan

## Objective

Translate the approved U2 NFR requirements into concrete logical components and implementation patterns for bounded synchronous processing, deterministic random replay, browser entropy isolation, typed input failures, and property-test execution. U2 remains a pure-logic unit except for one narrow entropy-provider seam.

## Context Loaded

- Approved U2 Functional Design and NFR Requirements
- Selected 10–120-per-axis / 14,400-tile supported envelope and U2 p95 ≤20 ms target
- Time-derived absent-seed fallback with non-blocking warning metadata
- Strict rejection of present malformed settings; defaults only for absent optional settings
- Inherited TypeScript, Vitest, fast-check, shrinking, fixed CI seed, and desktop-browser support decisions

## Design Checklist

- [x] Analyze U2 quality requirements and inherited technology decisions
- [x] Evaluate resilience, scalability, performance, security, and logical-component categories
- [x] Create NFR design plan and targeted questions
- [x] Validate answers and identify three conflicts requiring clarification
- [x] Generate NFR design patterns and logical-component artifacts
- [x] Complete the U2 NFR Design review gate

## Category Assessment

| Category | Applicability | Design decision still needed |
|---|---|---|
| Resilience | Limited | Entropy fallback and typed expected-failure containment apply; retry, circuit breaker, and failover do not. |
| Scalability | Limited | The enforced workload cap replaces horizontal scaling, queues, and caches. |
| Performance | Applicable | Need a measurement boundary and allocation-safe implementation strategy for the 20 ms target. |
| Security | Applicable | Need a narrow entropy abstraction and rules preventing raw settings from crossing into unsafe sinks. |
| Logical components | Applicable | Need explicit seams for deterministic PRNG, entropy, limits, diagnostics, and settings processing. |

## NFR Design Questions

## Question 1

How should the 20 ms U2 p95 target be verified during implementation and later CI?

A) Add a deterministic micro-benchmark that runs locally and in a scheduled/manual performance job; keep normal unit-test CI free of timing assertions.

B) Add a generous timing assertion to every normal unit-test CI run using the developer or CI machine clock.

C) Measure only manually in browser developer tools after U3 exists.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 2

How should browser entropy be isolated from the deterministic U2 core?

A) Define an injected `EntropySource` interface; production adapts Web Crypto while tests use deterministic fakes, and the time fallback is a separate injected clock source.

B) Call `crypto.getRandomValues` and `Date.now` directly in `SettingsProcessor`; tests mock globals.

C) Generate all absent seeds in the UI and pass them into U2 so U2 has no entropy seam.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 3

What resilience behavior should apply if the entropy provider fails unexpectedly (for example, it throws rather than merely reporting Web Crypto unavailable)?

A) Return a typed `seed.entropy.unavailable` diagnostic and require the user to provide an explicit seed; do not use a time fallback after an actual provider failure.

B) Treat every provider failure as equivalent to Web Crypto absence and use the time-derived fallback warning.

C) Let the exception propagate to the browser error boundary.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 4

Which performance pattern should U2 use for settings validation at the 14,400-tile envelope?

A) Scalar, fixed-order checks only: validate values and direct contradictions without allocating tiles, copying large collections, topology simulation, cache, queue, or retry state.

B) Precompute and cache feasibility tables by map dimension for faster repeated validation.

C) Delegate every feasibility check to an asynchronous worker.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 5

How should the non-blocking `seed.entropy.fallback` warning travel from U2 to later result metadata?

A) Return it as a typed warning collection alongside a successful effective request, separate from failure diagnostics.

B) Append it to the normal resolved-seed string using a textual suffix.

C) Log it only to the browser console; do not include it in application data.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Preliminary Extension Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-02 | N/A | No U2 round-trip transformation exists. |
| PBT-03 | Planned | Patterns will explicitly carry random, settings, and fallback invariants into Code Generation. |
| PBT-07 | Planned | Logical test components will centralize constrained U2 generators. |
| PBT-08 | Planned | Fixed seed, shrinking, and replay continue from U1. |
| PBT-09 | Compliant | fast-check remains the integrated project framework. |
