import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Quote } from '../types';

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: () => apiClient.get<Quote[]>('/quotes'),
  });
}

export function useQuote(id: string) {
  return useQuery<Quote>({
    queryKey: ['quotes', id],
    queryFn: () => apiClient.get<Quote>(`/quotes/${id}`),
    enabled: !!id,
  });
}
