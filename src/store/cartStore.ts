import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  deliveryMethod: 'delivery' | 'click_and_collect';
  selectedBranchId: string;
  jobReference: string;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: 'delivery' | 'click_and_collect') => void;
  setSelectedBranch: (branchId: string) => void;
  setJobReference: (ref: string) => void;
  setItems: (items: CartItem[]) => void;

  get subtotal(): number;
  get gst(): number;
  get deliveryFee(): number;
  get total(): number;
  get itemCount(): number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  deliveryMethod: 'delivery',
  selectedBranchId: '',
  jobReference: '',

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
          ),
        };
      }
      return { items: [...state.items, { productId: product.id, product, quantity }] };
    });
  },
  removeItem: (productId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
  },
  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));
  },
  clearCart: () => set({ items: [], jobReference: '' }),
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setSelectedBranch: (branchId) => set({ selectedBranchId: branchId }),
  setJobReference: (ref) => set({ jobReference: ref }),
  setItems: (items) => set({ items }),

  get subtotal() {
    return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },
  get gst() {
    return get().subtotal * 0.1;
  },
  get deliveryFee() {
    return get().deliveryMethod === 'delivery' ? 20 : 0;
  },
  get total() {
    return get().subtotal + get().gst + get().deliveryFee;
  },
  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
