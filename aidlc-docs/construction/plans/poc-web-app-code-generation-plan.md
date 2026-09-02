# POC Web App Code Generation Plan

## Unit Context

- **Unit**: U3 `poc-web-app`
- **Stories**: US-01 through US-05
- **Dependencies**: completed U1 `domain-foundation` and U2 `deterministic-random-and-settings`
- **Code location**: `src/poc-web-app/` and browser build files at the workspace root
- **No database or external service**: all state is in memory
- **No additional automated tests**: this follows the approved POC scope; existing U1/U2 tests remain unchanged

## Execution Steps

- [x] **Step 1 — Browser toolchain**: add React, React DOM, Vite, and required TypeScript type packages; add local development and production build scripts; configure the Vite entry point.
- [x] **Step 2 — Engine contracts and generation**: implement `src/poc-web-app/engine/` for room placement, orthogonal corridors, tile-grid construction, marker selection, basic connectivity validation, and bounded deterministic attempts using U1/U2 contracts.
- [x] **Step 3 — In-memory play engine**: implement creation, cardinal movement, completion, and reset operations using accepted dungeon values.
- [x] **Step 4 — Browser state and controls**: implement React state, seed/settings inputs, generate/reset/regenerate actions, typed diagnostic messages, and stable `data-testid` values for interactive controls.
- [x] **Step 5 — Canvas presentation**: implement Canvas drawing with U1 bottom-left to Canvas top-left conversion, distinguish terrain/markers/player, and keyboard movement handling that ignores editable controls.
- [x] **Step 6 — Application entry and styling**: create `index.html`, `src/main.tsx`, application composition, and concise local styles for the single POC screen.
- [x] **Step 7 — Manual verification and code summary**: create a manual POC checklist and code summary under `aidlc-docs/construction/poc-web-app/code/`; run type checking and the existing test suite.

## Story Traceability

| Steps | Stories |
|---|---|
| 2, 4, 5, 6 | US-01 Generate a dungeon |
| 2, 4 | US-02 Understand an unsuccessful request |
| 2, 5 | US-03 Inspect a reproducible dungeon |
| 3, 4, 5 | US-04 Play a generated maze |
| 3, 4 | US-05 Try another layout |

## Single Source of Truth

Only the seven checked steps above authorize code generation for this unit. The result must remain a local, in-memory POC with no persistence, deployment, or production-only components.
