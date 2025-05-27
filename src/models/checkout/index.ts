export interface CreateAddressesForm {
  customer_id: string;
  province_id: string;
  district_id: string;
  village: string;
  shipping_name: string;
}

export interface CreateOrdersForm {
  cartItems: string[];
  remark: string;
}
