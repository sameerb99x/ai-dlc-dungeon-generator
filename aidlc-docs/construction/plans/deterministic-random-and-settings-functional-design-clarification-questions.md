# U2 Deterministic Random and Settings Functional Design Clarification

## Why clarification is needed

Question 1 selected a trimmed seed as the displayed and effective reproducibility value. Question 3 selected preservation of valid raw text with separately parsed generation values. For an input such as `  dungeon-42  `, those choices leave unresolved which value is retained in editable settings, shown beside the generated result, persisted as the effective setting, and compared for reproducibility.

## Question 1

For a valid seed entered with surrounding whitespace, such as `  dungeon-42  `, which representation is authoritative after U2 processing?

A) Preserve the exact raw text only in the editable UI state; put the trimmed `dungeon-42` in the effective request, displayed result metadata, and future persisted effective settings.

B) Preserve the exact raw text in editable UI state and result metadata; use the trimmed `dungeon-42` only internally for deterministic random generation.

C) Treat the raw text as invalid unless it already equals its trimmed form.

D) Other (please describe after `[Answer]:`)

[Answer]: B
