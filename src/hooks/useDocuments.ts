import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Document } from '@/types/schema'

const API_BASE = '/api'

export function useDocuments(policyId: string) {
  return useQuery({
    queryKey: ['documents', policyId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/documents?policy_id=${policyId}`)
      if (!response.ok) throw new Error('Failed to fetch documents')
      return response.json() as Promise<Document[]>
    },
    enabled: !!policyId,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      policyId,
      paymentId,
    }: {
      file: File
      policyId: string
      paymentId?: string
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('policy_id', policyId)
      if (paymentId) formData.append('payment_id', paymentId)

      const response = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to upload document')
      return response.json() as Promise<Document>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', data.policy_id] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, policyId }: { id: string; policyId: string }) => {
      const response = await fetch(`${API_BASE}/documents?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete document')
      return { id, policyId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', data.policyId] })
    },
  })
}

export function getDocumentUrl(documentId: string): string {
  return `${API_BASE}/documents?id=${documentId}`
}

