import { getStockLabel, getStockColor, isOrderable } from '../../src/utils/stockHelpers';
import type { Product } from '../../src/types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  sku: 'SKU-001',
  name: 'Test Product',
  description: 'desc',
  brand: 'Brand',
  category: 'Cat',
  subCategory: 'Sub',
  price: 100,
  rrp: 120,
  unit: 'each',
  stockStatus: 'in-stock',
  stockQty: 50,
  images: [],
  specifications: {},
  relatedProductIds: [],
  ...overrides,
});

describe('getStockLabel', () => {
  it('returns "In Stock" for in-stock', () => {
    expect(getStockLabel('in-stock')).toBe('In Stock');
  });

  it('returns "Low Stock" for low-stock', () => {
    expect(getStockLabel('low-stock')).toBe('Low Stock');
  });

  it('returns "Out of Stock" for out-of-stock', () => {
    expect(getStockLabel('out-of-stock')).toBe('Out of Stock');
  });

  it('returns "Special Order" for special-order', () => {
    expect(getStockLabel('special-order')).toBe('Special Order');
  });
});

describe('getStockColor', () => {
  it('returns green for in-stock', () => {
    expect(getStockColor('in-stock')).toBe('#27AE60');
  });

  it('returns orange for low-stock', () => {
    expect(getStockColor('low-stock')).toBe('#F39C12');
  });

  it('returns red for out-of-stock', () => {
    expect(getStockColor('out-of-stock')).toBe('#E74C3C');
  });

  it('returns blue for special-order', () => {
    expect(getStockColor('special-order')).toBe('#2980B9');
  });
});

describe('isOrderable', () => {
  it('returns true for in-stock product', () => {
    expect(isOrderable(makeProduct({ stockStatus: 'in-stock' }))).toBe(true);
  });

  it('returns true for low-stock product', () => {
    expect(isOrderable(makeProduct({ stockStatus: 'low-stock' }))).toBe(true);
  });

  it('returns false for out-of-stock product', () => {
    expect(isOrderable(makeProduct({ stockStatus: 'out-of-stock' }))).toBe(false);
  });

  it('returns true for special-order product', () => {
    expect(isOrderable(makeProduct({ stockStatus: 'special-order' }))).toBe(true);
  });
});
