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
