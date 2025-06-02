import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { CreateOrdersForm } from '~/models/checkout';
import pb, { fetchPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';
import { CartItem } from '~/models/shop';

export const createOrder = createServerFn({
  method: 'POST',
})
  .validator((d: CreateOrdersForm) => d)
  .handler(async ({ data }) => {
    try {
      const res = await pb.send('/cust/checkout', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      });
      return { success: true, res };
    } catch (error) {
      throw handleError(error);
    }
  });

export const getCartItemBuyNow = createServerFn({
  method: 'GET',
})
  .validator((d: { cart_id: string }) => d)
  .handler(async ({ data: { cart_id } }) => {
    try {
      return await fetchPb<CartItem>('carts', cart_id);
    } catch (error) {
      throw handleError(error);
    }
  });

export const deleteCartItemBuyNow = createServerFn({
  method: 'POST',
})
  .validator((d: { cart_id: string }) => d)
  .handler(async ({ data: { cart_id } }) => {
    try {
      return await pb.collection('carts').delete(cart_id);
    } catch (error) {
      throw handleError(error);
    }
  });