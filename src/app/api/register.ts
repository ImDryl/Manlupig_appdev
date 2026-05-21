import {
  MOBILE_APP_CLIENT_HEADER,
  MOBILE_APP_CLIENT_VALUE,
} from '../../config/appClient';
import { postJson } from './http';

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    isVerified: boolean;
    roles: string[];
  };
};

export async function authRegister({ email, password }: RegisterPayload) {
  return postJson<RegisterResponse>(
    '/register',
    {
      email: email.trim().toLowerCase(),
      password,
    },
    { [MOBILE_APP_CLIENT_HEADER]: MOBILE_APP_CLIENT_VALUE },
  );
}
