# Ironwake Resources

A React + TypeScript web app serving tools for the Ironwake tabletop campaign. Deployed to GitHub Pages at `/resources/` via the `gh-pages` branch.

## Stack

- **React** + **TypeScript** with Vite (SWC)
- **Tailwind CSS v4** with the Catppuccin theme (`ctp-*` color classes)
- **React Router v6** — `BrowserRouter` with `basename="/resources"`
- **pnpm** for package management

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build → dist/
pnpm typecheck    # tsc --noEmit
pnpm format       # prettier on src/**
pnpm format:check # CI format check
```

## Project structure

```
src/
  components/
    layout/       # AppHeader, AppFooter
    tools/        # One file per tool (e.g. DiceRoller)
  components/     # Shared components (e.g. DiceRollResult)
  utils/          # Pure logic (e.g. dice.ts)
  styles/         # main.css (Tailwind entry)
  main.tsx        # App entry, BrowserRouter setup
  App.tsx         # Routes
public/           # Static assets copied as-is to dist/
```

## Adding a new tool

1. Create `src/components/tools/MyTool.tsx`
2. Add a `<Route>` in `App.tsx`
3. Add a link on the `Home` component
