import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '~/routes/shop/view.$productID.$categoryID';
import { getProductsByCategory } from '~/server/shop';

export const productsByCategoryQueryOption = (categoryId: string) =>
  queryOptions({
    queryKey: ['productsByCategory', categoryId],
    queryFn: () =>
      getProductsByCategory({
        data: { category_id: categoryId },
      }),
  });

export const useProductsByCategory = () => {
  const { categoryID } = Route.useParams();

  const { data: productsByCategoryData, isLoading } = useSuspenseQuery(
    productsByCategoryQueryOption(categoryID),
  );
  return {
    productsByCategoryData,
    isLoading,
  };
};
