// Handles: PATCH /api/tickets/:id
// Partially updates a ticket — only sends the fields in the request body.
// Used for edits from both the list page and the detail page.
export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  // Extract the ticket ID from the URL path (e.g. /api/tickets/42 → '42').
  const id = getRouterParam(event, 'id')
  // Parse the incoming JSON body (TicketUpsertPayload from TicketForm).
  const body = await readBody(event)

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets/${id}`, {
      method: 'PATCH',
      body,
    })
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
