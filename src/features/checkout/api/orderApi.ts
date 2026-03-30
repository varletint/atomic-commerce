import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types';
import type { Order, PaymentMethod, ProcessPaymentResponse } from '@/types/order';
import type { Address } from '@/types/user';

interface CreateOrderPayload {
  idempotencyKey: string;
  shippingAddress: Address;
}

interface ProcessPaymentPayload {
  paymentMethod: PaymentMethod;
  provider: string;
  idempotencyKey: string;
  callbackUrl?: string;
}

export const orderApi = {
  createOrder: (data: CreateOrderPayload) =>
    api.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CREATE, data),

  processPayment: (orderId: string, data: ProcessPaymentPayload) =>
    api.post<ApiResponse<ProcessPaymentResponse>>(
      API_ENDPOINTS.ORDERS.PROCESS_PAYMENT(orderId),
      data
    ),

  verifyPayment: (orderId: string, reference: string) =>
    api.get<ApiResponse<{ order: Order; transaction: import('@/types/order').Transaction }>>(
      API_ENDPOINTS.ORDERS.VERIFY_PAYMENT(orderId, reference)
    ),

  getUserOrders: (page = 1, limit = 20) =>
    api.get<ApiResponse<{ orders: Order[]; total: number; page: number; totalPages: number }>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params: { page, limit } }
    ),

  getOrderById: (orderId: string) =>
    api.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(orderId)),

  cancelOrder: (orderId: string, reason: string) =>
    api.patch<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CANCEL(orderId), { reason }),
};
