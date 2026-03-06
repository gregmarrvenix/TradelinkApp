import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Product } from '../types';

/**
 * Normalise a product object returned by the API so that every component
 * can safely read the fields it expects regardless of which naming
 * convention the backend uses.
 *
 * Key mappings:
 *   tradePrice  -> price   (API returns tradePrice, app code reads price)
 *   subcategory -> subCategory
 *   specs       -> specifications
 *   stock[]     -> stockStatus / stockQty  (derived from first branch entry)
 */
function normaliseProduct(raw: any): Product {
  // price: prefer tradePrice from API, fall back to price if already present
  const price = raw.tradePrice ?? raw.price ?? 0;

  // subcategory
  const subCategory = raw.subCategory ?? raw.subcategory ?? '';

  // specifications
  const specifications = raw.specifications ?? raw.specs ?? {};

  // stock status & qty – derive from the stock array if present
  let stockStatus = raw.stockStatus ?? 'in-stock';
  let stockQty = raw.stockQty ?? 0;
  if (Array.isArray(raw.stock) && raw.stock.length > 0) {
    const totalQty = raw.stock.reduce((sum: number, s: any) => sum + (s.qty ?? 0), 0);
    stockQty = totalQty;
    if (totalQty === 0) stockStatus = 'out-of-stock';
    else if (totalQty <= 5) stockStatus = 'low-stock';
    else stockStatus = 'in-stock';
  }

  return {
    ...raw,
    price,
    tradePrice: price,
    subCategory,
    subcategory: raw.subcategory ?? subCategory,
    specifications,
    specs: raw.specs ?? specifications,
    stockStatus,
    stockQty,
    relatedProductIds: raw.relatedProductIds ?? [],
  };
}

export function useProducts(search?: string, category?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', search, category],
    queryFn: async () => {
      const data = await apiClient.get<any[]>('/products', { search, category });
      return (data ?? []).map(normaliseProduct);
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/products/${id}`);
      return normaliseProduct(data);
    },
    enabled: !!id,
  });
}
