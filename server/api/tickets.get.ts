// Handles: GET /api/tickets
// Proxies to MockAPI and returns the full ticket list.
// Keeping this server-side means the MockAPI base URL never leaks to the browser.
export default defineEventHandler(async (event) => {
  // useRuntimeConfig(event) reads server-only env vars set in nuxt.config.ts → runtimeConfig.
  // mockapiBaseUrl comes from MOCKAPI_BASE_URL in .env.
  const { mockapiBaseUrl } = useRuntimeConfig(event)

  // If the env var is missing (e.g. .env not set up), fail fast with a clear server error.
  if (!mockapiBaseUrl) {
    throw createError({ statusCode: 500, message: 'mockapiBaseUrl is not configured' })
  }

  try {
    // $fetch is Nuxt's built-in HTTP client (based on ofetch). Auto-parses JSON responses.
    return await $fetch(`${mockapiBaseUrl}/tickets`)
  } catch {
    // Wrap upstream failures as 502 Bad Gateway so the client knows the problem is upstream.
    throw createError({ statusCode: 502, message: 'Upstream MockAPI request failed' })
  }
})
