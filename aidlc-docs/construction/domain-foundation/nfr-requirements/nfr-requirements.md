# U1 Domain Foundation NFR Requirements

## Quality Requirements

| ID | Requirement | Verification approach |
|---|---|---|
| U1-NFR-01 | Domain values defensively copy caller-supplied data and expose readonly TypeScript contracts at public boundaries; recursive runtime freezing is not required. | Example and property-based source-mutation isolation tests plus static type checking. |
| U1-NFR-02 | Constructors and equality are deterministic and do not use ambient time, unseeded randomness, browser APIs, or unordered iteration. | Static review and property tests. |
| U1-NFR-03 | Expected invalid caller data returns typed diagnostics without partial values; only programming defects or broken internal invariants may throw. | Example and property tests over invalid structured inputs. |
| U1-NFR-04 | Correctness and deterministic behavior take precedence over an early standalone timing threshold. Concrete map-size and response-time limits remain owned by U2 and U3 after algorithm selection. | Later supported-limit and generation benchmarks. |
| U1-NFR-05 | The module remains framework- and browser-API-free despite its TypeScript/React host application. | Import-boundary and unit-test review. |
| U1-NFR-06 | Tests run in every CI change and include example-based coverage plus enabled property-based tests. | CI configuration and test scripts. |
| U1-NFR-07 | Browser support targets the latest two stable desktop versions of Chrome, Edge, and Firefox. | Build target configuration and browser verification during U8/U9. |

## Applicability Assessment

- Scalability: N/A. U1 is an in-memory library with no independent deployment or load boundary.
- Availability and disaster recovery: N/A. No persistent state or service endpoint is owned by U1.
- Security: applicable only as safe diagnostic handling and no unsafe browser or secret access; the Security Baseline extension remains disabled.
- Usability and accessibility: N/A directly; U1 has no user interface. Its clear typed diagnostics support later accessible presentation.
- Reliability and maintainability: applicable through deterministic, immutable, typed contracts and isolated tests.

## Partial PBT Compliance

| Rule | Status | Requirement |
|---|---|---|
| PBT-02 | N/A | U1 has no reversible serialization, encoding, or parse/format operation. |
| PBT-03 | Required | Constructor, grid, marker, immutability, equality, and fresh-session invariants receive generated-input tests. |
| PBT-07 | Required | Tests use centralized, structured domain generators for valid values and focused invalid variants. |
| PBT-08 | Required | fast-check shrinking remains enabled; CI uses a fixed documented seed; failures preserve the replay path and shrunk case. |
| PBT-09 | Required | fast-check is selected as the project dependency and is integrated with Vitest. |

## Traceability

These requirements implement U1's NFR-04 through NFR-06 obligations and support FR-01 through FR-06, FR-09, FR-11, and FR-12.
