export interface LoginForm {
  identity: string;
  password: string;
}

export interface SignupForm {
  username: string;
  name?: string;
  phone_number: string;
  email: string;
  emailVisibility?: boolean;
  avatar?: string;
  password: string;
  passwordConfirm: string;
  address_id?: string;
  verified?: boolean;
  status?: boolean;
}

export interface VerifyEmail {
  avatar: string
  collectionId: string
  collectionName: string
  created: string
  email: string
  emailVisibility: boolean
  id: string
  name: string
  phone_number: string
  updated: string
  username: string
  verified: boolean
}
