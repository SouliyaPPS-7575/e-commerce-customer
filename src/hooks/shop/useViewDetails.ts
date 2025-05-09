import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '~/routes/shop/view.$productID.$categoryID';
import { getViewProductDetails } from '~/server/shop';

export const viewProductDetailsQueryOption = (productID: string) =>
  queryOptions({
    queryKey: ['viewProductDetails', productID],
    queryFn: () =>
      getViewProductDetails({
        data: { productID },
      }),
  });

export const useViewDetails = () => {
  const { productID } = Route.useParams();
  const { data: product, isLoading } = useSuspenseQuery(
    viewProductDetailsQueryOption(productID),
  );

  return {
    product,
    isLoading,
  };
};
