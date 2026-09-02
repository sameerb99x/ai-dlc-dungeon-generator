# U1 Technology Stack Decisions

## Selected Stack

| Concern | Decision | Rationale |
|---|---|---|
| Primary language | TypeScript | Static contracts reinforce the immutable domain boundary and make cross-unit interfaces safer. |
| UI framework | React | Chosen for the future browser presentation layer; U1 itself must not import React. |
| Build and development tooling | Vite | Browser-focused development and a straightforward production build. |
| Unit test runner | Vitest | Fast TypeScript-friendly tests and close Vite integration. |
| Property-based testing | fast-check | Provides custom arbitraries, automatic shrinking, seed replay, and Vitest integration. |
| Browser baseline | Latest two stable desktop versions of Chrome, Edge, and Firefox | Matches the selected scope without mobile or Safari commitments. |

## PBT Configuration Decision

fast-check must be added as a development dependency before U1 Code Generation. Its default shrinking behavior must remain enabled. CI must run the property suite on every change using one fixed, documented project seed; a failing report must retain fast-check's replay information and the shrunk counterexample. Developers may run a different explicit seed locally when investigating a defect.

## Boundary Rules

- U1 contains plain TypeScript modules only: no React, DOM, Canvas, storage, network, or Vite runtime imports.
- React is introduced only by later browser-presentation and web-application units.
- Version pinning, scripts, linting, formatting, and CI files are finalized in U1 Code Generation and Build and Test.

## Deferred Decisions

Map-size limits, generation latency targets, render performance budgets, hosting, telemetry, and browser compatibility testing belong to later units. The user selected no standalone U1 timing target; U1 interfaces must nevertheless remain synchronous, bounded by caller-provided values, and independently testable.
