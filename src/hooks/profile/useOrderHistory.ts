import { queryOptions, useQuery } from '@tanstack/react-query';
import { SearchParamsAPI } from '~/models';
import { getOrderHistory, getOrderHistoryItems } from '~/server/orders';

export const orderHistoryQueryOption = (searchParams: SearchParamsAPI) =>
  queryOptions({
    queryKey: ['orderHistory', searchParams],
    queryFn: () => getOrderHistory({ data: searchParams }),
    staleTime: 0,
  });

export const orderHistoryItemQueryOption = (order_id: string) =>
  queryOptions({
    queryKey: ['orderHistoryItem', order_id],
    queryFn: () => getOrderHistoryItems({ data: { order_id } }),
    staleTime: 0,
  });

export const useOrderHistory = (
  searchParams: SearchParamsAPI,
  order_id: string,
) => {
  const { data: orderHistory, isLoading: isLoadingOrderHistory } = useQuery(
    orderHistoryQueryOption(searchParams),
  );
  const { data: orderItems, isLoading: isLoadingItems } = useQuery(
    orderHistoryItemQueryOption(order_id),
  );

  return {
    orderHistory,
    orderItems,
    isLoading: isLoadingItems || isLoadingOrderHistory,
  };
};
