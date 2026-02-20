<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left border-collapse">
      <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th class="px-4 py-3 border-b">#</th>
          <th class="px-4 py-3 border-b">Title</th>
          <th class="px-4 py-3 border-b">Status</th>
          <th class="px-4 py-3 border-b">Priority</th>
          <th class="px-4 py-3 border-b">Assignee</th>
          <th class="px-4 py-3 border-b">Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket in tickets"
          :key="ticket.id"
          class="hover:bg-gray-50 border-b"
        >
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
          <td class="px-4 py-3">{{ ticket.status }}</td>
          <td class="px-4 py-3">{{ ticket.priority }}</td>
          <td class="px-4 py-3">{{ ticket.assignee }}</td>
          <td class="px-4 py-3 text-gray-500">{{ formatDate(ticket.updatedAt) }}</td>
        </tr>
      </tbody>
    </table>
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

defineProps<{ tickets: Ticket[] }>()

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function formatDate(value: string): string {
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : fmt.format(d)
}
</script>
