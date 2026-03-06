import { useCartStore } from '../../src/store/cartStore';
import type { Product } from '../../src/types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-1',
  sku: 'SKU-001',
  name: 'Copper Pipe 15mm',
  description: 'A pipe',
  brand: 'Rinnai',
  category: 'Plumbing',
  subCategory: 'Pipes',
  price: 45.5,
  rrp: 55,
  unit: 'each',
  stockStatus: 'in-stock',
  stockQty: 100,
  images: [],
  specifications: {},
  relatedProductIds: [],
  ...overrides,
});

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      deliveryMethod: 'delivery',
      selectedBranchId: '',
      jobReference: '',
    });
  });

  it('has empty items initially', () => {
    expect(useCartStore.getState().items).toEqual([]);
  });

  describe('addItem', () => {
    it('adds a product with default quantity of 1', () => {
      const product = makeProduct();
      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('prod-1');
      expect(items[0].quantity).toBe(1);
      expect(items[0].product).toEqual(product);
    });

    it('adds a product with specified quantity', () => {
      useCartStore.getState().addItem(makeProduct(), 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('increments quantity if product already in cart', () => {
      const product = makeProduct();
      useCartStore.getState().addItem(product, 2);
      useCartStore.getState().addItem(product, 3);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('removes a product from cart', () => {
      useCartStore.getState().addItem(makeProduct());
      useCartStore.getState().removeItem('prod-1');
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('only removes the specified product', () => {
      useCartStore.getState().addItem(makeProduct({ id: 'prod-1' }));
      useCartStore.getState().addItem(makeProduct({ id: 'prod-2' }));
      useCartStore.getState().removeItem('prod-1');

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('prod-2');
    });
  });

  describe('updateQuantity', () => {
    it('changes the quantity of a product', () => {
      useCartStore.getState().addItem(makeProduct());
      useCartStore.getState().updateQuantity('prod-1', 10);
      expect(useCartStore.getState().items[0].quantity).toBe(10);
    });
  });

  describe('clearCart', () => {
    it('empties the cart', () => {
      useCartStore.getState().addItem(makeProduct({ id: 'prod-1' }));
      useCartStore.getState().addItem(makeProduct({ id: 'prod-2' }));
      useCartStore.getState().setJobReference('JOB-123');
      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toEqual([]);
      expect(useCartStore.getState().jobReference).toBe('');
    });
  });

  describe('computed values', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(makeProduct({ id: 'prod-1', price: 100 }), 2);
      useCartStore.getState().addItem(makeProduct({ id: 'prod-2', price: 50 }), 1);
    });

    it('subtotal is sum of (price * quantity)', () => {
      expect(useCartStore.getState().subtotal).toBe(250);
    });

    it('gst is 10% of subtotal', () => {
      expect(useCartStore.getState().gst).toBe(25);
    });

    it('deliveryFee is $20 for delivery method', () => {
      expect(useCartStore.getState().deliveryFee).toBe(20);
    });

    it('deliveryFee is $0 for click_and_collect', () => {
      useCartStore.getState().setDeliveryMethod('click_and_collect');
      expect(useCartStore.getState().deliveryFee).toBe(0);
    });

    it('total = subtotal + gst + deliveryFee', () => {
      // 250 + 25 + 20 = 295
      expect(useCartStore.getState().total).toBe(295);
    });

    it('total without delivery fee for click_and_collect', () => {
      useCartStore.getState().setDeliveryMethod('click_and_collect');
      // 250 + 25 + 0 = 275
      expect(useCartStore.getState().total).toBe(275);
    });

    it('itemCount sums quantities', () => {
      expect(useCartStore.getState().itemCount).toBe(3);
    });
  });
});
