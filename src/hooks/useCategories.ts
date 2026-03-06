import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  count?: number;
}

// Map API icon names to valid Material Icons names
const ICON_MAP: Record<string, string> = {
  pipe: 'plumbing',
  toilet: 'bathroom',
  'hot-tub': 'hot_tub',
};

function normaliseCategory(raw: any): Category {
  return {
    ...raw,
    productCount: raw.productCount ?? raw.count ?? 0,
    icon: ICON_MAP[raw.icon] ?? raw.icon,
  };
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await apiClient.get<any[]>('/categories');
      return (data ?? []).map(normaliseCategory);
    },
  });
}
