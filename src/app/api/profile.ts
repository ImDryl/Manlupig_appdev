import { authGetJson, authPatchJson } from './http';
import type { ProfileApiResponse, ProfileData } from '../../types/profile';

export async function fetchProfile(token: string): Promise<ProfileData> {
  const response = await authGetJson<ProfileApiResponse>('/profile', token);
  return response.data;
}

export async function updateProfile(
  token: string,
  email: string,
): Promise<ProfileData> {
  const response = await authPatchJson<ProfileApiResponse>('/profile', token, {
    email: email.trim(),
  });
  return response.data;
}
