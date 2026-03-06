import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { apiClient } from '../api/client';
import type { CartItem, Product } from '../types';

interface ApiCartItem {
  product: Product;
  qty: number;
}

export function useCartQuery() {
  return useQuery<ApiCartItem[]>({
    queryKey: ['cart'],
    queryFn: () => apiClient.get<ApiCartItem[]>('/cart'),
    staleTime: Infinity,
  });
}

export function useCartSync() {
  const { data, isSuccess } = useCartQuery();
  const setItems = useCartStore((s) => s.setItems);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (isSuccess && data && items.length === 0) {
      const mapped: CartItem[] = data.map((item) => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.qty,
      }));
      setItems(mapped);
    }
  }, [isSuccess, data]);
}

export function useCart() {
  const store = useCartStore();
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    deliveryMethod: store.deliveryMethod,
    setDeliveryMethod: store.setDeliveryMethod,
    selectedBranchId: store.selectedBranchId,
    setSelectedBranch: store.setSelectedBranch,
    jobReference: store.jobReference,
    setJobReference: store.setJobReference,
    subtotal: store.subtotal,
    gst: store.gst,
    deliveryFee: store.deliveryFee,
    total: store.total,
    itemCount: store.itemCount,
  };
}
