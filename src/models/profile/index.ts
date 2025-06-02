export interface Provinces {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  name_en: string;
  prefix: string;
  created: string;
  updated: string;
}

export interface Districts {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  name_en: string;
  province_id: string;
  created: string;
  updated: string;
}

export interface GetMe {
  address_id: string;
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  phone_number: string;
  updated: string;
  username: string;
  verified: boolean;
}

export interface EditProfileForm {
  username?: string;
  name?: string;
  phone_number?: string;
  emailVisibility?: boolean;
  address_id?: string;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}

export interface OrderHistoryDetails {
  collectionId: string;
  collectionName: string;
  id: string;
  customer_id: string;
  customer_name: string;
  phone_number: string;
  address_id: string;
  address: string;
  status: string;
  reference_id: string;
  remark: string;
  created: string;
  updated: string;
}

export interface OrderHistoryItems {
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
