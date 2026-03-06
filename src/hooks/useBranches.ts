import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Branch } from '../types';

export function useBranches() {
  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: () => apiClient.get<Branch[]>('/branches'),
  });
}
