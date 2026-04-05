import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export interface BackendCartItem {
  product: string;
  productName: string;
  quantity: number;
  priceAtAdd: number;
  currentPrice: number;
  available: number;
}

export interface BackendCart {
  _id: string;
  user: string;
  items: BackendCartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const cartApi = {
  getCart: async (): Promise<BackendCart> => {
    const { data } = await api.get<{ success: boolean; data: BackendCart }>(API_ENDPOINTS.CART.GET);
    return data.data;
  },

  addItem: async (productId: string, quantity: number): Promise<void> => {
    await api.post(API_ENDPOINTS.CART.ADD, { productId, quantity });
  },

  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    await api.patch(API_ENDPOINTS.CART.UPDATE(productId), { quantity });
  },

  removeItem: async (productId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.CART.REMOVE(productId));
  },

  clearCart: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.CART.CLEAR);
  },
};
