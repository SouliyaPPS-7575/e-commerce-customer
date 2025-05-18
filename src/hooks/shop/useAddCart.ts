import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  createAddCart,
  deleteCartItem,
  editCartItem,
  getCartItems,
  getCountCartItems,
} from '~/server/shop';
import { queryClient } from '~/services/queryClient';
import { useProducts } from './useProducts';
import { localStorageData } from '~/server/cache';

export const getCartItemsQueryOption = () =>
  queryOptions({
    queryKey: ['addCartItems'],
    queryFn: getCartItems,
    staleTime: 0, // make sure it's not considered "fresh" forever
    refetchInterval: 5000, // poll every 5 seconds
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
  const navigate = useNavigate();

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

  // --- Patch: local cart state and handlers ---
  const [localCartState, setLocalCartState] = useState(
    () =>
      enrichedCartItems?.map((item) => ({
        ...item,
        quantity: Math.max(item.quantity, 1),
      })) || [],
  );

  useEffect(() => {
    setLocalCartState((prev) => {
      const updated = enrichedCartItems.map((item) => {
        const existing = prev.find((i) => i.id === item.id);
        const ensuredQuantity = Math.max(item.quantity, 1);
        return existing?.quantity === ensuredQuantity
          ? existing
          : { ...item, quantity: ensuredQuantity };
      });
      return updated;
    });
  }, [enrichedCartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalCartState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setLocalCartState((prev) => prev.filter((item) => item.id !== id));
  };

  const onClose = () => {
    const originalMap = new Map(
      enrichedCartItems.map((item) => [item.id, item]),
    );

    localCartState.forEach((item) => {
      const original = originalMap.get(item.id);
      if (!original) {
        if (
          !enrichedCartItems.find((enrichedItem) => enrichedItem.id === item.id)
        ) {
          deleteMutation({ data: { id: item.id } });
        }
        return;
      }

      if (original.quantity !== item.quantity) {
        editMutation({
          data: {
            id: item.id,
            formData: {
              customer_id: localStorageData('customer_id').getLocalStrage(),
              product_id: item.product_id,
              quantity: item.quantity,
              status: item.status,
            },
          },
        });
      }
    });

    enrichedCartItems.forEach((item) => {
      if (!localCartState.find((localItem) => localItem.id === item.id)) {
        deleteMutation({ data: { id: item.id } });
      }
    });

    history.back();
  };

  const handleCheckout = () => {
    const originalMap = new Map(
      enrichedCartItems.map((item) => [item.id, item]),
    );

    localCartState.forEach((item) => {
      const original = originalMap.get(item.id);
      if (!original) {
        if (
          !enrichedCartItems.find((enrichedItem) => enrichedItem.id === item.id)
        ) {
          deleteMutation({ data: { id: item.id } });
        }
        return;
      }

      if (original.quantity !== item.quantity) {
        editMutation({
          data: {
            id: item.id,
            formData: {
              customer_id: localStorageData('customer_id').getLocalStrage(),
              product_id: item.product_id,
              quantity: item.quantity,
              status: item.status,
            },
          },
        });
      }
    });

    enrichedCartItems.forEach((item) => {
      if (!localCartState.find((localItem) => localItem.id === item.id)) {
        deleteMutation({ data: { id: item.id } });
      }
    });

    navigate({ to: '/shop/checkout' });
  };

  return {
    // Data
    enrichedCartItems: localCartState,

    // Function
    handleQuantityChange,
    handleRemoveItem,
    calculateSubtotal: () =>
      localCartState.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),

    onClose,
    handleCheckout,
  };
}
