import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Product } from '@/types';
import type { PaginatedResponse } from '@/types/api';
import type { ProductFilters } from '../types';

export const productApi = {
  getProducts: async (filters?: ProductFilters) => {
    const { data } = await api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, {
      params: filters,
    });
    return data;
  },

  getProduct: async (id: string) => {
    const { data } = await api.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return data;
  },

  searchProducts: async (query: string) => {
    const { data } = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query },
    });
    return data;
  },
};
