# U1 Domain Foundation Functional Design Plan

## Objective

Define the technology-agnostic domain model for immutable dungeon data, representation-level constructors, typed diagnostics, play-session data, and structural equality. This unit is the shared foundation for all later units; it must not generate, validate full dungeon rules, render, persist, or orchestrate application flows.

## Context Loaded

- Approved requirements, especially FR-01 through FR-06, FR-09, FR-11, FR-12, and NFR-04 through NFR-06.
- Approved C-01 Domain Model contracts and its dependency boundaries.
- U1 unit definition and dependency position.
- Enabled partial Property-Based Testing rules: PBT-02, PBT-03, PBT-07, PBT-08, and PBT-09.

## Execution Checklist

- [x] Analyze U1 responsibilities, dependencies, assigned requirements, and assigned stories.
- [x] Identify unresolved domain-model decisions that affect later generation, validation, play-session, and persistence units.
- [x] Validate the completed answers below for ambiguity or contradiction.
- [x] Define domain entities, ownership, and immutable relationships.
- [x] Define representation-level business rules and typed diagnostic categories.
- [x] Define structural equality semantics and testable properties.
- [x] Document PBT handoff requirements for later Code Generation.
- [x] Create `business-logic-model.md`.
- [x] Create `business-rules.md`.
- [x] Create `domain-entities.md`.
- [x] Validate artifact consistency, requirement traceability, and enabled-extension compliance.
- [x] Update state and audit records, then present the Functional Design review gate.

## Questions

## Question 1

Which coordinate convention should the domain model publish for all map-facing units?

A) Zero-based integer coordinates, with `(0, 0)` at the top-left and `x` increasing rightward and `y` downward.

B) One-based integer coordinates, with `(1, 1)` at the top-left and `x` increasing rightward and `y` downward.

C) Other (please describe after [Answer]: tag below)

[Answer]: Other — use zero-based integer coordinates with `(0, 0)` at the bottom-left; `x` increases rightward and `y` increases upward.

## Question 2

How should the domain distinguish walkability from the entrance and exit markers?

A) A tile has independent terrain (`walkable` or `blocked`) and optional marker (`none`, `entrance`, or `exit`), so entrance and exit remain walkable terrain.

B) One exclusive tile-kind enum represents all states (`blocked`, `floor`, `entrance`, `exit`), with walkability derived from the kind.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

What must `dungeonsEqual` compare when verifying seeded reproducibility?

A) Layout content only: dimensions, tile terrain and markers, rooms, corridors, entrance, and exit; ignore diagnostics, validation reports, and version metadata.

B) The full accepted result: layout content plus effective settings, validation report, and all version metadata.

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4

What should a representation-level constructor do when it receives invalid input, such as non-integer dimensions, duplicate markers, or malformed room bounds?

A) Return typed, field- or rule-addressable diagnostics and construct no partial domain value.

B) Throw a domain exception for invalid input and leave typed diagnostics to later validation units.

C) Other (please describe after [Answer]: tag below)

[Answer]: B - but it shouldn't crash the application entirely.

## Question 5

Which immutability guarantee should the U1 public boundary provide?

A) Deep immutability: values and nested collections cannot be changed through public references after construction.

B) Shallow immutability: top-level fields cannot be replaced, but callers must treat nested collections as read-only by convention.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6

How should a newly constructed `PlaySessionState` represent completion at the entrance when an unusual valid dungeon has entrance and exit on the same coordinate?

A) Completion is derived from the position, so the initial session is complete if entrance equals exit.

B) A new session always starts incomplete; completion changes only after an accepted movement command.

C) Reject any dungeon representation where entrance and exit share a coordinate.

D) Other (please describe after [Answer]: tag below)

[Answer]: A - But the validation step should have caught this issue already.

## Expected Functional-Design Decisions

After answers are validated, the design will define coordinates, terrain and markers, map bounds, rooms, corridors, dungeon candidates, accepted results, version metadata, diagnostics, and play-session state. It will also identify reusable domain-specific generators and properties for subsequent code generation, including constructor invariants and equality consistency. Serialization round trips are not owned by U1 and remain assigned to U7.
