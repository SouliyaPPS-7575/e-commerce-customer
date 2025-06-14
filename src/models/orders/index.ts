

export interface OrderItem {
  collectionId: string;
  collectionName: string;
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_lak: number;
  price_usd: number;
  price_thb: number;
  product_name: string;
  created: string;
  updated: string;
}

export interface OrderItemRes {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  order_id: string;
  price_lak: number;
  price_thb: number;
  price_usd: number;
  product_id: string;
  product_name: string;
  quantity: number;
  updated: string;
  image_url: string[];
}
