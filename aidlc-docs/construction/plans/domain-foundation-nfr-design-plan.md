# U1 Domain Foundation NFR Design Plan

## Objective

Translate U1 quality requirements into concrete logical patterns while preserving its pure, infrastructure-free domain boundary.

## Category Assessment

- Resilience: expected invalid caller data needs typed recovery; network retries, circuit breakers, and failover are not applicable.
- Scalability: no independent runtime or load boundary exists; lightweight immutable values remain the applicable pattern.
- Performance: avoid premature caching and preserve simple, predictable construction; no standalone timing target was selected.
- Security: diagnostics stay structured and safe; no secrets, authentication, or external trust boundary is owned by U1.
- Logical components: no queues, caches, databases, or other infrastructure components are appropriate.

## Execution Checklist

- [x] Analyze approved U1 NFR requirements and stack decisions.
- [x] Assess applicability of resilience, scalability, performance, security, and infrastructure patterns.
- [ ] Validate completed answers for ambiguity or contradiction.
- [ ] Define deep-immutability, typed-failure, determinism, and PBT reproducibility patterns.
- [ ] Define U1 logical components and prohibited dependencies.
- [ ] Create `nfr-design-patterns.md`.
- [ ] Create `logical-components.md`.
- [ ] Validate traceability and enabled PBT compliance, update state and audit, and present the review gate.

## Questions

## Question 1

Which deep-immutability implementation pattern should U1 use for public aggregate values?

A) Copy incoming collections during construction and recursively freeze the copied value graph; expose only readonly types and collections.

B) Use readonly TypeScript types and defensive copies at public boundaries, but do not recursively freeze at runtime.

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

How should U1 treat unexpected programming defects after expected invalid caller data has already been modeled as typed diagnostics?

A) Let them throw to the later application error boundary; never convert them into expected validation diagnostics.

B) Catch them inside U1 and return a generic typed diagnostic for every failure.

C) Other (please describe after [Answer]: tag below)

[Answer]:

## Question 3

Which property-test configuration should apply to U1's deterministic CI suite?

A) Run a documented fixed fast-check seed in CI, retain default shrinking, and require the failure report's replay path and shrunk counterexample.

B) Use a newly randomized seed for each CI run and require the seed to be logged with failures.

C) Other (please describe after [Answer]: tag below)

[Answer]:
