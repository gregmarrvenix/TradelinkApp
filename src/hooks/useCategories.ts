import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<Category[]>('/categories'),
  });
}
