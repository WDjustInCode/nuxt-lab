export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  const id = getRouterParam(event, 'id')

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets/${id}`)
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
