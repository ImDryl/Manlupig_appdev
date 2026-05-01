export const USER_LOGIN = 'USER_LOGIN' as const;
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST' as const;
export const USER_LOGIN_COMPLETED = 'USER_LOGIN_COMPLETED' as const;
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR' as const;
export const USER_LOGIN_RESET = 'USER_LOGIN_RESET' as const;

export type LoginPayload = {
  username: string;
  password: string;
};

export type UserLoginAction = {
  type: typeof USER_LOGIN;
  payload: LoginPayload;
};

export type UserLoginRequestAction = {
  type: typeof USER_LOGIN_REQUEST;
};

export type UserLoginCompletedAction = {
  type: typeof USER_LOGIN_COMPLETED;
  payload: unknown;
};

export type UserLoginErrorAction = {
  type: typeof USER_LOGIN_ERROR;
  payload: string;
};

export type UserLoginResetAction = {
  type: typeof USER_LOGIN_RESET;
};

export type AuthAction =
  | UserLoginAction
  | UserLoginRequestAction
  | UserLoginCompletedAction
  | UserLoginErrorAction
  | UserLoginResetAction;
