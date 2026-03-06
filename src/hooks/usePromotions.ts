import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  discount?: string;
}

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: () => apiClient.get<Promotion[]>('/promotions'),
  });
}
