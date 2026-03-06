import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Invoice } from '../types';

export function useInvoices(status?: 'paid' | 'unpaid' | 'overdue') {
  return useQuery<Invoice[]>({
    queryKey: ['invoices', status],
    queryFn: () => apiClient.get<Invoice[]>('/invoices', { status }),
  });
}

export function useInvoice(id: string) {
  return useQuery<Invoice>({
    queryKey: ['invoices', id],
    queryFn: () => apiClient.get<Invoice>(`/invoices/${id}`),
    enabled: !!id,
  });
}
