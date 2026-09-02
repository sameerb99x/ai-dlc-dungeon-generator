# POC Orchestration

## Generate

Browser POC reads controls, marks itself busy, and calls Dungeon Engine. On success it stores the result and an entrance-based session in React state, then renders Canvas. On expected failure it retains input and presents a short message.

## Play

Browser POC sends an arrow-key or WASD command to Dungeon Engine, stores the resulting session, rerenders Canvas, and shows completion feedback when the exit is reached.

## Reset and Regenerate

Reset asks Dungeon Engine for a new entrance-based session. Regeneration uses current in-memory controls. Reload discards all state; no restore flow exists.
