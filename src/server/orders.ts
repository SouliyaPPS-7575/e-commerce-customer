import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { PaginationAPI } from '~/models';
import { OrderHistoryDetails, OrderHistoryItems } from '~/models/profile';
import pb, { fetchFilterPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';
import { OrderProductItem, ProductItem } from '~/models/shop';

export const getOrderItems = createServerFn({
  method: 'GET',
})
  .validator((d: { order_id: string }) => d)
  .handler(async ({ data: { order_id } }) => {
    try {
      const orderItems = await fetchFilterPb<OrderHistoryItems>(
        'order_items',
        'order_id',
        order_id,
      );

      return orderItems;
    } catch (error) {
      throw handleError(error);
    }
  });

export const getOrderHistoryItems = createServerFn({
  method: 'GET',
})
  .validator((d: { order_id: string }) => d)
  .handler(async ({ data: { order_id } }) => {
    try {
      const orderItems = await fetchFilterPb<OrderHistoryItems>(
        'order_items',
        'order_id',
        order_id,
      );

      const productIds = orderItems.map((item) => item.product_id);

      // Create filter for products using their IDs
      const filterProductIds = productIds
        .map((id) => `id="${id}"`)
        .join(' || ');

      const productItems = await pb
        .collection('products')
        .getFullList<ProductItem>({
          filter: filterProductIds,
        });

      // Add status field to each product based on its order item
      const orderItemsWithProducts = {
        orderItems,
        products: productItems.map((item) => {
          return {
            ...item,
            quantity:
              orderItems.find((orderItem) => orderItem.product_id === item.id)
                ?.quantity || 0,
            status: orderItems.find(
              (orderItem) => orderItem.product_id === item.id,
            )?.status,
          };
        }) as OrderProductItem[],
      };

      return orderItemsWithProducts;
    } catch (error) {
      throw handleError(error);
    }
  });

export const getOrderHistory = createServerFn({
  method: 'GET',
})
  .validator((d: PaginationAPI) => d)
  .handler(async ({ data: { page, limit } }) => {
    try {
      const customer_id = getCookie('customer_id') as string;

      const orders = await pb
        .collection('orders')
        .getList<OrderHistoryDetails>(page, limit, {
          filter: `customer_id="${customer_id}"`,
        });

      return orders;
    } catch (error) {
      throw handleError(error);
    }
  });
