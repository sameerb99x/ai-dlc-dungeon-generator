# POC Manual Verification

1. Run `npm run dev` and open the local URL printed by Vite.
2. Click **Generate** and confirm a Canvas dungeon, blue entrance, green exit, and red player appear.
3. Enter a seed, generate, then generate again with the same seed and settings; the layout should match.
4. Use arrow keys or WASD to move the red player. Confirm blocked moves do not change its position.
5. Reach the green exit and confirm the completion message appears.
6. Click **Reset** and confirm the player returns to the blue entrance.
7. Change an invalid dimension or incompatible setting and confirm a clear message appears without crashing the page.
8. Reload and confirm the POC starts fresh rather than restoring a result.
