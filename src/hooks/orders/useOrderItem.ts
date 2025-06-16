import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getOrderItems } from '~/server/orders';

export const getOrderItemQueryOption = (order_id: string) =>
  queryOptions({
    queryKey: ['orderItems', order_id],
    queryFn: () => getOrderItems({ data: { order_id } }),
    staleTime: 0,
  });

export const useOrderItem = (order_id: string) => {
  const { data: orderItem } = useSuspenseQuery(
    getOrderItemQueryOption(order_id),
  );

  return {
    orderItem,
  };
};
