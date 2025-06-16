import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getOrderHistoryItems } from '~/server/orders';

export const getOrderItemQueryOption = (order_id: string) =>
  queryOptions({
    queryKey: ['orderItems', order_id],
    queryFn: () => getOrderHistoryItems({ data: { order_id } }),
    staleTime: 0,
  });

export const useOrderItem = (order_id: string) => {
  const { data: orders } = useSuspenseQuery(getOrderItemQueryOption(order_id));

  return {
    orderItem: orders,
  };
};
