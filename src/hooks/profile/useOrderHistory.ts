import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { PaginationAPI } from '~/models';
import { getOrderHistory, getOrderHistoryItems } from '~/server/orders';

export const orderHistoryQueryOption = (pagination: PaginationAPI) =>
  queryOptions({
    queryKey: ['orderHistory', pagination],
    queryFn: () => getOrderHistory({ data: pagination }),
    staleTime: 0,
  });

export const orderHistoryItemQueryOption = (order_id: string) =>
  queryOptions({
    queryKey: ['orderHistoryItem', order_id],
    queryFn: () => getOrderHistoryItems({ data: { order_id } }),
    staleTime: 0,
  });

export const useOrderHistory = (
  pagination: PaginationAPI,
  order_id: string,
) => {
  const { data: orderHistory } = useSuspenseQuery(
    orderHistoryQueryOption(pagination),
  );

  const { data: orderItems } = useSuspenseQuery(
    orderHistoryItemQueryOption(order_id),
  );
  return { orderHistory, orderItems };
};
