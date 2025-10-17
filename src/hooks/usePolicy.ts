import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Policy } from '@/types/schema'

const API_BASE = '/api'

export function usePolicy(id?: string) {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const url = id ? `${API_BASE}/policy?id=${id}` : `${API_BASE}/policy`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch policy')
      return response.json() as Promise<Policy | Policy[]>
    },
    enabled: !!id || id === undefined,
  })
}

export function useCreatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (policy: Omit<Policy, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch(`${API_BASE}/policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      })
      if (!response.ok) throw new Error('Failed to create policy')
      return response.json() as Promise<Policy>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy'] })
    },
  })
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (policy: Policy) => {
      const response = await fetch(`${API_BASE}/policy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      })
      if (!response.ok) throw new Error('Failed to update policy')
      return response.json() as Promise<Policy>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy', data.id] })
      queryClient.invalidateQueries({ queryKey: ['policy'] })
    },
  })
}

export function useDeletePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/policy?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete policy')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy'] })
    },
  })
}

