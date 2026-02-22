// Handles: GET /api/tickets/:id
// Fetches a single ticket by ID from MockAPI.
// Called by pages/tickets/[id].vue via useFetch(() => `/api/tickets/${id.value}`).
export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  // getRouterParam extracts the [id] segment from the URL path.
  // The filename [id].get.ts is what registers this as a dynamic route.
  const id = getRouterParam(event, 'id')

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets/${id}`)
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
