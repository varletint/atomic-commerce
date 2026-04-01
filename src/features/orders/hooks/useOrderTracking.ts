import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/features/checkout/api/orderApi';

export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ['orderTracking', orderId],
    queryFn: async () => {
      const response = await orderApi.getTrackingEvents(orderId);
      return response.data.data;
    },
    // Poll every 30 seconds to simulate real-time updates for MVP
    refetchInterval: 30000,
    enabled: !!orderId,
  });
};
