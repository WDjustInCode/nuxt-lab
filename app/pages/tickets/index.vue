<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Tickets</h1>
      <button
        class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="openCreateModal"
      >
        + New Ticket
      </button>
    </div>

    <div v-if="pending" class="space-y-2">
      <div v-for="n in 5" :key="n" class="h-10 bg-gray-200 rounded animate-pulse" />
    </div>

    <div v-else-if="error" class="text-red-600 flex items-center gap-3">
      <span>Failed to load tickets.</span>
      <button class="text-sm underline hover:text-red-800" @click="refresh()">Retry</button>
    </div>

    <p v-else-if="!tickets?.length" class="text-gray-500">No tickets found.</p>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 border-b">#</th>
            <th class="px-4 py-3 border-b">Title</th>
            <th class="px-4 py-3 border-b">Status</th>
            <th class="px-4 py-3 border-b">Priority</th>
            <th class="px-4 py-3 border-b">Assignee</th>
            <th class="px-4 py-3 border-b">Updated</th>
            <th class="px-4 py-3 border-b"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id" class="hover:bg-gray-50 border-b">
            <td class="px-4 py-3">
              <NuxtLink :to="`/tickets/${ticket.id}`" class="text-blue-600 hover:underline">
                {{ ticket.ticketNumber }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/tickets/${ticket.id}`" class="hover:underline">
                {{ ticket.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 capitalize">{{ ticket.status }}</td>
            <td class="px-4 py-3 capitalize">{{ ticket.priority }}</td>
            <td class="px-4 py-3">{{ ticket.assignee || '—' }}</td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(ticket.updatedAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 justify-end">
                <button
                  class="text-xs text-blue-600 hover:underline"
                  @click="openEditModal(ticket)"
                >
                  Edit
                </button>
                <button
                  class="text-xs text-red-600 hover:underline"
                  @click="openDeleteConfirm(ticket)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <TicketForm
          :mode="modalMode"
          :initial-ticket="selectedTicket ?? undefined"
          :is-submitting="isSubmitting"
          @submit="handleFormSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>

    <!-- Delete confirm modal -->
    <ConfirmModal
      :open="showConfirmDelete"
      title="Delete Ticket"
      :message="`Delete ticket '${ticketToDelete?.title}'? This cannot be undone.`"
      :is-busy="isDeleting"
      @confirm="handleDelete"
      @cancel="showConfirmDelete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useToasts } from '~/components/ToastHost.vue'
import type { TicketUpsertPayload } from '~/components/TicketForm.vue'

interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  isArchived: boolean
  estimatedHours: number
  tags: string[] | string
  updatedAt: string
}

const toast = useToasts()

const { data: tickets, pending, error, refresh } = await useFetch<Ticket[]>('/api/tickets')

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function formatDate(value: string): string {
  const d = new Date(Number(value) ? Number(value) * 1000 : value)
  return isNaN(d.getTime()) ? value : fmt.format(d)
}

// Modal state
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedTicket = ref<Ticket | null>(null)
const isSubmitting = ref(false)

// Delete state
const showConfirmDelete = ref(false)
const ticketToDelete = ref<Ticket | null>(null)
const isDeleting = ref(false)

function openCreateModal() {
  modalMode.value = 'create'
  selectedTicket.value = null
  showModal.value = true
}

function openEditModal(ticket: Ticket) {
  modalMode.value = 'edit'
  selectedTicket.value = ticket
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTicket.value = null
}

async function handleFormSubmit(payload: TicketUpsertPayload) {
  isSubmitting.value = true
  try {
    if (modalMode.value === 'create') {
      await $fetch('/api/tickets', { method: 'POST', body: payload })
      toast.success('Ticket created')
    } else if (selectedTicket.value) {
      await $fetch(`/api/tickets/${selectedTicket.value.id}`, { method: 'PATCH', body: payload })
      toast.success('Ticket updated')
    }
    closeModal()
    await refresh()
  } catch {
    toast.error(modalMode.value === 'create' ? 'Failed to create ticket' : 'Failed to update ticket')
  } finally {
    isSubmitting.value = false
  }
}

function openDeleteConfirm(ticket: Ticket) {
  ticketToDelete.value = ticket
  showConfirmDelete.value = true
}

async function handleDelete() {
  if (!ticketToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/tickets/${ticketToDelete.value.id}`, { method: 'DELETE' })
    toast.success('Ticket deleted')
    showConfirmDelete.value = false
    ticketToDelete.value = null
    await refresh()
  } catch {
    toast.error('Failed to delete ticket')
  } finally {
    isDeleting.value = false
  }
}
</script>
