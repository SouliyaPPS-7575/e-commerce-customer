import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { localStorageData } from '~/server/cache';
import { createOrder } from '~/server/checkout';
import { queryClient } from '~/services/queryClient';
import { queryKeyCountCartItems } from '../shop';
import {
  getCartItemsQueryOption,
  getCountCartItemsQueryOption,
  useCountCartItems,
} from '../shop/useAddCart';
import { useDeleteCartItem } from '../shop/useDeleteCartItem';

export function useCheckoutLogic(selectedItemIds?: string[]) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  const { mutate: createOrderMutate } = useMutation({
    mutationFn: createOrder,
    onSuccess: ({ res }) => {
      toast.success(t('successfully'));

      if (currentPath === '/shop/checkout') {
        // Clear local storage for selected cart items
        queryClient.invalidateQueries({
          queryKey: getCartItemsQueryOption().queryKey,
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: getCountCartItemsQueryOption().queryKey,
          exact: true,
        });
        navigate({
          to: '/shop/ordered-success/$order_id',
          params: { order_id: res.order_id },
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: getCartItemsQueryOption().queryKey,
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: getCountCartItemsQueryOption().queryKey,
          exact: true,
        });
        navigate({
          to: '/shop/ordered-success/$order_id',
          params: { order_id: res.order_id },
        });
      }
    },
  });

  const { deleteCartItem } = useDeleteCartItem();
  const { refetchCountCartItems } = useCountCartItems();

  const formCheckout = useForm({
    defaultValues: {
      remark: '',
    },
    onSubmit: ({ value }) => {
      return new Promise((resolve, reject) => {
        createOrderMutate(
          {
            data: {
              cartItems: selectedItemIds ? selectedItemIds : [],
              remark: value.remark,
            },
          },
          {
            onSuccess: () => {
              resolve(undefined);
              localStorageData('selected_cart_items').removeLocalStorage();
              selectedItemIds?.forEach((id) => {
                deleteCartItem({ data: { cart_id: id } });
              });
              refetchCountCartItems();
              queryClient.invalidateQueries(getCartItemsQueryOption());
              queryClient.invalidateQueries({
                queryKey: queryKeyCountCartItems,
              });
            },
            onError: (error) => reject(error),
          },
        );
      });
    },
  });

  return {
    formCheckout,
    createOrderMutate,
  };
}
