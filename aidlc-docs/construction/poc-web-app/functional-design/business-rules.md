# POC Web App Business Rules

| ID | Rule |
|---|---|
| POC-01 | Generation uses only U2's supplied seeded random source after effective settings are created. |
| POC-02 | Rooms are positive-area, axis-aligned, in bounds, and non-overlapping. |
| POC-03 | Corridors are orthogonal and connect every placed room through one spanning tree. |
| POC-04 | A candidate is displayed only when all walkable terrain is connected and entrance and exit are distinct, walkable, and mutually reachable. |
| POC-05 | Room-size and corridor-width settings guide construction; unsupported or directly contradictory input is rejected by U2. |
| POC-06 | The engine performs a small fixed deterministic attempt count; exhaustion returns a typed message and preserves browser input and any prior accepted result. |
| POC-07 | Movement accepts only four cardinal directions and advances exactly one walkable tile. |
| POC-08 | Completion is true only at the exit. Reset returns to entrance and clears completion. |
| POC-09 | Reload resets all POC state; no storage or restore behavior exists. |
| POC-10 | Keyboard movement is ignored when no accepted dungeon is displayed or when focus is in an editable control. |

## Expected Diagnostics

- Invalid or directly contradictory settings: propagate U1/U2 typed diagnostics.
- No room layout or accepted candidate within the fixed attempts: return one human-readable generation diagnostic.
- Browser POC never renders a failed candidate as a valid dungeon.
