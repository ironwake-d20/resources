# Layout design

How to describe a tool's responsive layout so it can be implemented directly.

Each tool gets its own spec at `design/<tool>/layout.md` (e.g.
[`character_sheet/layout.md`](character_sheet/layout.md)). That file is the source
of truth — edit it to change the intended layout, and the implementation should
follow it.

## The model

- Wide screens use a **12-column grid**; narrow screens collapse to a **single
  stacked column** (sections full width, in list order).
- "Wide" is the `2xl` breakpoint for now.
- Each section gets a **column span out of 12**:

  | Width       | Span |
  | ----------- | ---- |
  | full        | 12   |
  | two-thirds  | 8    |
  | three-quart | 9    |
  | half        | 6    |
  | one-third   | 4    |
  | quarter     | 3    |

- Sections are **top-aligned** (`items-start`): a short section beside a tall one
  leaves whitespace below it rather than stretching to match.

## How to describe a layout

1. List the sections top to bottom.
2. Give each a span /12 at the wide breakpoint.
3. Optionally sketch an ASCII diagram — handy for a quick visual (see below).

A table of sections + spans is enough on its own; the diagram is just a nicety.

## ASCII building blocks

Box-drawing characters for sketching layouts:

```
┌ ┐ └ ┘   corners
─ │       horizontal / vertical line
┬ ┴ ├ ┤   T-junctions (edges)
┼         cross (interior)
```

Copy-paste row: `┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼`

Example (annotate each cell with its span):

```
┌──────────┬───────────────────┐
│ A (4/12) │ B (8/12)          │
├──────────┴─────────┬─────────┤
│ C (8/12)           │ D(4/12) │
└────────────────────┴─────────┘
```
