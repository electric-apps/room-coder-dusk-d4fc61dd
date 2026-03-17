# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. Tasks sync instantly across all connected clients via Postgres — no polling, no manual refreshes.

## Screenshot

![Todo App screenshot placeholder]

## Features

- Add todos with title, priority (low/medium/high), and optional due date
- Complete/uncomplete tasks with optimistic updates
- Delete individual tasks or clear all completed at once
- Filter by All / Active / Completed
- Real-time sync across browser tabs and clients via Electric SQL

## Tech Stack

- **Electric SQL** — Postgres-to-client real-time sync via shapes
- **TanStack DB** — reactive collections and optimistic mutations
- **Drizzle ORM** — schema definitions and migrations
- **TanStack Start** — React meta-framework with SSR
- **Radix UI Themes** — accessible, composable UI components

## Running Locally

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

App runs at `http://localhost:8080`.

## License

MIT
