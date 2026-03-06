import type { Product } from '../types';

export function getStockLabel(status: Product['stockStatus']): string {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    case 'special-order':
      return 'Special Order';
    default:
      return 'Unknown';
  }
}

export function getStockColor(status: Product['stockStatus']): string {
  switch (status) {
    case 'in-stock':
      return '#27AE60';
    case 'low-stock':
      return '#F39C12';
    case 'out-of-stock':
      return '#E74C3C';
    case 'special-order':
      return '#2980B9';
    default:
      return '#999999';
  }
}

export function isOrderable(product: Product): boolean {
  return product.stockStatus !== 'out-of-stock';
}
