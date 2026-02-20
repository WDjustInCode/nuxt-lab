<script setup lang="ts">
import { useToasts } from '~/components/ToastHost.vue'
import type { TicketUpsertPayload } from '~/components/TicketForm.vue'

interface Ticket {
  id: string
  ticketNumber: string
  title: string
  status: string
  priority: string
  assignee: string
  isArchived: boolean
  estimatedHours: number
  tags: string[] | string
  description: string
  createdAt: string
  updatedAt: string
}

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const toast = useToasts()

const { data: ticket, status, error, refresh } = await useFetch<Ticket>(
  () => `/api/tickets/${id.value}`
)

// Edit state
const showEditModal = ref(false)
const isSubmitting = ref(false)

// Delete state
const showConfirmDelete = ref(false)
const isDeleting = ref(false)

const fmt = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDate(val: string) {
  const d = new Date(Number(val) ? Number(val) * 1000 : val)
  return isNaN(d.getTime()) ? val : fmt.format(d)
}

async function handleFormSubmit(payload: TicketUpsertPayload) {
  isSubmitting.value = true
  try {
    await $fetch(`/api/tickets/${id.value}`, { method: 'PATCH', body: payload })
    toast.success('Ticket updated')
    showEditModal.value = false
    await refresh()
  } catch {
    toast.error('Failed to update ticket')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  isDeleting.value = true
  try {
    await $fetch(`/api/tickets/${id.value}`, { method: 'DELETE' })
    toast.success('Ticket deleted')
    await router.push('/tickets')
  } catch {
    toast.error('Failed to delete ticket')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <NuxtLink to="/tickets" class="text-blue-600 hover:underline text-sm">&larr; Back to Tickets</NuxtLink>

    <!-- Loading skeleton -->
    <div v-if="status === 'pending'" class="mt-6 space-y-4 animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-24 bg-gray-200 rounded"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
      <p class="font-medium">Failed to load ticket.</p>
      <p class="text-sm mt-1">{{ error.message }}</p>
      <button
        class="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <!-- Ticket detail -->
    <div v-else-if="ticket" class="mt-6 space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-sm text-gray-500">#{{ ticket.ticketNumber }}</span>
          <h1 class="text-2xl font-bold mt-1">{{ ticket.title }}</h1>
        </div>
        <div class="flex gap-2 shrink-0">
          <button
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            @click="showEditModal = true"
          >
            Edit
          </button>
          <button
            class="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            @click="showConfirmDelete = true"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-500">Status</span>
          <p class="font-medium capitalize mt-0.5">{{ ticket.status }}</p>
        </div>
        <div>
          <span class="text-gray-500">Priority</span>
          <p class="font-medium capitalize mt-0.5">{{ ticket.priority }}</p>
        </div>
        <div>
          <span class="text-gray-500">Assignee</span>
          <p class="font-medium mt-0.5">{{ ticket.assignee || '—' }}</p>
        </div>
        <div>
          <span class="text-gray-500">Estimated Hours</span>
          <p class="font-medium mt-0.5">{{ ticket.estimatedHours ?? '—' }}</p>
        </div>
        <div>
          <span class="text-gray-500">Archived</span>
          <p class="font-medium mt-0.5">{{ ticket.isArchived ? 'Yes' : 'No' }}</p>
        </div>
      </div>

      <div v-if="ticket.tags">
        <span class="text-sm text-gray-500">Tags</span>
        <div class="mt-1 flex flex-wrap gap-2">
          <template v-if="Array.isArray(ticket.tags)">
            <span
              v-for="tag in ticket.tags"
              :key="tag"
              class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
            >{{ tag }}</span>
          </template>
          <span v-else class="text-sm">{{ ticket.tags }}</span>
        </div>
      </div>

      <div v-if="ticket.description">
        <span class="text-sm text-gray-500">Description</span>
        <p class="mt-1 text-sm whitespace-pre-wrap">{{ ticket.description }}</p>
      </div>

      <div class="text-xs text-gray-400 space-y-1 border-t pt-4">
        <p>Created: {{ formatDate(ticket.createdAt) }}</p>
        <p>Updated: {{ formatDate(ticket.updatedAt) }}</p>
      </div>
    </div>

    <!-- Edit modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <TicketForm
          mode="edit"
          :initial-ticket="ticket ?? undefined"
          :is-submitting="isSubmitting"
          @submit="handleFormSubmit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>

    <!-- Delete confirm -->
    <ConfirmModal
      :open="showConfirmDelete"
      title="Delete Ticket"
      :message="`Delete '${ticket?.title}'? This cannot be undone.`"
      :is-busy="isDeleting"
      @confirm="handleDelete"
      @cancel="showConfirmDelete = false"
    />
  </div>
</template>
