# POC Component Contracts

| Owner | Contract | Purpose |
|---|---|---|
| Dungeon Engine | `generate(rawSettings)` | Return an accepted playable dungeon or typed diagnostics. |
| Dungeon Engine | `createSession(dungeon)` | Start play at the entrance. |
| Dungeon Engine | `move(dungeon, session, direction)` | Evaluate one cardinal command. |
| Dungeon Engine | `reset(dungeon)` | Return play to the entrance. |
| Browser POC | `generateFromControls()` | Generate from current React state. |
| Browser POC | `handleMove(direction)` | Update current session from keyboard input. |
| Browser POC | `resetPlay()` | Reset the active session. |
| Browser POC | `renderDungeon(canvas, result, session)` | Draw terrain, markers, and player. |

Detailed algorithms, validation rules, settings ranges, and drawing mechanics remain Functional Design responsibilities.
