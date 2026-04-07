import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { productApi } from '../api/productApi';
import type { ProductFilters } from '../types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters as Record<string, unknown> | undefined),
    queryFn: () => productApi.getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL_BY_SLUG(slug),
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
  });
}
