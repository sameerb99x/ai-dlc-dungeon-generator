# POC Web App Business Logic Model

## Generate

1. Browser POC submits its in-memory settings to U2.
2. On a valid effective request, Dungeon Engine creates a fresh U2 random source from the resolved seed.
3. The engine samples non-overlapping rectangular rooms inside the map until a deterministic area-based target or a small placement cap is reached.
4. It connects room centers into one orthogonal spanning tree, carving L-shaped corridors with the requested corridor width.
5. It chooses entrance and exit in different rooms, preferring the farthest room centers. Walkable terrain is the union of room interiors and corridor footprints.
6. The engine accepts only candidates with a connected walkable region, distinct markers, and a route from entrance to exit. It retries a small fixed number of deterministic attempts, then returns typed diagnostics.
7. Browser POC stores an accepted dungeon and a new entrance-based session in React state and draws it on Canvas.

## Play

Arrow keys and WASD map to cardinal directions. A move succeeds only when its target coordinate is in bounds and walkable. A blocked move leaves session state unchanged. Reaching the exit sets completion. Reset creates a fresh entrance-based session for the same dungeon. Regeneration repeats the generate flow with current controls.

## Canvas Model

U1 coordinates remain bottom-left. Canvas converts domain `(x, y)` to display row `height - 1 - y`. Each tile receives a fixed scaled rectangle: blocked terrain, walkable terrain, entrance, exit, and player use visibly distinct treatments. The POC uses Canvas for map drawing and DOM controls/status for interaction feedback.
