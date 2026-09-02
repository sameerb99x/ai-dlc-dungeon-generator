# POC Web App Entities

| Entity | Ownership | POC role |
|---|---|---|
| Effective generation request | U2 | Immutable settings and resolved seed for one generation call. |
| Dungeon candidate and dungeon | U1 plus Dungeon Engine | Candidate geometry becomes an accepted dungeon only after basic acceptance. |
| Play session state | U1 plus Dungeon Engine | Current coordinate and completion flag. |
| Generation outcome | Dungeon Engine | Accepted dungeon/session seed data or typed diagnostics. |
| Browser screen state | Browser POC | Editable settings, current result, session, busy flag, and status message; in memory only. |
| Direction | Browser POC and Dungeon Engine | One of north, south, east, or west. |

## Relationships

Browser screen state owns an optional accepted result and its session. A new accepted dungeon atomically replaces both result and session. A failed generation updates only the status/diagnostics. Canvas consumes the current immutable dungeon and session; it never changes domain state.

## Manual Verification Handoff

Later Build and Test instructions will verify: seeded reproduction, visible markers, a navigable route, blocked moves, completion, reset, regeneration, invalid settings feedback, and fresh state after reload.
