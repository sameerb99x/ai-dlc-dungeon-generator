# U1 Domain Foundation Logical Components

## Components

| Component | Responsibility | Allowed dependencies |
|---|---|---|
| Value constructors | Build coordinates, settings, geometry, tiles, candidates, dungeons, sessions, results, and diagnostics from caller data. | Other U1 value definitions only. |
| Defensive-copy utility | Copy nested aggregate input before a domain value is exposed. | Plain TypeScript language facilities only. |
| Domain comparison utility | Compare complete accepted results in stable field order. | U1 domain values only. |
| Diagnostic factory | Produce typed field- or rule-addressable expected-failure details. | U1 diagnostic definitions only. |
| Test generator library | Define reusable fast-check arbitraries for valid values and focused invalid variants. | U1 types and fast-check; test-only. |

## Prohibited Dependencies

U1 must not import React, React DOM, Vite runtime APIs, DOM or Canvas APIs, browser storage, networking, persistence adapters, random sources, generators, validators, application stores, or infrastructure clients. It must not introduce a queue, cache, retry policy, database, metrics client, or global mutable registry.

## Failure and Control Flow

Expected invalid data ends at the diagnostic factory and returns a failure result to the caller. Successful construction returns a value with copied input and readonly TypeScript exposure. Unexpected defects are not swallowed; they propagate to the application-level error boundary. No asynchronous flow, retry loop, or external recovery component exists in U1.

## Test Components

The test generator library is reusable across later U2 through U7 property suites where their contracts accept U1 domain values. It must include valid coordinate, tile grid, geometry, dungeon, result, and invalid-single-rule-violation generators, preserving fast-check shrinking and fixed-seed replay behavior.
