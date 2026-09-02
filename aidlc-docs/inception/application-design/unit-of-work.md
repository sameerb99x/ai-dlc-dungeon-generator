# POC Units of Work

## Completed Dependencies

| Unit | Status | Responsibility |
|---|---|---|
| U1 `domain-foundation` | Completed | Immutable dungeon domain values and typed outcomes. |
| U2 `deterministic-random-and-settings` | Completed | Seeded randomness and effective settings processing. |

## U3: poc-web-app

**Purpose**: Deliver the complete local, try-it-out browser POC in one unit.

**Internal modules**:

- `engine/`: uses U1/U2 to generate a deterministic dungeon, perform basic acceptance validation, apply bounded attempts, and evaluate play sessions.
- `browser/`: React controls and status, Canvas rendering, keyboard movement, completion feedback, reset, regeneration, and in-memory screen state.

**Owns**: FR-01 through FR-06 and NFR-01 through NFR-04 under the approved POC scope.

**Depends on**: U1 and U2 public contracts only.

**Must not own**: Browser persistence, reload restoration, hosting, deployment, release automation, monitoring, production compliance, or external services.

## Code Organization Strategy

The unit will live under `src/poc-web-app/`, with internal `engine/`, `browser/`, and local UI/style files. U1/U2 imports remain through their public boundaries. One Vite/React entry point composes the unit for local execution.

## Construction Recommendation

| Stage | Decision | Rationale |
|---|---|---|
| Functional Design | Execute | Generation/play rules and browser interactions need concise definition. |
| NFR Requirements | Skip | The local stack exists and the POC has no new production NFR target. |
| NFR Design | Skip | No NFR Requirements stage executes. |
| Infrastructure Design | Skip | No infrastructure is in scope. |
| Code Generation | Execute | The POC must be implemented. |
