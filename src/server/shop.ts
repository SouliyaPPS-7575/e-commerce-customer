import { createServerFn } from '@tanstack/react-start';
import { ProductItem, ProductRankingItem } from '~/models/shop';
import pb, { fetchAllPb, fetchPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

// This function fetches all products from the PocketBase database
export const getProducts = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await fetchAllPb<ProductItem>('products');
  } catch (error) {
    throw handleError(error);
  }
});

export const getProductsRanking = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await fetchAllPb<ProductRankingItem>('latest_products');
  } catch (error) {
    throw handleError(error);
  }
});

export const getViewProductDetails = createServerFn({
  method: 'GET',
})
  .validator((d: { productID: string }) => d)
  .handler(async ({ data }) => {
    try {
      const { productID } = data;
      return await fetchPb<ProductItem>('products', productID);
    } catch (error) {
      throw handleError(error);
    }
  });

export const getProductsByCategory = createServerFn({
  method: 'GET',
})
  .validator((d: { category_id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const { category_id } = data;
      return await fetchPb<ProductItem>('product_categories', category_id);
    } catch (error) {
      throw handleError(error);
    }
  });


export const getProductsByCategoryAll = createServerFn({
  method: 'GET',
})
  .validator((d: { category_id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const { category_id } = data;
      return await pb.collection('product_categories').getFullList({
        filter: `category_id = "${category_id}"`,
        sort: '', // Optional: you can sort if needed
      });
    } catch (error) {
      throw handleError(error);
    }
  });