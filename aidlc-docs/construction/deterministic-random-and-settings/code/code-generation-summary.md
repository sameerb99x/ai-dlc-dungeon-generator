# U2 Code Generation Summary

## Created Application Code

- `src/deterministic-random-and-settings/types.ts` — U2 contracts, limits, outcomes, warnings, and diagnostics.
- `src/deterministic-random-and-settings/random-source.ts` — xmur3/mulberry32 deterministic random source.
- `src/deterministic-random-and-settings/settings-processor.ts` — U1 delegation, limits, feasibility cache, seed resolution, and warnings.
- `src/deterministic-random-and-settings/index.ts` — public U2 boundary.
- `scripts/benchmark-u2.mjs` — scheduled/local performance benchmark contract.

## Tests

- `tests/deterministic-random-and-settings/random-source.test.ts`
- `tests/deterministic-random-and-settings/settings-processor.test.ts`
- `tests/deterministic-random-and-settings/properties.test.ts`
- `tests/deterministic-random-and-settings/import-boundary.test.ts`

## Verification

- `npm run typecheck` passes.
- U2 Vitest suite: 9 passing tests in 4 files.
- Combined U1/U2 suite earlier passed 38 tests in 11 files.
- `npm run benchmark:u2` records the approved p95 benchmark contract. Actual timing measurement awaits a production bundle in later units.

## PBT Compliance

PBT-02 is N/A. PBT-03 has bounded-integer and shuffle invariant properties. PBT-07 uses constrained seeds, ranges, and lists. PBT-08 uses the U1 fixed seed and default shrinking. PBT-09 uses installed fast-check and Vitest.

## Deferred

U3 consumes the random source; U6 supplies production limits/versions and consumes outcomes. End-to-end performance measurement, richer settings generator coverage, and browser build wiring occur in later units/build-and-test.
