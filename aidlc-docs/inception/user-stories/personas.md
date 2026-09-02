# Dungeon Generator POC Persona

## Persona P-01: Dungeon Explorer

The Dungeon Explorer opens a local browser POC to quickly try generated dungeon layouts for inspiration or fun. They may use the defaults for a fast result or enter a seed when they want the same layout again. They are not an account holder, administrator, or API consumer.

## Goals

- Generate an understandable dungeon quickly.
- See where to start and where to finish.
- Move through the maze with the keyboard.
- Reset or generate another layout without reloading the page.

## Needs

- Simple controls with useful defaults.
- Clear feedback for invalid input or unsuccessful generation.
- A visually distinct map, entrance, exit, and player character.
- A completion message after reaching the exit.

## Scope Notes

The persona has one in-memory session only. Persistence, reload restoration, sharing, accounts, cloud storage, catalogs, and production-operational concerns are outside the POC.

## Story Mapping

| Story | Relationship |
|---|---|
| US-01 | Configures and generates a dungeon |
| US-02 | Recovers from invalid input or generation failure |
| US-03 | Inspects and reproduces a generated layout |
| US-04 | Plays, completes, and resets a maze |
| US-05 | Regenerates another dungeon in the same session |
