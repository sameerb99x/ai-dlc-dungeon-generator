# Dungeon Generator Personas

## Persona Strategy

The approved plan uses one general persona for the initial product. This keeps stories centered on the shared creation journey without inventing separate roles that have not been validated. The persona spans casual exploration and deliberate configuration while remaining a single archetype.

## Persona P-01: Dungeon Creator

### Profile

The Dungeon Creator is a game designer, tabletop facilitator, level designer, or enthusiast who wants a useful dungeon layout without drawing every room and corridor manually. Their technical expertise may vary, but they interact with the product as a browser user rather than as an API consumer or system administrator.

### Context and Behaviors

- Uses a visual web application to create layouts for inspiration, planning, or later adaptation.
- May begin with defaults for a quick result, then refine constraints after inspecting the output.
- Reuses seeds and settings when a layout must be reproduced or discussed consistently.
- Judges results visually but depends on the application to guarantee connectivity and declared playability rules.
- Expects unsuccessful generation attempts to be understandable and recoverable.

### Motivations

- Reduce time spent manually constructing foundational dungeon geometry.
- Explore varied layouts quickly.
- Gain confidence that a displayed dungeon is connected and playable under selected constraints.
- Reproduce a useful layout reliably.
- Work through a clear, responsive, visually legible interface.

### Goals

- Configure a dungeon without needing to understand the generation algorithm.
- Generate a valid layout with an entrance and exit.
- Inspect rooms, corridors, blocked areas, validation status, settings, and seed.
- Adjust constraints and regenerate without losing context.
- Navigate a generated layout from entrance to exit using keyboard controls.
- Reset a play session or resume compatible progress after reload.

### Needs

- Sensible defaults and clearly labeled controls.
- Actionable validation before generation begins where possible.
- Visible loading or busy feedback during generation.
- Distinct visual treatment for map elements that does not rely on color alone.
- Keyboard-operable controls and programmatically labeled interface elements.
- Clear bounds on supported map sizes and playability settings.
- A visible character position and completion state that remain understandable during play.

### Pain Points

- Controls whose effects are unclear.
- Layouts that look acceptable but contain disconnected or unreachable regions.
- A seed that does not reproduce the same layout.
- Large maps that freeze or become difficult to inspect.
- Generation failures that discard settings or provide no corrective guidance.
- Visual distinctions that disappear for users with color-vision differences.

### Accessibility Considerations

- The complete workflow should be usable by keyboard.
- Controls and status feedback require programmatic labels and announcements where appropriate.
- Entrance, exit, walkable terrain, blocked terrain, and validation states need non-color visual distinctions.
- Responsive map inspection should accommodate zoom and constrained viewport sizes.
- Relevant story acceptance criteria retain the approved WCAG 2.2 AA target.

### Relevant Journey Stages

1. Configure generation and playability settings.
2. Resolve invalid settings.
3. Generate a dungeon.
4. Inspect the visual result and metadata.
5. Navigate the character from entrance to exit.
6. Adjust settings or reproduce a layout.
7. Recover from unsuccessful generation attempts.

### Story Mapping

| Story | Relationship to persona |
|---|---|
| US-01 | Configure a dungeon using understandable controls and defaults |
| US-02 | Correct invalid or impossible settings without losing work |
| US-03 | Generate a bounded dungeon containing required elements |
| US-04 | Reproduce a layout from its seed and settings |
| US-05 | Trust structural and playability validation |
| US-06 | Recover when bounded generation cannot find a valid result |
| US-07 | Inspect a clear and accessible visual map |
| US-08 | Inspect validation and reproducibility metadata |
| US-09 | Adjust settings and regenerate efficiently |
| US-10 | Rely on a responsive, stable, production-oriented application |
| US-11 | Navigate the playable character through the accepted dungeon |
| US-12 | Complete, reset, and resume a play session |

## Persona Scope Notes

- This persona does not represent an authenticated account holder because accounts are outside the approved scope.
- This persona may restore the single most recent local settings, result, and compatible play-session state but does not require a saved catalog, multiple-result history, collaboration, loot, encounters, enemies, combat, inventory, health, scoring, timers, multiplayer, or character customization.
- A developer or API-integrator persona is not included because the initial product is a visual web application rather than a public integration API.
