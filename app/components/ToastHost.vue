<script lang="ts">
import { ref } from 'vue'

interface Toast {
  id: number
  type: 'success' | 'error'
  message: string
}

const toasts = ref<Toast[]>([])
let _id = 0

export function useToasts() {
  function add(type: Toast['type'], message: string) {
    const id = _id++
    toasts.value.push({ id, type, message })
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
const toastList = toasts
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
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
