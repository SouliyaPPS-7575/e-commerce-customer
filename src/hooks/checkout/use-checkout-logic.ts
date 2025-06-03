import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { localStorageData } from '~/server/cache';
import { createOrder } from '~/server/checkout';
import { queryClient } from '~/services/queryClient';
import { useDeleteCartItem } from '../shop/useDeleteCartItem';
import { getCartItemsQueryOption, useCountCartItems } from '../shop/useAddCart';
import { queryKeyCountCartItems } from '../shop';

export function useCheckoutLogic(selectedItemIds?: string[]) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  const { mutate: createOrderMutate } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success(t('successfully'));

      if (currentPath === '/shop/checkout') {
        queryClient.invalidateQueries(getCartItemsQueryOption());
        navigate({ to: '/shop/add-cart' });
      } else {
        queryClient.invalidateQueries(getCartItemsQueryOption());
        history.back();
      }

      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
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
    isSubmitting,
    setIsSubmitting,
    formCheckout,
    createOrderMutate,
  };
}
