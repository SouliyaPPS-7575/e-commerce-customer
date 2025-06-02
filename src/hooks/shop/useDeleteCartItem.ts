import { useMutation } from '@tanstack/react-query';
import { deleteCartItemBuyNow } from '~/server/checkout';

export const useDeleteCartItem = () => {
  const { mutate: deleteCartItem } = useMutation({
    mutationFn: deleteCartItemBuyNow,
    onSuccess: () => {},
  });

  return { deleteCartItem };
};
