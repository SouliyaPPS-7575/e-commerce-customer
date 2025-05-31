import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { CreateOrdersForm } from '~/models/checkout';
import pb from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

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
