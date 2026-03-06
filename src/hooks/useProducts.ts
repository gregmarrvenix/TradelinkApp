import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Product } from '../types';

export function useProducts(search?: string, category?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', search, category],
    queryFn: () => apiClient.get<Product[]>('/products', { search, category }),
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => apiClient.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}
