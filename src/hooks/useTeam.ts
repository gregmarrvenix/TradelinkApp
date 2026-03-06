import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { TeamMember } from '../types';

export function useTeam() {
  return useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => apiClient.get<TeamMember[]>('/team'),
  });
}
