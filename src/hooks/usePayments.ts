import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Payment } from '@/types/schema'

const API_BASE = '/api'

export function usePayments(policyId: string) {
  return useQuery({
    queryKey: ['payments', policyId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/payments?policy_id=${policyId}`)
      if (!response.ok) throw new Error('Failed to fetch payments')
      return response.json() as Promise<Payment[]>
    },
    enabled: !!policyId,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payment: Omit<Payment, 'id' | 'created_at'>) => {
      const response = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      })
      if (!response.ok) throw new Error('Failed to create payment')
      return response.json() as Promise<Payment>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments', data.policy_id] })
    },
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payment: Payment) => {
      const response = await fetch(`${API_BASE}/payments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      })
      if (!response.ok) throw new Error('Failed to update payment')
      return response.json() as Promise<Payment>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments', data.policy_id] })
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, policyId }: { id: string; policyId: string }) => {
      const response = await fetch(`${API_BASE}/payments?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete payment')
      return { id, policyId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments', data.policyId] })
    },
  })
}

