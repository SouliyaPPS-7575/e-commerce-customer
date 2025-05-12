import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '~/routes/shop/view.$productID.$categoryID';
import { getRelateProducts, getViewProductDetails } from '~/server/shop';

export const viewProductDetailsQueryOption = (productID: string) =>
  queryOptions({
    queryKey: ['viewProductDetails', productID],
    queryFn: () =>
      getViewProductDetails({
        data: { productID },
      }),
  });

export const relateProductsQueryOption = (product_id: string) =>
  queryOptions({
    queryKey: ['relateProducts'],
    queryFn: () => getRelateProducts({
      data: { product_id }
    }),
  });

export const useViewDetails = () => {
  const { productID } = Route.useParams();
  const { data: product, isLoading } = useSuspenseQuery(
    viewProductDetailsQueryOption(productID),
  );

  const { data: relateProducts } = useSuspenseQuery(
    relateProductsQueryOption(productID),
  );

  return {
    product,
    isLoading,

    relateProducts,
  };
};
