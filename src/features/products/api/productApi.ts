import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Product } from '@/types';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { ProductFilters } from '../types';

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  shortDescription?: string;
  compareAtPrice?: number;
  costPrice?: number;
  brand?: string;
  tags?: string[];
  productType?: 'physical' | 'digital' | 'service';
  images?: { url: string; altText?: string; sortOrder: number; isPrimary: boolean }[];
  weight?: number;
  weightUnit?: 'g' | 'kg' | 'lb' | 'oz';
  material?: string;
  isFeatured?: boolean;
  minOrderQty?: number;
  initialStock?: number;
}

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

  createProduct: async (payload: CreateProductPayload) => {
    const { data } = await api.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.CREATE, payload);
    return data;
  },
};
