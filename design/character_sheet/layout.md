# Character Sheet — layout

Source of truth for how the Character Sheet sections are arranged.
For the conventions used here (grid model, how to edit), see
[`../README.md`](../README.md).

Implemented in `src/components/tools/CharacterSheet.tsx`.

## Breakpoints

- **Default (`< 2xl`)** — single column. Every section is full width, stacked in
  the order listed below.
- **`≥ 2xl`** — 12-column grid, `items-start` (each section keeps its natural
  height; a short section next to a tall one leaves whitespace below it instead of
  stretching to match).

## Sections (top to bottom)

| Order | Section    | Span `≥2xl` | Notes                                 |
| ----- | ---------- | ----------- | ------------------------------------- |
| 1     | Campaign   | 12          | full width                            |
| 2     | Identity   | 12          | full width                            |
| 3     | Attributes | 3           | left; shares a row with Status        |
| 4     | Status     | 9           | right; top-aligned, empty space below |

## Diagram (`≥2xl`)

```
┌───────────────────────────────────┐
│ Campaign                          │   12 / 12
├───────────────────────────────────┤
│ Identity                          │   12 / 12
├─────────┬─────────────────────────┤
│ Attr    │ Status                  │   Attr 3 / 12 · Status 9 / 12
│ Attr    ├─────────────────────────┤
│ Attr    │  (empty for now)        │
└─────────┴─────────────────────────┘
```

## Section internals

- **Attributes** — the six scores are a 2-column grid filled column-first, so the
  physical scores stack on the left and the mental ones on the right:

  ```
  STR │ INT
  DEX │ WIS
  CON │ CHA
  ```
