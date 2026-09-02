# U2 Deterministic Random and Settings NFR Requirements

## Performance and Supported Workload

- U2 enforces dimensions from 10 through 120 tiles on each axis and no more than 14,400 total tiles. A request beyond either bound returns `settings.limit.exceeded` before generation begins.
- On a typical current desktop browser, settings processing plus fresh random-source creation must complete within 20 ms at the 95th percentile for supported input. This is measured independently from U3 candidate generation and U6 retry orchestration.
- U2 remains synchronous and allocation-bounded: it validates scalar settings, does not allocate a tile grid, and does not attempt topology simulation or candidate construction.
- The selected limits are an initial browser-main-thread envelope. U3 and U6 NFR stages must measure end-to-end candidate generation and may reduce, but must not silently increase, the limit without an approved revision.

## Reliability and Determinism

- Equal explicit effective seed, settings, generator identity/version, and ordered random operations must produce equal U2 observable outputs.
- U2 must not call ambient time or browser entropy after `resolveSeed` has returned; only the absent-seed fallback may use time, and it is explicitly marked in metadata.
- Browser cryptographic entropy is preferred for absent-seed creation. If `crypto.getRandomValues` is unavailable, U2 creates a time-derived opaque seed and emits a non-blocking `seed.entropy.fallback` metadata warning. The generated seed remains displayed and replayable.
- Unsupported browser capabilities must not cause silent substitution of an explicit seed, nondeterministic later random draws, or a partial effective request.
- A missing optional field may receive its documented default. A present malformed, out-of-range, or contradictory value returns field-addressable diagnostics and no effective request.

## Input Safety

- Treat all raw settings as untrusted, including values coming from browser controls, restoration, or a future URL/state adapter.
- Validate type, finiteness, integer requirements, supported ranges, and direct contradictions before returning an effective request.
- Diagnostics contain only safe structured text, stable codes, and field/rule identity. They do not include executable markup, secrets, or random internal state.
- U2 performs no HTML rendering, storage, network access, authentication, or secret management.

## Testability and Delivery

- Example tests must document boundary limits, the 14,400-tile cap, direct contradictions, absent optional defaults, explicit seeded replay, entropy fallback metadata, and invalid present values.
- Property tests must cover deterministic replay, bounded ranges, choice membership, shuffle permutation/input isolation, valid-setting acceptance, and invalid-settings rejection using domain-specific generators.
- fast-check remains configured with default shrinking and the documented fixed CI seed. A failure must retain fast-check replay information and the shrunk counterexample.
- U2 code remains plain TypeScript and calls Web Crypto and the clock directly only while resolving a missing seed; tests mock those globals. It inherits Vitest and fast-check integration from U1.

## Traceability

| Requirement | U2 treatment |
|---|---|
| NFR-03 | 120-by-120 / 14,400-tile supported envelope and 20 ms U2 p95 target |
| NFR-04 | deterministic explicit-seed behavior, typed failures, no silent mutation of present invalid values |
| NFR-06 | example and property-test obligations with shrinking and replay |
| NFR-07 | untrusted-input validation, safe diagnostics, no secrets or unsafe rendering |
| NFR-08 | repeatable typecheck and Vitest/fast-check checks inherited from U1 |

## Extension Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-02 | N/A | U2 owns no round-trip transformation. |
| PBT-03 | Compliant design handoff | U2 invariant properties are explicit and will be generated in Code Generation. |
| PBT-07 | Compliant design handoff | Tests require reusable structured settings, range, seed, and operation generators. |
| PBT-08 | Compliant design handoff | Fixed CI seed, shrinking, and replay are required. |
| PBT-09 | Compliant | fast-check is installed and integrated with Vitest. |
| Security Baseline | Skipped | Disabled; product-level NFR-07 controls are documented above. |
| Resiliency Baseline | Skipped | Disabled. |
