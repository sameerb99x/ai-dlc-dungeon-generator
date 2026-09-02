# POC Application Design Plan

## Objective

Replace the production-oriented application design with two POC component boundaries built on the completed U1/U2 foundations:

- `DungeonEngine`: process settings, create a deterministic candidate, validate basic playability, apply a small bounded attempt policy, and evaluate in-memory player movement.
- `BrowserPoc`: own the one-screen controls, rendering, keyboard input, status/error messages, completion, reset, regeneration, and local dependency wiring.

## Planning Checklist

- [x] Load the approved POC requirements, revised stories, execution plan, and prior application-design artifacts.
- [x] Identify production-only responsibilities to remove: storage, restore, version metadata, release/runtime concerns, formal accessibility targets, and a separate state-store/controller layer.
- [x] Identify two POC component boundaries and their dependency direction.
- [x] Validate all answers for ambiguity or contradiction.
- [x] Generate `components.md` with POC responsibilities and exclusions.
- [x] Generate `component-methods.md` with high-level contracts.
- [x] Generate `services.md` with POC orchestration.
- [x] Generate `component-dependency.md` with communication and dependency direction.
- [x] Generate consolidated `application-design.md`.
- [x] Validate design completeness and consistency.
- [x] Present the application-design review gate.

## Proposed Design

`BrowserPoc` depends on `DungeonEngine`; neither component owns persistence or remote services. `DungeonEngine` depends only on published U1/U2 contracts and has no browser dependency. The browser component retains one in-memory screen state and directly coordinates actions rather than introducing dedicated controller, state-store, storage, or version-metadata components.

## Question 1

Which map-rendering approach should the POC application design use?

A) Canvas rendering with simple DOM controls and status text; it retains the prior renderer direction while keeping the rest of the POC lean.

B) A DOM/CSS grid; it is simpler to inspect in browser tools but may become unwieldy for larger maps.

C) Plain text or an HTML table; it is fastest to build but visually less dungeon-like.

X) Other (please describe after [Answer]: tag below)

[Answer]: A — carried forward from the approved prior Application Design decision: Canvas is the rendering boundary.

## Question 2

How should the POC hold its current screen state?

A) Keep one simple in-memory React component state object within `BrowserPoc`; page reload starts fresh.

B) Use a small dedicated in-memory state module inside `BrowserPoc`, still without persistence.

C) Keep the former standalone application state-store component.

X) Other (please describe after [Answer]: tag below)

[Answer]: A — the approved prior in-memory interaction state is retained, consolidated into BrowserPoc for the POC.
