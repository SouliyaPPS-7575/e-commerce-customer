import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getProducts } from '~/server/shop';

export const productsQueryOption = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1,
  });

export const useProducts = () => {
  const { data: productsData, isLoading } = useSuspenseQuery(
    productsQueryOption(),
  );

  return { productsData, isLoading };
};
