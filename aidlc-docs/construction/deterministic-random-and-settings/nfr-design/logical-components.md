# U2 Deterministic Random and Settings Logical Components

| Component | Responsibility | Allowed dependencies |
|---|---|---|
| `SettingsProcessor` | Coordinates U1 construction, defaults for absent optional fields, limits, direct feasibility, seed resolution, warnings, and effective request assembly. | U1 public boundary, U2 components, direct Web Crypto/clock only in missing-seed path. |
| `RandomSource` | Produces deterministic unit values, inclusive integers, choices, shuffles, and snapshots. | Plain TypeScript and private PRNG implementation only. |
| Feasibility evaluator | Performs fixed-order direct contradiction and supported-limit checks. | U1 settings plus `SupportedLimits`. |
| Bounded LRU cache | Stores feasibility outcomes under the approved key and clears on structurally changed limits. | Private feasibility key/value types only. |
| Diagnostic/warning factory | Produces typed expected failures and `seed.entropy.fallback` success warnings. | U1 result/diagnostic types and U2 codes only. |
| Benchmark/test support | Provides reusable U2 arbitraries, global mocks, and micro-benchmark inputs. | fast-check, Vitest, U1/U2 public types; test-only. |

## Control Flow

1. `SettingsProcessor` receives raw settings, limits, and versions.
2. It applies only absent-field defaults and asks U1 to build local settings.
3. It checks or refreshes the bounded cache for direct feasibility.
4. It resolves the seed: explicit trim, Web Crypto, or time fallback plus independent warning.
5. It returns a complete effective request with warnings, or typed diagnostics with no request.
6. A caller creates `RandomSource` from the exact `resolvedSeed`; U3 later consumes this instance.

## Boundary and Failure Rules

- Caches never influence resolved seed, raw editable seed, version metadata, diagnostics order, or warning presence.
- Web Crypto and the clock are mocked in tests but do not appear in `RandomSource`.
- Expected invalid values remain typed outcomes. The selected fallback converts absent Web Crypto or a Web Crypto call failure into a successful request with warning metadata.
- No component may render diagnostics, persist settings, create dungeon topology, validate a candidate, or own retry policy.

## Test Components

Tests include example suites for limits, present invalid input, absent defaults, direct entropy and fallback warnings, LRU capacity/eviction, and limit-change cache clearing. Property suites prove cache transparency, deterministic sequence and snapshot replay, bounded operations, shuffle invariants, and structured settings acceptance/rejection using reusable constrained generators.
