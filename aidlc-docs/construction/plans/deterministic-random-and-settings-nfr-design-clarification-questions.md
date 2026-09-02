# U2 NFR Design Clarification

## Why clarification is needed

Three selected answers conflict with prior approved U2 NFR requirements:

- Direct Web Crypto and clock calls conflict with the approved narrow entropy-provider seam and testable browser-API isolation.
- A feasibility cache conflicts with the approved allocation-bounded scalar validation behavior and is unnecessary at the selected input size.
- Adding warning text to the resolved seed would change the reproducibility input rather than carry independent metadata.

## Question 1

Which entropy implementation boundary should U2 use?

A) Use the approved injected `EntropySource` and separate clock source, keeping browser calls outside `SettingsProcessor` and tests deterministic.

B) Revise the U2 NFR requirements to permit direct `crypto.getRandomValues` and `Date.now` calls in `SettingsProcessor` with global mocks in tests.

C) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 2

Which validation performance pattern should U2 use at the selected 14,400-tile cap?

A) Use the approved scalar fixed-order validation with no cache, queue, worker, or topology allocation.

B) Revise the U2 NFR requirements to permit a bounded feasibility cache; define its key, maximum size, and invalidation behavior after this answer.

C) Other (please describe after `[Answer]:`)

[Answer]: B

## Question 3

How should the entropy-fallback warning preserve reproducibility?

A) Keep `resolvedSeed` as the exact opaque seed and return a separate typed metadata warning collection alongside the successful request.

B) Revise the result contract so `resolvedSeed` includes a textual warning suffix; reproducibility then uses a separate internal seed field.

C) Other (please describe after `[Answer]:`)

[Answer]: A
