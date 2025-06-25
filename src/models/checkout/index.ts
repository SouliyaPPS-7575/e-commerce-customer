export interface CreateAddressesForm {
  // laos address
  customer_id: string;
  province_id: string;
  district_id: string;
  village: string;
  shipping_name: string;

  // global address
  country_code: string;
  country_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  is_international: boolean;
}

export interface EditAddressesForm {
  // laos address
  customer_id: string;
  province_id: string;
  district_id: string;
  village: string;
  shipping_name: string;

  // global address
  country_code: string;
  country_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  is_international: boolean;
}

export interface CreateOrdersForm {
  cartItems: string[];
  remark: string;
}

export interface ViewAddress {
  // laos address
  collectionId: string;
  collectionName: string;
  id: string;
  customer_id: string;
  province_id: string;
  district_id: string;
  village: string;
  shipping_name: string;

  // global address
  country_code: string;
  country_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  is_international: boolean;

  // common
  created: string;
  updated: string;
}

export interface OrderItems {
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  collectionId: string;
  collectionName: string;
  id: string;
  customer_id: string;
  product_id: string;
  status: string;
  created: string;
  updated: string;
}
[];

export interface CheckoutResponse {
  message: string;
  order_id: string;
}
