# U2 NFR Design Cache Clarification

## Why clarification is needed

You selected a bounded feasibility cache. Its behavior needs an exact key, capacity, and lifetime before U2 can be designed or tested deterministically.

## Question 1

What inputs form the feasibility-cache key?

A) All settings fields that affect direct feasibility plus every supported-limit field; do not include raw seed text, resolved seed, version metadata, or warnings.

B) Dimensions only; reuse a feasibility result for all constraint combinations of the same map size.

C) The complete raw settings object, including seed text and all metadata.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 2

What is the cache's maximum capacity and eviction policy?

A) 128 entries, deterministic least-recently-used eviction.

B) 512 entries, deterministic least-recently-used eviction.

C) Unbounded for the lifetime of the page.

D) Other (please describe after `[Answer]:`)

[Answer]: A

## Question 3

When is the feasibility cache invalidated?

A) Never within one `SettingsProcessor` instance; create a new processor when supported limits change.

B) Clear the cache whenever the supplied supported-limits value differs structurally from the limits used for the current entries.

C) Clear the cache after every successful process call.

D) Other (please describe after `[Answer]:`)

[Answer]: B
