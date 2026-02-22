<template>
  <!-- This layout wraps every page. It is activated by <NuxtLayout> in app.vue.
       Any page that doesn't specify a different layout gets this one by default. -->
  <div>
    <nav class="bg-gray-800 text-white px-6 py-3 flex gap-6">
      <!-- NuxtLink renders as <a> but navigates client-side (no full page reload),
           which is faster and preserves Vue state. -->
      <NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink>
      <NuxtLink to="/tickets" class="hover:text-gray-300">Tickets</NuxtLink>
      <NuxtLink to="/realtime" class="hover:text-gray-300">Realtime</NuxtLink>
    </nav>

    <!-- The active page component renders here (passed in from <NuxtPage> in app.vue). -->
    <slot />

    <!-- ToastHost renders the toast notification queue.
         It must live here (rendered once, at layout level) so the singleton
         useToasts() composable works correctly from any page or component. -->
    <ToastHost />
  </div>
</template>
