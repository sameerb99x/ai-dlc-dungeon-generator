# U2 NFR Requirements Clarification

## Why clarification is needed

Two selected NFR answers change approved U2 functional behavior:

- U2 currently requires cryptographically strong seed creation when no seed is supplied and treats unavailable cryptographic entropy as unexpected. The selected time-derived fallback would make that behavior weaker and needs an explicit revised policy.
- U2 currently returns typed diagnostics with no partial effective request for malformed settings. The selected default-coercion policy needs a defined outcome and boundary to avoid silently generating a dungeon from changed settings.

## Question 1

When `crypto.getRandomValues` is unavailable and no explicit seed is supplied, which revised behavior should U2 use?

A) Generate a time-derived opaque seed, return it as `resolvedSeed`, and expose a non-blocking `seed.entropy.fallback` warning in result metadata; the request otherwise succeeds.

B) Generate a time-derived opaque seed silently; the request succeeds with no warning.

C) Return a typed diagnostic requiring an explicit seed; no effective request is created.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 2

For malformed or unsupported raw settings from browser state or a future restore path, which values may U2 coerce to defaults while still creating an effective request?

A) Only absent optional settings fields; any present malformed, out-of-range, or contradictory value returns typed diagnostics and no effective request.

B) Absent optional fields and any malformed individual field with a documented default; cross-field contradictions still return diagnostics.

C) Any malformed or unsupported settings may be fully replaced by defaults, with warnings.

D) Other (please describe after `[Answer]:`)

[Answer]: A
