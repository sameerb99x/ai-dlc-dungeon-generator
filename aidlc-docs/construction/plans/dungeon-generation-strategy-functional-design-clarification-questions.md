# U3 Dungeon Generation Strategy Functional Design Clarification

Your answer to Question 5 asks for “a decent level of playability.” The design needs a precise U3 generation responsibility so it can distinguish candidate construction from U4 acceptance validation.

## Question 1

Which construction target should `DefaultDungeonGenerator` use for configured playability constraints?

A) Use the constraints as deterministic generation targets: room dimensions and corridor width must be honored; entrance and exit should be placed far apart; other constraints, including minimum path length and dead-end limits, remain U4 acceptance checks.

B) Treat every configured constraint as a hard generation requirement and return a typed diagnostic if any cannot be met during construction.

C) Apply only the geometric constraints required to build a valid candidate; do not intentionally bias marker separation or topology toward playability.

X) Other (please describe after [Answer]: tag below)

[Answer]: Anything reasonable is fine.
