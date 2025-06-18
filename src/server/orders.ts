import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { SearchParamsAPI } from '~/models';
import { OrderHistoryItemRes, OrderHistoryItems } from '~/models/profile';
import { OrderProductItem, ProductItem } from '~/models/shop';
import pb, { fetchFilterPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

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
  .validator((d: SearchParamsAPI) => d)
  .handler(async ({ data: { page, limit, status } }) => {
    try {
      const url = '/cust/order-list';

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const orders = await pb.send<OrderHistoryItemRes>(
        `${url}?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      );

      return orders;
    } catch (error) {
      throw handleError(error);
    }
  });
