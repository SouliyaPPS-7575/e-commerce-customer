import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getCartItemBuyNow } from '~/server/checkout';

export const getBuyNowCartItemQueryOption = (cart_id: string) =>
  queryOptions({
    queryKey: ['buyNowCartItem', cart_id],
    queryFn: () =>
      getCartItemBuyNow({
        data: { cart_id },
      }),
    staleTime: 0,
  });

export const useBuyNowCartItem = (cart_id: string) => {
  const { data: cartItem } = useSuspenseQuery(
    getBuyNowCartItemQueryOption(cart_id),
  );
  return { cartItem };
};
