export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  const id = getRouterParam(event, 'id')
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
