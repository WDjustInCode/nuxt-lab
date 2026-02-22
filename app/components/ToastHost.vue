<script lang="ts">
// Singleton toast notification system.
// This component is rendered ONCE in layouts/default.vue and must stay there.
// Any file can show a toast by importing useToasts() from this file:
//   import { useToasts } from '~/components/ToastHost.vue'

import { ref } from 'vue'

// ref is imported explicitly here because this is a non-setup <script> block,
// so Vue's auto-import doesn't apply. Auto-imports only work inside <script setup>.

interface Toast {
  id: number
  type: 'success' | 'error'
  message: string
}

// Module-level ref — defined outside the component function so it is shared across
// all callers. Every call to useToasts() reads and writes the same array.
// This is what makes it a singleton: one queue, one renderer.
const toasts = ref<Toast[]>([])
let _id = 0  // Simple incrementing counter used as a unique key for each toast.

export function useToasts() {
  function add(type: Toast['type'], message: string) {
    const id = _id++
    toasts.value.push({ id, type, message })
    // Automatically remove the toast after 3 seconds.
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }
  return {
    success: (msg: string) => add('success', msg),
    error: (msg: string) => add('error', msg),
  }
}
</script>

<script setup lang="ts">
// toastList gives the template access to the module-level toasts ref.
const toastList = toasts
</script>

<template>
  <!-- Teleport renders the toast container directly in <body>,
       so it always sits above other content regardless of z-index stacking contexts. -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <!-- TransitionGroup applies CSS enter/leave animations to each toast as it's added/removed.
           The CSS transition rules are defined in the <style> block below. -->
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastList"
          :key="toast.id"
          class="pointer-events-auto px-4 py-3 rounded shadow-lg text-sm text-white min-w-48"
          :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
        >
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* These classes are automatically applied by TransitionGroup when toasts enter and leave.
   Vue looks for [name]-enter-active, [name]-leave-active, etc. based on the name="toast" prop. */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(0.5rem);
}
</style>
