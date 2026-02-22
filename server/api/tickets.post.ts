// Handles: POST /api/tickets
// Creates a new ticket by forwarding the request body to MockAPI.
export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  // readBody parses the incoming JSON request body sent by the browser.
  // This is the TicketUpsertPayload emitted by TicketForm and sent via $fetch in the page.
  const body = await readBody(event)

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets`, {
      method: 'POST',
      body,
    })
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
