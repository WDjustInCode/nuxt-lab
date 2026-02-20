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
  - `layouts/default.vue` - Default layout with nav bar
  - `pages/index.vue` - Home page (`/`)
  - `pages/tickets/index.vue` - Tickets list page (`/tickets`)
  - `pages/tickets/[id].vue` - Ticket detail page (`/tickets/:id`)
  - `pages/realtime.vue` - Realtime page (`/realtime`)
- `public/` - Static assets served at root
- `nuxt.config.ts` - Nuxt configuration
- `.env.example` - Example environment variables
- `.nuxt/` - Generated files (gitignored, created on dev/build)

### Environment Variables
- `MOCKAPI_BASE_URL` - Base URL for MockAPI (server-side only via `runtimeConfig.mockapiBaseUrl`)
- Copy `.env.example` to `.env` and fill in values before running locally

### Configured Modules
- **@nuxtjs/tailwindcss** - Tailwind CSS with automatic config detection
- **@pinia/nuxt** - State management (stores auto-imported from `stores/` if created)

## TypeScript
- TypeScript config uses project references (see tsconfig.json)
- Generated types in `.nuxt/` provide IDE autocomplete
- Run `npm install` after changing nuxt.config.ts to regenerate types
