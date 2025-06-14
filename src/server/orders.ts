import { createServerFn } from '@tanstack/react-start';
import pb from '~/services/pocketbaseService';
import { OrderItem } from '../models/orders/index';
import { handleError } from './errorHandler';

export const getOrderItem = createServerFn({
  method: 'GET',
})
  .validator((d: { order_id: string }) => d)
  .handler(async ({ data: { order_id } }) => {
    try {
      const orderItems = await pb
        .collection<OrderItem>('order_items')
        .getFullList({
          filter: `order_id="${order_id}"`,
        });

      return orderItems;
    } catch (error) {
      throw handleError(error);
    }
  });
