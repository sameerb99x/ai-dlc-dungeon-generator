# POC Components

## Dungeon Engine

Browser-independent engine that uses U1/U2 contracts to process settings, generate a deterministic playable dungeon with a small bounded attempt policy, and evaluate in-memory player movement, completion, and reset. It must not access DOM, Canvas, storage, network, or React state.

## Browser POC

One local browser screen that owns React component state, simple controls/status text, Canvas rendering, keyboard input, completion feedback, reset, and regeneration. It starts fresh on reload and must not implement generation algorithms, validation rules, or persistence.

## Boundary Rule

Browser POC depends on Dungeon Engine. Dungeon Engine depends only on U1/U2 and never depends on Browser POC.
