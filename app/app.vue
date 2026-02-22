<template>
  <div>
    <!-- Announces route changes to screen readers for accessibility. -->
    <NuxtRouteAnnouncer />

    <!-- NuxtLayout renders layouts/default.vue (or any layout a page specifies).
         Everything inside it becomes the <slot /> in that layout. -->
    <NuxtLayout>
      <!-- NuxtPage renders whichever page component matches the current URL,
           based on the file structure in pages/. -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
