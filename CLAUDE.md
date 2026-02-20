# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Rules for Claude Code (nuxt-lab)

## Core Philosophy
This is a learning project. Favor clarity and minimalism over abstraction.

## Hard Constraints
- Do NOT refactor files unless explicitly requested.
- Do NOT modify files outside the scope of the current task.
- Do NOT upgrade dependency versions.
- Do NOT reorganize the folder structure.
- Do NOT introduce new libraries unless explicitly requested.
- Do NOT add tests unless explicitly requested.
- Keep implementations minimal and idiomatic Nuxt 3/4.
- Avoid over-engineering.
- Stop once the requested task is complete.

## Architecture Principles
- UI → composables → /api (Nitro) → external services
- No direct external API calls from components.
- Keep runtimeConfig server-only for external base URLs.
- Prefer simple patterns over clever abstractions.

## Output Expectations
- Always list modified/created files.
- Always show full contents of new files.
- Never silently change unrelated files.

## Project Overview

This is a Nuxt 4.3 application with TypeScript, Tailwind CSS, and Pinia for state management.

## Development Commands

```bash
npm install          # Install dependencies (must run after cloning)
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run generate     # Generate static site
```

Note: This project uses npm (package-lock.json is tracked). Don't use other package managers.

## Architecture

### Nuxt 4 Auto-Imports
- Components, composables, and utilities are auto-imported - no explicit imports needed
- Vue 3 APIs (ref, computed, etc.) are auto-imported
- Place files in conventional directories for auto-discovery

### File Structure Conventions
- `app/` - Application source code
  - `app.vue` - Root component
  - `layouts/default.vue` - Default layout with nav bar and `<ToastHost />`
  - `pages/index.vue` - Home page (`/`)
  - `pages/tickets/index.vue` - Tickets list page (`/tickets`) with full CRUD UI
  - `pages/tickets/[id].vue` - Ticket detail page (`/tickets/:id`) with Edit/Delete
  - `pages/realtime.vue` - Realtime page (`/realtime`)
  - `components/TicketTable.vue` - Read-only table (no action columns); used only if no actions needed
  - `components/TicketForm.vue` - Create/edit form; exports `TicketUpsertPayload` type
  - `components/ConfirmModal.vue` - Delete confirmation modal (Teleport-based)
  - `components/ToastHost.vue` - Toast renderer; exports `useToasts()` composable
- `server/api/` - Nitro server routes (auto-registered, no imports needed)
  - `tickets.get.ts` - GET /api/tickets
  - `tickets.post.ts` - POST /api/tickets
  - `tickets/[id].get.ts` - GET /api/tickets/:id
  - `tickets/[id].put.ts` - PUT /api/tickets/:id
  - `tickets/[id].patch.ts` - PATCH /api/tickets/:id
  - `tickets/[id].delete.ts` - DELETE /api/tickets/:id
- `public/` - Static assets served at root
- `nuxt.config.ts` - Nuxt configuration
- `.env.example` - Example environment variables
- `.nuxt/` - Generated files (gitignored, created on dev/build)

### Ticket Type
All pages and form components define a local `Ticket` interface inline (no shared types file yet). Full field set:
- `id`, `ticketNumber`, `title`, `status`, `priority`, `assignee`, `updatedAt` (common)
- `isArchived` (boolean), `estimatedHours` (number), `tags` (string[] | string), `description`, `createdAt` (detail/form)
- Dates from MockAPI are Unix timestamps (seconds); format with `new Date(Number(val) * 1000)`

`TicketUpsertPayload` is exported from `components/TicketForm.vue`:
- Fields: `ticketNumber`, `title`, `description`, `status`, `priority`, `assignee`, `isArchived`, `estimatedHours` (number | null), `tags` (string[])
- Import with: `import type { TicketUpsertPayload } from '~/components/TicketForm.vue'`

### Toast System
`useToasts()` is exported from `components/ToastHost.vue` (NOT from `composables/`). Import explicitly:
```ts
import { useToasts } from '~/components/ToastHost.vue'
```
- Uses a module-level singleton ref — all callers share the same toast queue
- `<ToastHost />` is rendered once in `layouts/default.vue`
- API: `toast.success(msg)`, `toast.error(msg)` — auto-dismiss after 3s

### Pages: Tickets
- **List** (`/tickets`): fetches `/api/tickets`, shows loading skeleton, error+retry, empty state, or inline table with Edit/Delete actions per row and a "New Ticket" button. Does NOT use `<TicketTable>` (that component has no action columns).
- **Detail** (`/tickets/:id`): fetches `/api/tickets/:id` reactively via `useFetch(() => \`/api/tickets/${id.value}\`)`; shows loading skeleton, error+retry, or full ticket fields with tag chips, formatted dates, and Edit/Delete buttons.

### CRUD Flows (tickets)
- **Create**: POST `/api/tickets` with `TicketUpsertPayload`
- **Update**: PATCH `/api/tickets/:id` with `TicketUpsertPayload` (do not send `id` or `createdAt`)
- **Delete**: DELETE `/api/tickets/:id`
- All flows: show toast on success/error, call `refresh()` on success
- After delete on detail page: `router.push('/tickets')`
- Modal overlay uses `v-if` + fixed overlay div; `ConfirmModal` and `ToastHost` use `<Teleport to="body">`

### Environment Variables
- `MOCKAPI_BASE_URL` - Base URL for MockAPI (server-side only via `runtimeConfig.mockapiBaseUrl`)
- Copy `.env.example` to `.env` and fill in values before running locally

### Nitro Server Routes (server/api/)
- All handlers use `useRuntimeConfig(event)` to read `mockapiBaseUrl`
- Throw `createError({ statusCode: 500 })` if `mockapiBaseUrl` is missing
- Use `$fetch` to proxy to MockAPI; wrap errors as `createError({ statusCode: 502 })`
- Read path params with `getRouterParam(event, 'id')`
- Read request body with `readBody(event)` for POST/PUT/PATCH
- After adding new server route files, restart the dev server to ensure they are registered

### Configured Modules
- **@nuxtjs/tailwindcss** - Tailwind CSS with automatic config detection
- **@pinia/nuxt** - State management (stores auto-imported from `stores/` if created)

## TypeScript
- TypeScript config uses project references (see tsconfig.json)
- Generated types in `.nuxt/` provide IDE autocomplete
- Run `npm install` after changing nuxt.config.ts to regenerate types
