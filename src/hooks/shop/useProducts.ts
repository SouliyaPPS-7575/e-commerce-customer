import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategoryAll } from '~/server/shop';

export const productsQueryOption = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getProducts,
  });

export const productsByCategoryAllQueryOption = (categoryId: string) =>
  queryOptions({
    queryKey: ['productsByCategoryAll', categoryId],
    queryFn: () =>
      getProductsByCategoryAll({ data: { category_id: categoryId } }),
  });

export const useProducts = () => {
  const { data: productsData, isLoading } = useSuspenseQuery(
    productsQueryOption(),
  );

  return { productsData, isLoading };
};
