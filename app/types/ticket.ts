export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  status: string
  priority: string
  assignee: string
  description?: string
  isArchived?: boolean
  estimatedHours?: number
  tags?: string[] | string
  updatedAt?: string
  createdAt?: string
}

export interface TicketUpsertPayload {
  ticketNumber: string
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  isArchived: boolean
  estimatedHours: number | null
  tags: string[]
}
