import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { PaginationAPI } from '~/models';
import { getOrderHistory } from '~/server/profile';

export const orderHistoryQueryOption = (pagination: PaginationAPI) =>
  queryOptions({
    queryKey: ['orderHistory', pagination],
    queryFn: () => getOrderHistory({ data: pagination }),
    staleTime: 0,
  });

export const useOrderHistory = (pagination: PaginationAPI) => {
  const { data: orderHistory } = useSuspenseQuery(
    orderHistoryQueryOption(pagination),
  );

  return { orderHistory };
};
