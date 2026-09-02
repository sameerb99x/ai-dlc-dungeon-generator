# U2 Deterministic Random and Settings NFR Design Patterns

## Deterministic Core Pattern

`RandomSource` is constructed from one resolved opaque seed and keeps sequence state private to that instance. It performs no global reads after construction. Every random operation increments one draw count, allowing a snapshot `(resolvedSeed, drawCount)` to reproduce the next state by replay. Integer selection must use an unbiased bounded mapping; shuffle uses a deterministic Fisher-Yates-style permutation without mutating its source input.

## Direct Browser Entropy Pattern

`SettingsProcessor.resolveSeed` calls `crypto.getRandomValues` directly only for blank seed input. Tests mock `crypto.getRandomValues` and `Date.now` at the global boundary. If Web Crypto is absent or its call fails, `Date.now` supplies the time-derived opaque fallback seed; U2 attaches one typed `seed.entropy.fallback` warning alongside the successful request. Explicit seeds never read Web Crypto or the clock.

## Bounded Feasibility Cache Pattern

Direct-feasibility validation uses a deterministic 128-entry least-recently-used cache. Its key contains only the settings fields that affect direct feasibility and every supported-limit field; it excludes raw seed text, resolved seed, version metadata, and warnings. A structurally different `SupportedLimits` input clears all cached entries before validation. Cache hits and misses must be behaviorally identical: same ordered diagnostics and no mutation of caller values.

The cache is an optimization only. It must not cache U3 candidate generation, U4 validation, U6 retry results, browser state, or user-visible metadata.

## Input-Containment Pattern

U2 applies defaults only when optional fields are absent. A present malformed, non-finite, out-of-range, or directly contradictory value results in a typed ordered diagnostic list and no effective request. Diagnostics remain safe structured data. Warnings are a separate successful-outcome channel and never modify `resolvedSeed` or failure diagnostics.

## Performance Verification Pattern

Implement a deterministic U2 micro-benchmark covering boundary-sized valid settings, cache miss and hit paths, and fresh random-source creation. It runs locally and in a scheduled or manually invoked performance job; normal unit-test CI uses correctness assertions rather than machine-dependent timing assertions. The benchmark checks the 20 ms p95 target on the agreed typical desktop baseline.

## PBT Execution Pattern

Property tests use centralized domain-specific arbitraries for raw settings, supported limits, seed strings, invalid individual fields, integer ranges, lists, and random-operation sequences. They assert deterministic replay, range bounds, choice membership, permutation preservation, immutable inputs, cache transparency, and direct-feasibility invariants. fast-check shrinking stays enabled, and the existing fixed CI seed plus replay reporting applies.

## Non-Applicable Patterns

No queue, worker, retry, circuit breaker, distributed cache, persistence layer, horizontal scaling, network client, or failover component applies. U2's bounded synchronous limits and local typed outcomes are the selected scalability and resilience controls.

## Extension Compliance

PBT-02 is N/A. PBT-03, PBT-07, PBT-08, and PBT-09 are incorporated through the explicit test patterns above and must be implemented during Code Generation.
