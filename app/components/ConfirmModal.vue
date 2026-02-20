<script setup lang="ts">
withDefaults(defineProps<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isBusy?: boolean
}>(), {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  isBusy: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="emit('cancel')"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <p class="mt-2 text-sm text-gray-600">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
            :disabled="isBusy"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            :disabled="isBusy"
            @click="emit('confirm')"
          >
            {{ isBusy ? 'Deleting…' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
