# Dungeon Generator POC User Stories

## Story Method

- **Persona**: P-01 Dungeon Explorer
- **Organization**: Journey-based
- **Granularity**: Five small, independently testable POC outcomes
- **Acceptance criteria**: Concise manual try-out checklists

## Journey Stage 1: Configure and Generate

### US-01: Generate a dungeon

**User story**: As a Dungeon Explorer, I want to use defaults or enter a seed and basic settings, then generate a dungeon, so that I can quickly try a new layout.

**Requirements**: FR-01, FR-02, FR-04

**Acceptance criteria**:

- [ ] The screen provides useful default settings and an optional seed.
- [ ] A generate action produces a bounded dungeon with rooms, corridors, blocked terrain, one entrance, and one exit.
- [ ] The current effective seed and basic settings are visible with the result.
- [ ] The result visibly distinguishes blocked terrain, walkable terrain, entrance, exit, and player character.

## Journey Stage 2: Recover

### US-02: Understand an unsuccessful request

**User story**: As a Dungeon Explorer, I want clear feedback when my input or a generation attempt cannot produce a playable dungeon, so that I can adjust it and try again.

**Requirements**: FR-02, FR-03, NFR-02

**Acceptance criteria**:

- [ ] Invalid settings receive an understandable message without breaking the page.
- [ ] An unsuccessful bounded generation attempt reports that no playable result was produced.
- [ ] The current input remains available for adjustment and another attempt.
- [ ] A failed attempt does not replace a visible valid result with an invalid dungeon.

## Journey Stage 3: Inspect and Reproduce

### US-03: Inspect a reproducible dungeon

**User story**: As a Dungeon Explorer, I want to see the seed and a valid route from entrance to exit, so that I can understand and reproduce a layout I like.

**Requirements**: FR-01, FR-03, FR-04

**Acceptance criteria**:

- [ ] Every displayed dungeon has one in-bounds entrance and exit connected by walkable tiles.
- [ ] Reusing the same effective seed and settings in the same application version recreates the same layout.
- [ ] The screen makes the entrance, exit, and player starting position understandable.

## Journey Stage 4: Play, Complete, and Reset

### US-04: Play a generated maze

**User story**: As a Dungeon Explorer, I want to move a character from the entrance to the exit and reset the attempt, so that I can try the generated maze directly.

**Requirements**: FR-05, FR-06

**Acceptance criteria**:

- [ ] Arrow keys and WASD move the character one walkable tile in the intended cardinal direction.
- [ ] A blocked or out-of-bounds move leaves the character in place.
- [ ] Reaching the exit displays completion feedback.
- [ ] Reset returns the character to the entrance and clears completion.

## Journey Stage 5: Regenerate

### US-05: Try another layout

**User story**: As a Dungeon Explorer, I want to regenerate without reloading the page, so that I can explore another dungeon in the same session.

**Requirements**: FR-02, FR-06

**Acceptance criteria**:

- [ ] The user can regenerate from the same screen without a page reload.
- [ ] A new successful dungeon starts the player at its entrance.
- [ ] The user can keep or change the seed and settings before regenerating.

## INVEST Verification

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable |
|---|---|---|---|---|---|---|
| US-01 | Pass | Pass | Pass | Pass | Pass | Pass |
| US-02 | Pass | Pass | Pass | Pass | Pass | Pass |
| US-03 | Pass | Pass | Pass | Pass | Pass | Pass |
| US-04 | Pass | Pass | Pass | Pass | Pass | Pass |
| US-05 | Pass | Pass | Pass | Pass | Pass | Pass |

## Scope Verification

The stories cover only the local POC’s generate-and-play journey. They do not introduce persistence, reload restoration, accounts, sharing, cloud services, deployment, release automation, production accessibility conformance, or additional automated-testing requirements.
