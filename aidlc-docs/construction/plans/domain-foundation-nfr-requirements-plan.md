# U1 Domain Foundation NFR Requirements Plan

## Objective

Select the implementation and property-based testing stack for the shared domain layer, and establish the quality constraints that all later units inherit.

## Assessment Scope

U1 is an in-browser, in-memory domain module with no network, database, authentication, or independent deployment boundary. Its primary concerns are deterministic correctness, deep immutability, predictable performance, reusable tests, maintainability, and developer-facing diagnostics. Availability, horizontal scalability, disaster recovery, and end-user interaction requirements are not directly applicable to this unit.

## Execution Checklist

- [x] Read the approved U1 Functional Design and cross-cutting requirements.
- [x] Identify U1-applicable scalability, performance, availability, security, reliability, maintainability, usability, and testing concerns.
- [x] Identify the mandatory PBT-09 framework-selection decision.
- [x] Validate completed answers for ambiguity or contradiction.
- [x] Define U1 NFR requirements and measurable quality targets.
- [x] Select and document the primary language, build tooling, test runner, and PBT framework.
- [x] Verify partial PBT compliance and handoff constraints.
- [x] Create `nfr-requirements.md`.
- [x] Create `tech-stack-decisions.md`.
- [x] Validate traceability and extension compliance, update state and audit, and present the review gate.

## Questions

## Question 1

Which implementation and test stack should the project adopt for the browser application and U1 domain module?

A) TypeScript, Vite, Vitest, and fast-check. This offers strict domain typing, browser-focused development, fast unit testing, and PBT generators, shrinking, and replay support.

B) JavaScript, Vite, Vitest, and fast-check. This minimizes type-system overhead but relies more on runtime validation.

C) TypeScript with a React-based browser UI, Vite, Vitest, and fast-check. This adds a component framework before the presentation unit.

D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2

What browser support baseline should guide U1 language and build configuration?

A) Current evergreen desktop and mobile browsers (latest two stable versions of Chrome, Edge, Firefox, and Safari).

B) Modern desktop browsers only (latest two stable versions of Chrome, Edge, and Firefox).

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3

Which domain-layer performance target should be enforced before its interfaces are accepted?

A) Construction, equality comparison, and defensive copying of an individual supported-size domain value complete synchronously within 16 ms under normal development hardware; exact maximum dimensions are finalized by U2.

B) No explicit U1 timing target; only correctness and deterministic behavior are required until full generation benchmarks exist.

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4

How should property-based tests record replay information during local runs and CI?

A) Use framework-provided shrinking and seed replay, and configure test output to print the replay path or seed for every failure; CI runs the PBT suite on every change.

B) Use a fixed project seed in CI and framework-provided shrinking; developers choose local seeds as needed.

C) Other (please describe after [Answer]: tag below)

[Answer]: B
