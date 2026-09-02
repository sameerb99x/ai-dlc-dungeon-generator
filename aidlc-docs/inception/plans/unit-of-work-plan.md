# POC One-Unit Generation Plan

## Objective

Preserve completed U1 `domain-foundation` and U2 `deterministic-random-and-settings`, and replace the remaining U3–U9 plan with one construction unit: `poc-web-app`.

`poc-web-app` contains the separate internal Dungeon Engine and Browser POC component boundaries, but they are delivered together to prioritize a working local proof of concept.

## Planning Checklist

- [x] Load approved POC requirements, stories, execution plan, and application design.
- [x] Apply the explicit user decision to use exactly one remaining unit.
- [x] Confirm story grouping: all five POC stories belong to one end-to-end local-browser experience.
- [x] Confirm dependencies: the unit depends only on completed U1 and U2 contracts; no external services or inter-unit communication exist.
- [x] Confirm team/deployment considerations are N/A: one local POC, one implementation path, no deployment boundary.
- [x] Confirm code organization: one feature-oriented `src/poc-web-app/` unit with `engine/` and `browser/` internal modules.
- [x] Validate the unit boundary and dependency direction.
- [x] Obtain approval of this one-unit plan.
- [x] Generate revised unit definitions, dependency mapping, and story mapping.
- [x] Mark superseded units and construction plans as historical.
- [x] Present the Units Generation review gate.

## No Additional Questions

The user explicitly requested a single remaining unit after approving the POC scope, execution plan, and application design. This resolves story grouping, dependency, team-alignment, technical, domain-boundary, and greenfield code-organization decisions without reopening prior choices.

## Planned Generation

1. Archive the previous production-oriented U3–U9 decomposition artifacts.
2. Generate a unit catalog showing U1 and U2 as completed dependencies and `poc-web-app` as the sole remaining unit.
3. Map all five revised POC stories to `poc-web-app`.
4. Set `poc-web-app` to Functional Design and Code Generation, skip production NFR and Infrastructure Design, then run Build and Test with a manual verification checklist.
