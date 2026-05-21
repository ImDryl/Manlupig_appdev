import { postJson } from './http';

type LoginPayload = {
  email: string;
  password: string;
};

export async function authLogin({ email, password }: LoginPayload) {
  return postJson('/login', {
    email: email.trim().toLowerCase(),
    password,
  });
}
