import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
  createAddCart,
  deleteCartItem,
  editCartItem,
  getCartItems,
  getCountCartItems,
} from '~/server/shop';
import { queryClient } from '~/services/queryClient';
import { useProducts } from './useProducts';

export const getCartItemsQueryOption = () =>
  queryOptions({
    queryKey: ['addCartItems'],
    queryFn: getCartItems,
    staleTime: 1,
  });

// Mock data fetching with TanStack Query
export const useCountCartItems = () => {
  return useQuery({
    queryKey: ['countCartItems'],
    queryFn: getCountCartItems,
    initialData: 0,
    staleTime: 1,
  });
};

export const useAddCart = () => {
  const navigate = useNavigate();
  const { mutateAsync: addCart } = useMutation({
    mutationFn: createAddCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countCartItems'] });
      navigate({ to: '/shop/add-cart' });
    },
  });

  return { addCart };
};

export function useCartPage() {
  const { data: cartItem } = useSuspenseQuery(getCartItemsQueryOption());
  const { productsData } = useProducts();

  const enrichedCartItems = useMemo(() => {
    return Array.from(
      new Map(
        (cartItem || []).map((item) => [
          item.id,
          {
            ...item,
            name:
              productsData?.find((p) => p.id === item.product_id)?.name ?? '',
            price:
              productsData?.find((p) => p.id === item.product_id)?.price ?? 0,
            image_url:
              productsData?.find((p) => p.id === item.product_id)
                ?.image_url?.[0] ?? '',
          },
        ]),
      ).values(),
    );
  }, [cartItem, productsData]);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countCartItems'] });
      queryClient.invalidateQueries(getCartItemsQueryOption());
    },
  });

  const { mutate: editMutation } = useMutation({
    mutationFn: editCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countCartItems'] });
      queryClient.invalidateQueries(getCartItemsQueryOption());
    },
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItem = enrichedCartItems?.find((item) => item.id === id);
    if (!updatedItem) return;

    editMutation({
      data: {
        id: updatedItem?.id,
        formData: {
          customer_id: localStorage.getItem('customer_id') as string,
          product_id: updatedItem?.product_id,
          quantity: newQuantity,
          status: updatedItem?.status,
        },
      },
    });
  };

  const handleRemoveItem = (id: string) => {
    deleteMutation({
      data: { id },
    });
  };

  const calculateSubtotal = () => {
    return enrichedCartItems?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return {
    // Data
    enrichedCartItems,

    // Function
    handleQuantityChange,
    handleRemoveItem,
    calculateSubtotal,
  };
}
