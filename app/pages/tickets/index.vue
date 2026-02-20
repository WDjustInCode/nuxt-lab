<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Tickets</h1>

    <div v-if="pending" class="space-y-2">
      <div
        v-for="n in 5"
        :key="n"
        class="h-10 bg-gray-200 rounded animate-pulse"
      />
    </div>

    <div v-else-if="error" class="text-red-600 flex items-center gap-3">
      <span>Failed to load tickets.</span>
      <button
        class="text-sm underline hover:text-red-800"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <p v-else-if="!tickets?.length" class="text-gray-500">No tickets found.</p>

    <TicketTable v-else :tickets="tickets" />
  </div>
</template>

<script setup lang="ts">
interface Ticket {
  id: string
  ticketNumber: string
  title: string
  status: string
  priority: string
  assignee: string
  updatedAt: string
}

const { data: tickets, pending, error, refresh } = await useFetch<Ticket[]>('/api/tickets')
</script>
