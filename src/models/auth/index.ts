export interface LoginForm {
  phone: string;
  password: string;
}

export interface SignupForm {
  username: string;
  name?: string;
  phone_number: string;
  email: string;
  emailVisibility?: boolean;
  province: string;
  district: string;
  village: string;
  password: string;
  passwordConfirm: string;
  otp?: string;
}
