import { createServerFn } from '@tanstack/react-start';
import { CategoriesItem, ProductItem, ProductRankingItem } from '~/models/shop';
import { fetchAllPb, fetchPb } from '~/services/pocketbaseService';
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

// This function fetches all categories from the PocketBase database
export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await fetchAllPb<CategoriesItem>('product_categories');
  } catch (error) {
    throw handleError(error);
  }
});
