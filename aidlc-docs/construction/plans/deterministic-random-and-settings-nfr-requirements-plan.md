# U2 Deterministic Random and Settings NFR Requirements Plan

## Objective

Establish U2's supported workload envelope, measurable settings-processing performance target, browser entropy dependency policy, and input-validation reliability expectations. TypeScript, Vitest, fast-check, and the desktop-browser baseline are already selected by U1 and are reused; this stage chooses U2-specific limits and quality targets without designing U3's algorithm or U6's retry policy.

## Context Loaded

- Approved U2 functional design: deterministic random source, settings processor, typed diagnostics, direct feasibility checks, and replay snapshots
- NFR-03 performance, NFR-04 determinism/correctness, NFR-07 web security fundamentals, and NFR-08 delivery requirements
- U1 stack decision: TypeScript, Vitest, fast-check, and latest two desktop Chrome/Edge/Firefox releases
- Existing PBT framework and fixed-seed/shrinking configuration

## Assessment Checklist

- [x] Analyze U2 functional design and inherited technology decisions
- [x] Identify NFR decisions that materially affect the public U2 contract
- [x] Create a focused NFR requirements plan and questions
- [x] Validate all answered decisions for ambiguity or contradiction
- [x] Create clarification questions after identifying two conflicts with the approved U2 Functional Design
- [x] Generate U2 NFR requirements and technology-stack decision artifacts
- [x] Complete the U2 NFR Requirements review gate

## Proposed Assessment

1. Select a supported map-dimension and work-limit tier that C-05 can enforce before synchronous generation.
2. Select a measurable U2 processing-time target and the device class used for later measurement.
3. Confirm the browser cryptographic entropy policy for absent-seed resolution.
4. Select the expected-failure policy when raw settings originate from restored or otherwise untrusted browser data.
5. Record inherited TypeScript, Vitest, fast-check, desktop-browser, shrinking, and replay decisions.

## NFR Questions

## Question 1

Which initial supported map-size envelope should U2 enforce while generation remains synchronous on the browser main thread?

A) 10–80 tiles per dimension and at most 6,400 tiles total; prioritize reliably immediate interaction on typical laptops.

B) 10–120 tiles per dimension and at most 14,400 tiles total; balanced desktop scope, subject to later U3 measurement.

C) 10–200 tiles per dimension and at most 40,000 tiles total; prioritize larger maps, accepting tighter algorithm budgets.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 2

What performance target should apply specifically to U2 settings processing and random-source creation under the selected supported limits on a typical current desktop browser?

A) 95th percentile at or below 5 ms; it should be effectively invisible next to generation work.

B) 95th percentile at or below 20 ms; still comfortably below a user-visible frame disruption.

C) No standalone U2 target; verify only the end-to-end generation budget after U3 exists.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 3

How should a browser platform without `crypto.getRandomValues` handle a request with no explicit seed?

A) Treat it as an unexpected unsupported-platform fault; do not substitute weak entropy, and let the application error boundary handle it.

B) Return a typed settings diagnostic asking the user to provide an explicit seed.

C) Fall back to a time-derived seed and mark the result metadata accordingly.

D) Other (please describe after `[Answer]:`)

[Answer]: C

## Question 4

When U2 receives malformed or unsupported raw settings from browser state or a future restore path, what is its responsibility?

A) Return only typed, field-addressable diagnostics; do not coerce, partially normalize, or retain an effective request.

B) Coerce recoverable values to defaults and return warnings with the effective request.

C) Throw an exception so the browser error boundary handles all malformed settings.

D) Other (please describe after `[Answer]:`)

[Answer]: B

## Preliminary Extension Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-02 | N/A | No serialization or inverse transformation belongs to U2. |
| PBT-03 | Planned | U2 invariant properties are defined and will be implemented during Code Generation. |
| PBT-07 | Planned | U2 requires constrained reusable settings, limits, seed, range, list, and operation-sequence generators. |
| PBT-08 | Planned | U1's fixed-seed fast-check configuration and shrinking behavior apply. |
| PBT-09 | Compliant | fast-check is an installed Vitest-integrated project dependency. |
| Security Baseline | Skipped | Disabled; NFR-07 remains a product requirement. |
| Resiliency Baseline | Skipped | Disabled. |
