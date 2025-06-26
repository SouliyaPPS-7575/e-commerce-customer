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
  .handler(async ({ data: { page = 1, limit = 10, status, createdAt } }) => {
    try {
      const url = '/cust/order-list';

      const queryParams = new URLSearchParams();

      // Pagination
      if (status === '') {
        queryParams.append('limit', '5000'); // fallback to large number
        queryParams.append('page', '1');
      } else {
        const validPage = Math.max(1, Number(page) || 1);
        const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
        queryParams.append('page', validPage.toString());
        queryParams.append('limit', validLimit.toString());
      }

      // Status filter
      if (status?.trim()) {
        queryParams.append('status', status.trim());
      } else {
        queryParams.append('status', '');
      }

      // ✅ Add createdAt date filter if present
      if (createdAt?.trim()) {
        queryParams.append('createdAt', createdAt.trim());
      }

      const fullUrl = `${url}?${queryParams.toString()}`;
      console.log('Fetching orders:', fullUrl);

      const orders = await pb.send<OrderHistoryItemRes>(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      });

      return orders;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw handleError(error);
    }
  });
