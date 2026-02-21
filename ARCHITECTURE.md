# Architecture — nuxt-lab

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4.3 (Vue 3) |
| Styling | Tailwind CSS (`@nuxtjs/tailwindcss`) |
| State | Pinia (`@pinia/nuxt`) |
| Server | Nitro (built into Nuxt) |
| External API | MockAPI (proxied via Nitro) |
| Language | TypeScript |

---

## Request Flow

```
Browser / Vue Component
        │
        │  useFetch / $fetch (/api/*)
        ▼
┌───────────────────────┐
│   Nitro Server Layer  │  (server/api/)
│  - validates request  │
│  - reads runtimeConfig│
│  - proxies via $fetch │
└───────────┬───────────┘
            │  HTTP
            ▼
     MockAPI (external)
```

---

## File Structure

```
nuxt-lab/
├── app/                          # Nuxt app source (Nuxt 4 srcDir)
│   ├── app.vue                   # Root component — mounts <NuxtLayout>
│   ├── layouts/
│   │   └── default.vue           # Nav bar + <ToastHost /> + <NuxtPage />
│   ├── pages/
│   │   ├── index.vue             # / — home
│   │   ├── realtime.vue          # /realtime
│   │   └── tickets/
│   │       ├── index.vue         # /tickets — CRUD list (create, edit, delete inline)
│   │       └── [id].vue          # /tickets/:id — detail + edit/delete
│   └── components/
│       ├── TicketTable.vue       # Read-only data table (no action columns)
│       ├── TicketForm.vue        # Create/edit form; exports TicketUpsertPayload
│       ├── ConfirmModal.vue      # Delete confirmation; <Teleport to="body">
│       └── ToastHost.vue         # Toast renderer; exports useToasts(); <Teleport to="body">
│
├── server/
│   └── api/
│       ├── tickets.get.ts        # GET    /api/tickets
│       ├── tickets.post.ts       # POST   /api/tickets
│       └── tickets/
│           ├── [id].get.ts       # GET    /api/tickets/:id
│           ├── [id].put.ts       # PUT    /api/tickets/:id
│           ├── [id].patch.ts     # PATCH  /api/tickets/:id
│           └── [id].delete.ts    # DELETE /api/tickets/:id
│
├── public/                       # Static assets (served at /)
├── nuxt.config.ts                # Modules, runtimeConfig, TS options
├── package.json
├── tsconfig.json
├── .env                          # Local secrets (gitignored)
├── .env.example                  # Committed template
├── CLAUDE.md                     # Claude Code instructions
└── ARCHITECTURE.md               # This file
```

---

## Component Relationships

```
layouts/default.vue
├── <NuxtPage />           — renders the active page component
└── <ToastHost />          — singleton toast renderer (Teleport → body)

pages/tickets/index.vue
├── <TicketForm />         — inline modal for create / edit
└── <ConfirmModal />       — inline modal for delete confirmation

pages/tickets/[id].vue
├── <TicketForm />         — inline modal for edit
└── <ConfirmModal />       — inline modal for delete confirmation
```

---

## API Layer Design

All Nitro route handlers follow the same pattern:

```ts
// server/api/tickets/<method>.ts
export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)
  if (!mockapiBaseUrl) throw createError({ statusCode: 500 })

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets/...`)
  } catch {
    throw createError({ statusCode: 502 })
  }
})
```

Components never call MockAPI directly — all external traffic goes through Nitro.

---

## Toast System

`useToasts()` is exported from `components/ToastHost.vue` (not from `composables/`).
It uses a **module-level singleton ref** so all callers share one queue.

```
import { useToasts } from '~/components/ToastHost.vue'

const toast = useToasts()
toast.success('Ticket created')
toast.error('Something went wrong')
```

Toasts auto-dismiss after 3 s. `<ToastHost />` is rendered once in `default.vue`.

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `MOCKAPI_BASE_URL` | `.env` (server-only) | Base URL for MockAPI |

Accessed in Nitro via `useRuntimeConfig(event).mockapiBaseUrl`.
Never exposed to the browser.

---

## CRUD Summary (Tickets)

| Action | Page | HTTP | Endpoint |
|--------|------|------|----------|
| List | `/tickets` | GET | `/api/tickets` |
| Create | `/tickets` | POST | `/api/tickets` |
| Edit | `/tickets` or `/tickets/:id` | PATCH | `/api/tickets/:id` |
| Delete | `/tickets` or `/tickets/:id` | DELETE | `/api/tickets/:id` |
| Detail | `/tickets/:id` | GET | `/api/tickets/:id` |

After every mutation: show toast, call `refresh()`. After delete on detail page: redirect to `/tickets`.
