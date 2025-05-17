import { createServerFn } from '@tanstack/react-start';
import {
  CartItem,
  CategoriesItem,
  CreateAddCart,
  CurrencyItem,
  EditCartItem,
  ProductItem,
  ProductRankingItem,
  RelateProductsItem,
} from '~/models/shop';
import pb, {
  createPb,
  fetchAllPb,
  fetchPb,
} from '~/services/pocketbaseService';
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

export const getRelateProducts = createServerFn({
  method: 'GET',
})
  .validator((d: { product_id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const { product_id } = data;

      // Find the record that matches the product_id
      const resultList = await pb
        .collection('relate_products')
        .getList<RelateProductsItem>(1, 50, {
          filter: `product_id = "${product_id}"`,
        });
      // Return just the first matched item (should only be one per product_id)
      return resultList.items.length > 0
        ? resultList.items[0].relate_product_id
        : [];
    } catch (error) {
      throw handleError(error);
    }
  });

export const getCurrency = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await fetchAllPb<CurrencyItem>('currency');
  } catch (error) {
    throw handleError(error);
  }
});

export const createAddCart = createServerFn({ method: 'POST' })
  .validator((d: CreateAddCart) => d)
  .handler(async ({ data }) => {
    try {
      const addCart = await createPb<CreateAddCart>('carts', data);

      return { success: true, addCart };
    } catch (error) {
      throw handleError(error);
    }
  });

export const getCartItems = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await pb.collection<CartItem>('carts').getFullList();
  } catch (error) {
    throw handleError(error);
  }
});

export const deleteCartItem = createServerFn({
  method: 'POST',
})
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    try {
      return await pb.collection('carts').delete(data.id);
    } catch (error) {
      throw handleError(error);
    }
  });

export const editCartItem = createServerFn({
  method: 'POST',
})
  .validator((d: { id: string; formData: EditCartItem }) => d)
  .handler(async ({ data }) => {
    try {
      return await pb.collection('carts').update(data.id, data.formData);
    } catch (error) {
      console.error('Cart update error:', error);
      throw handleError(error);
    }
  });

export const getCountCartItems = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const cartItems = await fetchAllPb<CartItem>('carts');
    const countCartItems = cartItems.length;
    return Promise.resolve(countCartItems);
  } catch (error) {
    throw handleError(error);
  }
});
