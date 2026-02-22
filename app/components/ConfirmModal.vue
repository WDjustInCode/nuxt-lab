<script setup lang="ts">
// Generic confirmation dialog — used for destructive actions like deleting a ticket.
// Used by: pages/tickets/index.vue and pages/tickets/[id].vue.
// The parent controls open/close state and handles the actual delete logic on 'confirm'.

withDefaults(defineProps<{
  open: boolean       // Parent sets this to true to show the modal.
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isBusy?: boolean    // Parent sets this while the delete API call is in flight; disables buttons.
}>(), {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  isBusy: false,
})

// 'confirm' — user clicked the destructive action button; parent should proceed with delete.
// 'cancel' — user dismissed the dialog; parent should set open = false.
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <!-- Teleport moves this DOM node to <body>, outside the normal component tree.
       This avoids z-index and CSS stacking context issues with parent elements. -->
  <Teleport to="body">
    <!-- Clicking the semi-transparent overlay dismisses the modal. -->
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
