# Units Generation Plan

## Objective

Decompose the approved application design into independently implementable, testable units with explicit dependencies, traceability, and per-unit construction recommendations.

## Source Artifacts

- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/user-stories/stories.md`
- `aidlc-docs/inception/user-stories/personas.md`
- `aidlc-docs/inception/application-design/application-design.md`
- `aidlc-docs/inception/application-design/components.md`
- `aidlc-docs/inception/application-design/component-methods.md`
- `aidlc-docs/inception/application-design/services.md`
- `aidlc-docs/inception/application-design/component-dependency.md`
- `aidlc-docs/inception/plans/execution-plan.md`

## Planning Progress

- [x] Confirm that multiple units are required for this system.
- [x] Map application components to cohesive unit boundaries.
- [x] Define unit dependency order and parallelization boundaries.
- [x] Map requirements, stories, and components to each unit.
- [x] Recommend construction-stage depth per unit.
- [x] Validate Markdown structure and dependency diagram syntax.
- [x] Record extension compliance for Units Generation.
- [x] Update AI-DLC state and audit records.

## Decomposition Rationale

The approved design has thirteen components across domain, application, and browser layers with clear dependency direction and separable test seams. A single unit would hide independent generation, validation, play-session, persistence, and presentation boundaries. Nine units preserve those seams while avoiding over-fragmentation of tiny adapters.

## Unit Summary

| Unit | Primary responsibility | Components |
|---|---|---|
| U1 `domain-foundation` | Immutable domain types and constructors | C-01 |
| U2 `deterministic-random-and-settings` | Seeded randomness and settings normalization | C-02, C-05 |
| U3 `dungeon-generation-strategy` | Replaceable candidate generation | C-03 |
| U4 `dungeon-validator` | Structural and playability validation | C-04 |
| U5 `play-session-evaluator` | Cardinal movement, completion, reset, restore validation | C-13 |
| U6 `application-core` | Generation orchestration, state store, version metadata | C-06, C-07, C-08 |
| U7 `browser-local-storage` | One-record local persistence and round-trip seam | C-11 |
| U8 `browser-presentation` | Canvas rendering and accessible DOM view | C-10, C-12 |
| U9 `web-application` | Controller, bootstrap, and application shell | C-09 |

## Approved-Plan Execution Checklist

- [x] Read approved application design and execution plan.
- [x] Generate `aidlc-docs/inception/units-generation/units.md`.
- [x] Generate `aidlc-docs/inception/units-generation/unit-dependencies.md`.
- [x] Map every approved requirement and story to at least one unit.
- [x] Map every application component to exactly one primary unit.
- [x] Define implementation order and note safe parallel work.
- [x] Recommend Functional Design, NFR Requirements, NFR Design, and Infrastructure Design depth per unit.
- [x] Validate content structure and Mermaid syntax.
- [x] Record extension compliance summary.
- [x] Update `aidlc-docs/aidlc-state.md` and `aidlc-docs/audit.md`.
- [x] Present generated units for explicit approval.

## Extension Compliance

| Extension or rule | Status for Units Generation | Rationale |
|---|---|---|
| Security Baseline | Skipped | Disabled by user selection |
| PBT-02 through PBT-09 | N/A | Units Generation schedules PBT enforcement in later applicable construction stages; unit boundaries preserve required test seams |
| Resiliency Baseline | Skipped | Disabled by user selection |

No enabled extension has a blocking finding at this stage.
