export const USER_LOGIN = 'USER_LOGIN' as const;
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST' as const;
export const USER_LOGIN_COMPLETED = 'USER_LOGIN_COMPLETED' as const;
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR' as const;
export const USER_LOGIN_RESET = 'USER_LOGIN_RESET' as const;
export const AUTH_CLEAR_LOGIN_ERROR = 'AUTH_CLEAR_LOGIN_ERROR' as const;
export const AUTH_CLEAR_REGISTER_ERROR = 'AUTH_CLEAR_REGISTER_ERROR' as const;

export type LoginPayload = {
  email: string;
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

export type AuthClearLoginErrorAction = {
  type: typeof AUTH_CLEAR_LOGIN_ERROR;
};

export type AuthClearRegisterErrorAction = {
  type: typeof AUTH_CLEAR_REGISTER_ERROR;
};

export const USER_GOOGLE_LOGIN = 'USER_GOOGLE_LOGIN' as const;

export type GoogleLoginPayload = {
  idToken: string;
};

export type UserGoogleLoginAction = {
  type: typeof USER_GOOGLE_LOGIN;
  payload: GoogleLoginPayload;
};

export type AuthAction =
  | UserLoginAction
  | UserGoogleLoginAction
  | UserLoginRequestAction
  | UserLoginCompletedAction
  | UserLoginErrorAction
  | UserLoginResetAction
  | AuthClearLoginErrorAction
  | AuthClearRegisterErrorAction
  | UserRegisterAction
  | UserRegisterRequestAction
  | UserRegisterCompletedAction
  | UserRegisterErrorAction
  | UserRegisterResetAction;

export const USER_REGISTER = 'USER_REGISTER' as const;
export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST' as const;
export const USER_REGISTER_COMPLETED = 'USER_REGISTER_COMPLETED' as const;
export const USER_REGISTER_ERROR = 'USER_REGISTER_ERROR' as const;
export const USER_REGISTER_RESET = 'USER_REGISTER_RESET' as const;

export type RegisterPayload = {
  email: string;
  password: string;
};

export type UserRegisterAction = {
  type: typeof USER_REGISTER;
  payload: RegisterPayload;
};

export type UserRegisterRequestAction = {
  type: typeof USER_REGISTER_REQUEST;
};

export type UserRegisterCompletedAction = {
  type: typeof USER_REGISTER_COMPLETED;
  payload: { message: string };
};

export type UserRegisterErrorAction = {
  type: typeof USER_REGISTER_ERROR;
  payload: string;
};

export type UserRegisterResetAction = {
  type: typeof USER_REGISTER_RESET;
};
