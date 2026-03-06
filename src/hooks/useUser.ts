import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { User } from '../types';

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => apiClient.get<User>('/user'),
  });
}
