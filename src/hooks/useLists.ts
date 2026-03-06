import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { SavedList } from '../types';

export function useLists() {
  return useQuery<SavedList[]>({
    queryKey: ['lists'],
    queryFn: () => apiClient.get<SavedList[]>('/lists'),
  });
}

export function useList(id: string) {
  return useQuery<SavedList>({
    queryKey: ['lists', id],
    queryFn: () => apiClient.get<SavedList>(`/lists/${id}`),
    enabled: !!id,
  });
}
