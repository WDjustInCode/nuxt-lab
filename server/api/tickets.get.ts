export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  try {
    return await $fetch(`${mockapiBaseUrl}/tickets`)
  } catch {
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
