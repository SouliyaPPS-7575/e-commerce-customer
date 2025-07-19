import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CartItem } from '~/models/shop';
import { localStorageData } from '~/server/cache';
import {
  createAddCart,
  deleteCartItem,
  editCartItem,
  getCartItems,
  getCountCartItems,
} from '~/server/shop';
import { queryClient } from '~/services/queryClient';
import { queryKeyCountCartItems, queryKeyGetCartItems } from '.';
import { useProducts } from './useProducts';

export const getCartItemsQueryOption = () =>
  queryOptions({
    queryKey: queryKeyGetCartItems,
    queryFn: getCartItems,
    staleTime: 0,
  });

export const getCountCartItemsQueryOption = () =>
  queryOptions({
    queryKey: queryKeyCountCartItems,
    queryFn: getCountCartItems,
    staleTime: 0,
  });

// Mock data fetching with TanStack Query
export const useCountCartItems = () => {
  const { data: countCartItems, refetch: refetchCountCartItems } = useQuery({
    queryKey: queryKeyCountCartItems,
    queryFn: getCountCartItems,
    initialData: 0,
    staleTime: 0,
  });

  return { countCartItems, refetchCountCartItems };
};

export const useAddCart = () => {
  const { t } = useTranslation();
  const { mutateAsync: addCart } = useMutation({
    mutationFn: createAddCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyCountCartItems });
      toast.success(t('item_added_cart'));
    },
  });

  return { addCart };
};

export type LocalCartItem = CartItem & {
  quantity: number; // This is redundant if `EnrichedCartItem` already has `quantity`
  price: number; // Ensure price is always a number
};

export function useCartPage() {
  const navigate = useNavigate();

  const { data: cartItem, refetch: refetchCartItems } = useSuspenseQuery(
    getCartItemsQueryOption(),
  );
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
            category_id:
              productsData?.find((p) => p.id === item.product_id)
                ?.category_id ?? '',
            total_count:
              productsData?.find((p) => p.id === item.product_id)
                ?.total_count ?? 0,
          },
        ]),
      ).values(),
    );
  }, [cartItem, productsData]);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyCountCartItems });
      queryClient.invalidateQueries(getCartItemsQueryOption());
    },
  });

  const { mutate: editMutation } = useMutation({
    mutationFn: editCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyCountCartItems });
      queryClient.invalidateQueries(getCartItemsQueryOption());
    },
  });

  // --- Patch: local cart state and handlers ---
  const [localCartState, setLocalCartState] = useState<any[]>(
    () =>
      enrichedCartItems?.map((item) => ({
        ...item,
        quantity: Math.max(item.quantity, 1),
      })) || [],
  );

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const selectedItemStorage = localStorageData('selected_cart_items');

  useEffect(() => {
    const saved = selectedItemStorage.getLocalStrage();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedItemIds(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

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
    deleteMutation({ data: { id } });
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      selectedItemStorage.setLocalStorage(JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const selectAllItems = () => {
    setSelectedItemIds((prev) => {
      const newSelection =
        prev.length === localCartState.length
          ? []
          : localCartState.map((item) => item.id);
      selectedItemStorage.setLocalStorage(JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const calculateSubtotal = () =>
    localCartState.reduce(
      (total, item) =>
        selectedItemIds.includes(item.id)
          ? total + item.price * item.quantity
          : total,
      0,
    );

  const onClose = useCallback(() => {
    if (enrichedCartItems.length === 0) {
      navigate({
        to: '/shop/index/$category_id',
        params: { category_id: 'all' },
      });
    }
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

    navigate({
      to: '/shop/index/$category_id',
      params: { category_id: 'all' },
    });
  }, [
    enrichedCartItems,
    localCartState,
    deleteMutation,
    editMutation,
    navigate,
  ]);

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

    navigate({ to: '/shop/checkout', search: { tab: 0 } });
  };

  return {
    // Data
    enrichedCartItems: localCartState,
    selectedItemIds,
    localCartState,
    selectedItemStorage,
    setLocalCartState,

    // Function
    handleQuantityChange,
    handleRemoveItem,
    toggleSelectItem,
    selectAllItems,
    calculateSubtotal,
    editMutation,

    onClose,
    handleCheckout,
    refetchCartItems,
  };
}
