# Dungeon Generator User Stories

## Story Method

- **Persona**: P-01 Dungeon Creator
- **Organization**: User journey-based
- **Granularity**: Balanced, independently testable outcomes
- **Acceptance criteria**: Concise verification checklists
- **Accessibility treatment**: Acceptance criteria within every relevant interaction and visualization story

## Journey Stage 1: Configure

### US-01: Configure a dungeon

**User story**: As a Dungeon Creator, I want to configure dungeon generation and playability settings with useful defaults so that I can request a layout matching my intended scale and style.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-02, NFR-01, NFR-02

**Acceptance criteria**:

- [ ] The interface exposes map dimensions, random seed, minimum entrance-to-exit path length, minimum and maximum room dimensions, corridor width, and permitted dead-end amount or proportion.
- [ ] Every setting starts with a usable default that forms a valid configuration.
- [ ] Each control communicates its purpose, accepted range, and effective value.
- [ ] The complete configuration flow is keyboard operable.
- [ ] Every control has a programmatic label and an accessible error association.
- [ ] Focus indication and control presentation meet the approved WCAG 2.2 AA target for applicable interface elements.

### US-02: Correct invalid settings

**User story**: As a Dungeon Creator, I want invalid or impossible settings explained before generation so that I can correct them without losing my work.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-02, FR-07, NFR-01, NFR-02, NFR-04, NFR-07

**Acceptance criteria**:

- [ ] Values outside supported ranges are rejected with field-specific, actionable feedback.
- [ ] Detectable contradictions, including room limits that cannot fit the map and impossible playability combinations, are rejected before generation.
- [ ] Malformed settings restored from a URL, browser state, or future serialized format are rejected safely.
- [ ] Correcting an invalid value does not clear unrelated settings.
- [ ] Errors are programmatically associated with their controls and can be reached and understood through keyboard navigation.
- [ ] Error meaning does not depend on color alone.
- [ ] User-provided values are validated and rendered without executable markup or unsafe interpolation.

## Journey Stage 2: Generate

### US-03: Generate a bounded dungeon

**User story**: As a Dungeon Creator, I want to generate a bounded two-dimensional dungeon so that I receive a usable foundation of rooms and corridors with a clear start and destination.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-01, NFR-03, NFR-04, NFR-05

**Acceptance criteria**:

- [ ] A successful result contains rooms, corridors, walkable and non-walkable space, exactly one entrance, and exactly one exit.
- [ ] Every tile lies within the configured width and height.
- [ ] Generation uses only the effective seed and explicit settings as sources of procedural variation.
- [ ] The interface shows a busy or progress state whenever generation is not effectively immediate.
- [ ] Generation at the maximum supported map size does not leave the interface indefinitely unresponsive.
- [ ] Dungeon generation can be exercised independently of browser rendering in automated tests.

### US-04: Reproduce a dungeon

**User story**: As a Dungeon Creator, I want a seed and settings to reproduce the same dungeon so that I can return to or consistently discuss a useful layout.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-03, FR-09, NFR-04, NFR-06

**Acceptance criteria**:

- [ ] The user can supply an explicit seed before generation.
- [ ] When no seed is supplied, the application chooses one and exposes it with the result.
- [ ] Identical seed, settings, generator version, and application version produce a structurally identical dungeon.
- [ ] Reproducibility does not depend on ambient time, unseeded randomness, or unstable iteration order.
- [ ] Automated property-based tests exercise reproducibility over domain-valid generated settings and seeds.
- [ ] If settings or dungeon data gains a serialization and deserialization pair, a generated-input round-trip property test verifies equivalence.

### US-05: Receive a validated playable layout

**User story**: As a Dungeon Creator, I want every accepted dungeon checked against structural and playability rules so that I can trust the displayed result.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-05, FR-06, NFR-04, NFR-06

**Acceptance criteria**:

- [ ] Every walkable tile belongs to one connected walkable region.
- [ ] Exactly one entrance and one exit exist and a walkable path connects them.
- [ ] Every tile remains inside the configured bounds.
- [ ] The shortest valid entrance-to-exit path meets the configured minimum.
- [ ] Every room satisfies configured minimum and maximum dimensions.
- [ ] Corridors satisfy the configured width rule.
- [ ] The dungeon does not exceed the configured dead-end amount or proportion.
- [ ] A candidate failing any enabled rule is never marked or presented as valid.
- [ ] Property-based tests verify these invariants using reusable domain-specific generators that include boundaries and structurally valid settings.
- [ ] Property-based failures shrink to a minimal counterexample and report a replayable seed.

### US-06: Recover from exhausted generation

**User story**: As a Dungeon Creator, I want clear recovery guidance when generation cannot satisfy my constraints so that I can adjust settings and try again.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-07, NFR-01, NFR-02, NFR-04

**Acceptance criteria**:

- [ ] Generation stops after a documented bounded attempt limit rather than retrying indefinitely.
- [ ] The application explains that no valid result was found and identifies relevant constraints where diagnostic information is available.
- [ ] The user's current settings remain intact and editable.
- [ ] A previous valid result is not corrupted or silently replaced by a failed candidate.
- [ ] The user can retry after adjusting settings without reloading the page.
- [ ] Failure status and recovery controls are keyboard accessible, programmatically conveyed, and not distinguished by color alone.

## Journey Stage 3: Inspect

### US-07: Inspect the visual dungeon

**User story**: As a Dungeon Creator, I want a clear and accessible visual map so that I can understand the dungeon's layout and navigate its important features.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-04, NFR-01, NFR-02, NFR-03

**Acceptance criteria**:

- [ ] Rooms, corridors, non-walkable areas, entrance, and exit are visually distinguishable.
- [ ] Entrance, exit, terrain, and validation distinctions do not rely on color alone.
- [ ] The map remains inspectable across supported viewport and map sizes through responsive sizing, scrolling, zooming, or the design-selected equivalent.
- [ ] Map inspection controls are keyboard operable and programmatically labeled.
- [ ] Applicable visual contrast, focus, and control behavior meet the approved WCAG 2.2 AA target.
- [ ] Rendering a valid map at the maximum supported size remains within the measurable responsiveness target selected during design.

### US-08: Inspect generation metadata

**User story**: As a Dungeon Creator, I want to see how a dungeon was produced and validated so that I can understand and reproduce the result.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-09, NFR-01, NFR-02

**Acceptance criteria**:

- [ ] A valid result displays its effective seed and effective generation settings.
- [ ] The result displays a clear overall validation status and the enabled playability constraints.
- [ ] Generator, format, or application version information needed to explain the reproducibility boundary is available.
- [ ] Metadata remains associated with the currently displayed result when settings are subsequently edited.
- [ ] Metadata and validation status are accessible by keyboard and assistive technology and do not communicate meaning by color alone.

## Journey Stage 4: Adjust

### US-09: Adjust and regenerate

**User story**: As a Dungeon Creator, I want to adjust settings and generate another dungeon without reloading so that I can explore alternatives efficiently.

**Persona**: P-01 Dungeon Creator

**Requirements**: FR-08, NFR-01, NFR-02

**Acceptance criteria**:

- [ ] The user can retain all current settings and request another generation.
- [ ] The user can change one or more settings without unrelated values resetting.
- [ ] The user can intentionally retain a seed for reproduction or request a newly selected seed for variation.
- [ ] Regeneration does not require a page reload.
- [ ] The previous valid result remains understandable until a new valid result replaces it or the design presents an explicit transition state.
- [ ] Regeneration controls and status changes are keyboard operable and programmatically conveyed.

## Journey Stage 5: Rely on the Product

### US-10: Use a stable and responsive application

**User story**: As a Dungeon Creator, I want the application to behave consistently and recover cleanly so that I can rely on it for repeated dungeon-creation sessions.

**Persona**: P-01 Dungeon Creator

**Requirements**: NFR-03, NFR-05, NFR-06, NFR-07, NFR-08

**Acceptance criteria**:

- [ ] Supported map-size limits and measurable generation and rendering response targets are documented and verified after stack selection.
- [ ] Generation, validation, presentation, and web interaction have documented, testable boundaries.
- [ ] Repeatable commands run formatting, static analysis or type checking, example-based tests, and enabled property-based tests.
- [ ] The selected property-based framework supports custom domain generators, automatic shrinking, replayable seeds, and the primary test runner.
- [ ] CI runs property-based tests and logs the seed and minimal failing input when a property fails.
- [ ] Critical workflows have explicit example-based tests in addition to applicable property-based tests.
- [ ] Runtime failures preserve the current user context where safe and provide useful diagnostics without exposing secrets or sensitive environment data.
- [ ] Browser-delivered code contains no secrets, and release checks identify known critical dependency vulnerabilities.

## INVEST Verification

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable | Verification note |
|---|---|---|---|---|---|---|---|
| US-01 | Pass | Pass | Pass | Pass | Pass | Pass | One configuration outcome with bounded controls |
| US-02 | Pass | Pass | Pass | Pass | Pass | Pass | One pre-generation recovery outcome |
| US-03 | Pass | Pass | Pass | Pass | Pass | Pass | One generation outcome; renderer and validator can be substituted during testing |
| US-04 | Pass | Pass | Pass | Pass | Pass | Pass | One reproducibility outcome with exact observable behavior |
| US-05 | Pass | Pass | Pass | Pass | Pass | Pass | One acceptance-validation outcome across a cohesive rule set |
| US-06 | Pass | Pass | Pass | Pass | Pass | Pass | One bounded-attempt recovery outcome |
| US-07 | Pass | Pass | Pass | Pass | Pass | Pass | One visual inspection outcome |
| US-08 | Pass | Pass | Pass | Pass | Pass | Pass | One result-metadata inspection outcome |
| US-09 | Pass | Pass | Pass | Pass | Pass | Pass | One in-session regeneration outcome |
| US-10 | Pass | Pass | Pass | Pass | Pass | Pass | One release-confidence outcome; concrete stack and architecture choices remain negotiable |

All stories describe user value without prescribing the generation algorithm, rendering library, framework, deployment topology, or implementation sequence. Each can be verified through its own acceptance criteria and estimated once the design stage selects the relevant technical boundaries.

## Scope Verification

The story set preserves the approved exclusions. It does not introduce loot, encounters, real-time gameplay, multiplayer, collaboration, user authentication, accounts, persistent dungeon storage, or a hosted dungeon catalog. References to future serialization concern safe restoration and reproducibility testing only; they do not add persistence to the initial product.

## Extension Compliance

| Extension or rule | Status for User Stories | Rationale |
|---|---|---|
| Security Baseline | Skipped | Disabled by user selection |
| PBT-02 Round Trips | N/A | Not directly enforced during User Stories; future serialization behavior is carried into US-04 acceptance criteria |
| PBT-03 Invariants | N/A | Not directly enforced during User Stories; generation and validation invariants are carried into US-04 and US-05 acceptance criteria |
| PBT-07 Generator Quality | N/A | Not directly enforced during User Stories; domain-specific generator expectations are carried into US-05 |
| PBT-08 Shrinking and Reproducibility | N/A | Not directly enforced during User Stories; shrinking, failure seeds, and CI behavior are carried into US-05 and US-10 |
| PBT-09 Framework Selection | N/A | Not directly enforced during User Stories; framework capability requirements are carried into US-10 |
| Resiliency Baseline | Skipped | Disabled by user selection |

No enabled extension has a blocking finding at this stage.
