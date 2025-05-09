import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getProducts } from '~/server/shop';

export const productsQueryOption = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getProducts,
  });

export const useProducts = () => {
  const { data: productsData, isLoading } = useSuspenseQuery(
    productsQueryOption(),
  );

  return { productsData, isLoading };
};
