// Handles: DELETE /api/tickets/:id
// Deletes a ticket from MockAPI.
// After success, the list page calls refresh() and the detail page navigates to /tickets.
export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  const id = getRouterParam(event, 'id')

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets/${id}`, {
      method: 'DELETE',
    })
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
