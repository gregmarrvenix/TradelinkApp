import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  orderId?: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get<Notification[]>('/notifications'),
  });
}
