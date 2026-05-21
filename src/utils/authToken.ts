import type { RootState } from '../app/reducers';

export type AuthUser = {
  id?: number;
  email?: string;
  roles?: string[];
  verified?: boolean;
};

type AuthPayload = {
  data?: { token?: string; user?: AuthUser };
  token?: string;
  user?: AuthUser;
};

export function getAuthToken(state: RootState): string | null {
  const raw = state.auth?.data as AuthPayload | null;
  if (!raw) {
    return null;
  }
  return raw.data?.token ?? raw.token ?? null;
}

export function getAuthUserEmail(state: RootState): string | null {
  return getAuthUser(state)?.email ?? null;
}

export function getAuthUser(state: RootState): AuthUser | null {
  const raw = state.auth?.data as AuthPayload | null;
  if (!raw) {
    return null;
  }
  return raw.data?.user ?? raw.user ?? null;
}

export function getRoleLabel(roles: string[] | undefined): string {
  if (!roles?.length) {
    return 'Customer';
  }
  if (roles.includes('ROLE_ADMIN')) {
    return 'Admin';
  }
  if (roles.includes('ROLE_STAFF')) {
    return 'Staff';
  }
  return 'Customer';
}
