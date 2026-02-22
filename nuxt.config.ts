// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Registered modules — Nuxt loads these at build time.
  // @nuxtjs/tailwindcss: enables Tailwind utility classes across all components.
  // @pinia/nuxt: enables Pinia stores (auto-imported from stores/ if any are created).
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  typescript: {
    tsConfig: {
      compilerOptions: {
        // Adds Node.js type definitions (e.g. process.env) for server-side code in server/api/.
        types: ['node']
      }
    }
  },

  runtimeConfig: {
    // Top-level keys are SERVER-ONLY — never exposed to the browser.
    // Read in server/api/ handlers via: const { mockapiBaseUrl } = useRuntimeConfig(event)
    // Value is populated from the MOCKAPI_BASE_URL environment variable in .env.
    // If you need a value accessible on the client too, nest it under runtimeConfig.public instead.
    mockapiBaseUrl: process.env.MOCKAPI_BASE_URL
  }
})