export interface ProductsRes {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: ProductItem[];
}

export interface ProductItem {
  collectionId: string;
  collectionName: string;
  id: string | undefined;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string[];
  created: string;
  updated: string;
}

export interface ProductRankingItem {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  product_id: string;
  rank: number;
  updated: string;
}
