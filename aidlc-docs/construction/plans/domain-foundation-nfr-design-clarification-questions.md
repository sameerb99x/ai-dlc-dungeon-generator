# U1 Domain Foundation NFR Design Clarification

The previous Functional Design approved deep immutability: nested public values must not be mutable through public references. The selected NFR pattern avoids recursive runtime freezing, which can leave ordinary JavaScript callers able to mutate nested arrays or objects despite TypeScript `readonly` types.

## Question 1

Which contract should U1 adopt?

A) Preserve deep immutability at runtime: copy and recursively freeze constructed aggregate values, in addition to readonly TypeScript types.

B) Revise the earlier requirement to compile-time and convention-based immutability only: readonly TypeScript types and defensive copies, without runtime recursive freezing.

C) Other (please describe after [Answer]: tag below)

[Answer]: B
