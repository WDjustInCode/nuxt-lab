<template>
  <div>
    <nav class="bg-gray-800 text-white px-6 py-3 flex gap-6">
      <NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink>
      <NuxtLink to="/tickets" class="hover:text-gray-300">Tickets</NuxtLink>
      <NuxtLink to="/realtime" class="hover:text-gray-300">Realtime</NuxtLink>
    </nav>
    <slot />
    <ToastHost />
  </div>
</template>
