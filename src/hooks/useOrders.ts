import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Order, OrderStatus } from '../types';

export function useOrders(status?: OrderStatus) {
  return useQuery<Order[]>({
    queryKey: ['orders', status],
    queryFn: () => apiClient.get<Order[]>('/orders', { status }),
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: () => apiClient.get<Order>(`/orders/${id}`),
    enabled: !!id,
  });
}
