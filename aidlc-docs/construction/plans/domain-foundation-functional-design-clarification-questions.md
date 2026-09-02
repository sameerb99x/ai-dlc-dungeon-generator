# U1 Domain Foundation Functional Design Clarifications

Two answers need clarification before the domain contract can be finalized. These choices determine whether normal invalid data follows typed recovery paths and whether a one-tile dungeon may be accepted.

## Question 1

For invalid input supplied to a public domain constructor, which failure boundary should apply?

A) Return typed diagnostics for all caller-supplied invalid data; reserve exceptions for programming defects or broken internal invariants only. This supports normal application recovery without a crash.

B) Throw a recoverable domain exception for caller-supplied invalid data; application services must catch and translate it into typed diagnostics.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2

When entrance and exit resolve to the same coordinate, which representation rule should apply?

A) Reject it during domain construction. An accepted dungeon must have distinct entrance and exit coordinates, so a fresh play session always begins incomplete.

B) Permit it as a valid representation. A fresh play session is immediately complete because completion is derived from its current coordinate.

C) Permit it as a representation but require the later structural validator to reject it before a dungeon is accepted or displayed.

D) Other (please describe after [Answer]: tag below)

[Answer]: A
