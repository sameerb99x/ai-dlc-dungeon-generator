# POC Scope Change Questions

## Proposed change and impact

The requested POC target replaces the production-oriented end state with a local browser experience that can generate and play a maze. The proposed change preserves completed U1 and U2 as reusable core foundations, stops U3 Functional Design before creating artifacts, and supersedes U3 through U9 with two POC-oriented units:

- `dungeon-engine`: generate one deterministic dungeon candidate, validate its basic structural/playability invariants, and evaluate player movement in one in-memory session.
- `browser-poc`: present one browser screen with generation controls, an interactive maze, keyboard controls, reset/regenerate actions, and straightforward error/status feedback.

The following production-oriented scope would be removed unless you select otherwise: local-storage restoration, versioned persistence compatibility, configurable retry policy, hosting/release infrastructure, production accessibility conformance targets, and deployment/CI requirements beyond a local build and automated test command.

This is a change to a completed unit-decomposition stage. Once approved, the prior nine-unit plan will be retained as historical documentation but marked superseded; the U3 plan will be replaced before implementation, and remaining construction work will follow the new two-unit plan.

## Question 1

Which user experience must the POC support?

A) Generate a seeded maze, view it, move a player with keyboard controls, receive completion feedback, and regenerate or reset in the same browser session.

B) Generate and view a seeded maze only; no player movement or completion flow is needed.

C) Generate, view, and play a maze, plus save and restore the latest maze when the browser reloads.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2

How should the POC treat quality and verification requirements that were selected earlier?

A) Retain deterministic generation, typed expected failures, example tests, and the enabled partial property-based testing rules; relax production delivery and compliance targets.

B) Retain example tests only; disable the partial property-based testing extension for the remaining work.

C) Keep manual try-out validation only; do not require automated tests beyond the completed U1/U2 coverage.

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3

Do you approve replacing the remaining U3–U9 plan with the proposed two-unit POC plan once these answers are validated?

A) Yes — consolidate it into `dungeon-engine` and `browser-poc`, removing persistence and production delivery scope.

B) Yes — use the two-unit POC plan, but retain browser-local persistence.

C) No — keep the current unit decomposition and only relax its production-level requirements.

X) Other (please describe after [Answer]: tag below)

[Answer]: A
