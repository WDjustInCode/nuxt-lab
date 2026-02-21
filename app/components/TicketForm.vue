<script setup lang="ts">
// Reusable create/edit form for tickets.
// Used by: pages/tickets/index.vue (create + edit) and pages/tickets/[id].vue (edit only).
// The mode prop ('create' | 'edit') controls the heading and submit button label.
// When initialTicket is provided, the form pre-fills for editing; absent = create mode.

import type { Ticket, TicketUpsertPayload } from '~/types/ticket'

const props = withDefaults(defineProps<{
  mode: 'create' | 'edit' 
  initialTicket?: Ticket
  isSubmitting?: boolean  // Passed in from the parent while an API call is in flight; disables buttons.
}>(), {
  isSubmitting: false,
})

// This component does NOT make API calls itself.
// 'submit' fires with the validated payload — the parent decides what to do with it (POST or PATCH).
// 'cancel' fires when the user cancels — the parent controls modal visibility.
const emit = defineEmits<{
  submit: [payload: TicketUpsertPayload]
  cancel: []
}>()

// Local refs mirror the form fields. Initialized from initialTicket props for edit mode,
// or with sensible defaults for create mode.
const ticketNumber = ref(props.initialTicket?.ticketNumber ?? '')
const title = ref(props.initialTicket?.title ?? '')
const description = ref(props.initialTicket?.description ?? '')
const status = ref(props.initialTicket?.status ?? 'open')
const priority = ref(props.initialTicket?.priority ?? 'medium')
const assignee = ref(props.initialTicket?.assignee ?? '')
const isArchived = ref(props.initialTicket?.isArchived ?? false)
const estimatedHours = ref(
  props.initialTicket?.estimatedHours != null ? String(props.initialTicket.estimatedHours) : ''
)

// MockAPI can return tags as a string[] or a plain string.
// The input field always works with a comma-separated string for simplicity;
// it's converted back to string[] in handleSubmit before emitting.
const tagsInput = ref(
  Array.isArray(props.initialTicket?.tags)
    ? props.initialTicket.tags.join(', ')
    : (props.initialTicket?.tags ?? '')
)

const errors = ref<Record<string, string>>({})

// Client-side validation — checks required fields before emitting the payload.
function validate() {
  errors.value = {}
  if (!title.value.trim()) errors.value.title = 'Required'
  if (!status.value) errors.value.status = 'Required'
  if (!priority.value) errors.value.priority = 'Required'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const payload: TicketUpsertPayload = {
    ticketNumber: ticketNumber.value.trim(),
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
    priority: priority.value,
    assignee: assignee.value.trim(),
    isArchived: isArchived.value,
    // estimatedHours is stored as a string in the input; convert to number (or null if empty).
    estimatedHours: estimatedHours.value !== '' ? Number(estimatedHours.value) : null,
    // Split the comma-separated string back into a clean string[].
    tags: tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : [],
  }
  emit('submit', payload)
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-lg font-semibold">{{ mode === 'create' ? 'New Ticket' : 'Edit Ticket' }}</h2>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ticket #</label>
        <input
          v-model="ticketNumber"
          type="text"
          placeholder="e.g. T-001"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="title"
          type="text"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="errors.title ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Status <span class="text-red-500">*</span>
        </label>
        <select
          v-model="status"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="errors.status ? 'border-red-400' : 'border-gray-300'"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <p v-if="errors.status" class="text-xs text-red-500 mt-1">{{ errors.status }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Priority <span class="text-red-500">*</span>
        </label>
        <select
          v-model="priority"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="errors.priority ? 'border-red-400' : 'border-gray-300'"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <p v-if="errors.priority" class="text-xs text-red-500 mt-1">{{ errors.priority }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
        <input
          v-model="assignee"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
        <input
          v-model="estimatedHours"
          type="number"
          min="0"
          step="0.5"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
      <input
        v-model="tagsInput"
        type="text"
        placeholder="e.g. bug, frontend, urgent"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        v-model="description"
        rows="3"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
    </div>

    <div class="flex items-center gap-2">
      <input id="isArchived" v-model="isArchived" type="checkbox" class="rounded" />
      <label for="isArchived" class="text-sm text-gray-700">Archived</label>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Saving…' : (mode === 'create' ? 'Create' : 'Save Changes') }}
      </button>
    </div>
  </form>
</template>
