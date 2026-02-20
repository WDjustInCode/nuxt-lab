export default defineEventHandler(async (event) => {
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

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
