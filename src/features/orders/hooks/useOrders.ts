import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/features/checkout/api/orderApi';

export const useOrders = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const response = await orderApi.getUserOrders(page, limit);
      return response.data.data;
    },
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await orderApi.getOrderById(orderId);
      return response.data.data;
    },
    enabled: !!orderId,
  });
};
