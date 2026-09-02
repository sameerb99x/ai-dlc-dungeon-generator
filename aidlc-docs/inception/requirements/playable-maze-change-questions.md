# Playable Maze Change Questions

The requested playable maze changes the approved scope, which currently excludes real-time gameplay. Answer every question by placing the selected letter after its `[Answer]:` tag. Select the final `Other` option if none of the listed choices fits.

## Question 1
What completes a play session in the initial version?

A) Reaching the exit displays a completion state or message

B) Reaching the exit displays completion plus the number of moves taken

C) There is no completion state; the user can freely explore the dungeon

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
How should the character move through the dungeon?

A) One grid tile at a time in the four cardinal directions, with walls and blocked tiles preventing movement

B) One grid tile at a time in eight directions, including diagonals where the path is legal

C) Smooth continuous movement with geometric collision against walls

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Which input controls should the initial web version provide?

A) Keyboard arrow keys and WASD

B) Keyboard arrow keys and WASD plus visible on-screen directional controls for pointer and touch input

C) Click or tap a reachable tile and move the character there automatically

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
How should the playable character be rendered?

A) A simple filled circle with sufficient contrast against every walkable tile

B) A circle with a directional indicator showing the last movement direction

C) A simple icon or sprite selected during visual design

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5
What exploration feedback should appear during play?

A) Show only the character's current position on the fully visible dungeon

B) Show the current position plus a visible trail of visited tiles

C) Initially hide unexplored areas and reveal them as the character moves

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
How should the player restart or switch layouts?

A) Provide a reset action that returns the character to the entrance; generating or restoring another dungeon also starts at its entrance

B) Do not provide a separate reset action; generating or restoring a dungeon starts at its entrance

C) Preserve the character position when regenerating with the same dungeon and reset only for a different dungeon

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
What should happen to play position when the application reloads the most recent locally stored dungeon?

A) Restore the character's most recent valid position and completion state

B) Restore the dungeon and settings but place the character back at the entrance

C) Disable local result restoration while a play session is in progress

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Initial Gameplay Boundary

Unless an `Other` answer explicitly expands it, this change adds navigation from entrance to exit only. It does not add enemies, encounters, combat, loot, inventory, health, scoring, timing, multiplayer, or character customization.

