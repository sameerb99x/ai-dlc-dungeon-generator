# U1 Domain Foundation NFR Design Patterns

## Readonly Boundary and Defensive-Copy Pattern

Public constructors copy all caller-supplied arrays, maps, and nested aggregate data before returning a domain value. Public signatures expose `readonly` TypeScript fields and collections. Recursive `Object.freeze` is deliberately not used: the contract is compile-time readonly plus source-mutation isolation, not runtime tamper-proofing. Tests must prove that changing a source input after construction cannot change the constructed value.

## Typed Expected-Failure Pattern

Invalid caller data follows `Result<Success, Diagnostic[]>` paths. Diagnostics identify the field or representation rule and remain safe for later presentation. U1 does not catch unexpected programming defects and relabel them as validation errors; such defects throw to the later browser error boundary.

## Determinism Pattern

U1 functions are pure with respect to their inputs. They access no clocks, random sources, browser APIs, storage, network, or unordered external state. Equality traverses values in a documented stable order. No cache or mutable singleton is introduced.

## PBT Execution Pattern

Fast-check supplies centralized domain-specific arbitraries. Tests retain default shrinking. CI runs the property suite with a documented fixed seed and records the framework replay path and shrunk counterexample on failure. PBT covers constructor and representation invariants, source-mutation isolation, and equality laws. U1 has no PBT-02 round-trip boundary.

## Resilience, Scalability, and Security Patterns

- No retry, queue, circuit breaker, cache, or failover pattern applies to U1 because it owns no I/O or remote dependency.
- No independent scalability pattern applies; constructors remain synchronous and avoid premature optimization.
- Diagnostics use structured safe text and never contain secrets or executable markup.

## Traceability and PBT Compliance

PBT-03, PBT-07, PBT-08, and PBT-09 are incorporated through the patterns above. PBT-02 is N/A because serialization is owned by U7. This design supports NFR-04 through NFR-06 and U1's assigned functional requirements.
