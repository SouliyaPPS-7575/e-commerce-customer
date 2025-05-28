export interface CreateAddressesForm {
  customer_id: string;
  province_id: string;
  district_id: string;
  village: string;
  shipping_name: string;
}

export interface EditAddressesForm {
  customer_id: string
  province_id: string
  district_id: string
  village: string
  shipping_name: string
}


export interface CreateOrdersForm {
  cartItems: string[];
  remark: string;
}


export interface ViewAddress {
  collectionId: string
  collectionName: string
  id: string
  customer_id: string
  province_id: string
  district_id: string
  village: string
  shipping_name: string
  created: string
  updated: string
}
