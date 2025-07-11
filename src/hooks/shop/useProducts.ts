import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getProducts } from '~/server/shop';

export const productsQueryOption = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 0,
  });

export const useProducts = () => {
  const { data: productsData, isLoading } = useSuspenseQuery(
    productsQueryOption(),
  );

  const filteredProductsData = productsData.filter((product: any) => !product.is_delete);
  return { productsData: filteredProductsData, isLoading };
};
