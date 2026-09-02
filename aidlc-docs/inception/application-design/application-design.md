# Dungeon Generator POC Application Design

## Summary

The POC has a browser-independent Dungeon Engine and a Browser POC. They remain separate internal component boundaries but are implemented together as one construction unit, `poc-web-app`, to prioritize a fast try-it-out result. It retains the previously approved Canvas renderer, deterministic seeded generation, typed expected failures, and in-memory interaction state. The state is now a simple React component state object inside Browser POC; reload starts fresh.

## Removed Production Scope

- Browser-local storage, reload restoration, metadata envelopes, and persistence schemas.
- Separate controller, state-store, version-metadata, and production error-boundary components.
- Hosting, deployment, CI/release, monitoring, and formal accessibility conformance work.

## Ownership

| Capability | Owner |
|---|---|
| Settings and deterministic random | U2, consumed by Dungeon Engine |
| Generation, basic validation, attempts | Dungeon Engine |
| Movement, completion, reset | Dungeon Engine |
| Controls, Canvas rendering, feedback | Browser POC |

## Deferred to Functional Design

- Generation algorithm and exact validation rules.
- Attempt limit and settings defaults.
- Canvas tile sizing, visual layout, and keyboard mechanics.
