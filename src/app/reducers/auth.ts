import {
  USER_GOOGLE_LOGIN,
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
  AUTH_CLEAR_LOGIN_ERROR,
  AUTH_CLEAR_REGISTER_ERROR,
  USER_REGISTER,
  USER_REGISTER_COMPLETED,
  USER_REGISTER_ERROR,
  USER_REGISTER_REQUEST,
  USER_REGISTER_RESET,
  type AuthAction,
  type LoginPayload,
  type RegisterPayload,
  type GoogleLoginPayload,
  type UserGoogleLoginAction,
  type UserLoginAction,
  type UserLoginResetAction,
  type AuthClearLoginErrorAction,
  type AuthClearRegisterErrorAction,
  type UserRegisterAction,
  type UserRegisterResetAction,
} from '../actions';

export type AuthState = {
  data: unknown;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isRegistering: boolean;
  isRegisterSuccess: boolean;
  registerError: string | null;
  registerMessage: string | null;
};

const INITIAL_STATE: AuthState = {
  data: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
  isRegistering: false,
  isRegisterSuccess: false,
  registerError: null,
  registerMessage: null,
};

export default function authReducer(
  state: AuthState = INITIAL_STATE,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        data: null,
        isLoading: true,
        isError: false,
        errorMessage: null,
      };

    case USER_LOGIN_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
        errorMessage: null,
      };

    case USER_LOGIN_ERROR:
      return {
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        errorMessage: action.payload || 'Login failed',
      };

    case USER_LOGIN_RESET:
      return {
        ...INITIAL_STATE,
        isRegistering: state.isRegistering,
        isRegisterSuccess: state.isRegisterSuccess,
        registerError: state.registerError,
        registerMessage: state.registerMessage,
      };

    case USER_REGISTER_REQUEST:
      return {
        ...state,
        isRegistering: true,
        isRegisterSuccess: false,
        registerError: null,
        registerMessage: null,
      };

    case USER_REGISTER_COMPLETED:
      return {
        ...state,
        isRegistering: false,
        isRegisterSuccess: true,
        registerError: null,
        registerMessage: action.payload.message,
      };

    case USER_REGISTER_ERROR:
      return {
        ...state,
        isRegistering: false,
        isRegisterSuccess: false,
        registerError: action.payload || 'Registration failed',
        registerMessage: null,
      };

    case USER_REGISTER_RESET:
      return {
        ...state,
        isRegistering: false,
        isRegisterSuccess: false,
        registerError: null,
        registerMessage: null,
      };

    case AUTH_CLEAR_LOGIN_ERROR:
      return {
        ...state,
        isError: false,
        errorMessage: null,
      };

    case AUTH_CLEAR_REGISTER_ERROR:
      return {
        ...state,
        registerError: null,
      };

    default:
      return state;
  }
}

export const userLogin = (payload: LoginPayload): UserLoginAction => ({
  type: USER_LOGIN,
  payload,
});

export const userGoogleLogin = (
  payload: GoogleLoginPayload,
): UserGoogleLoginAction => ({
  type: USER_GOOGLE_LOGIN,
  payload,
});

export const userRegister = (payload: RegisterPayload): UserRegisterAction => ({
  type: USER_REGISTER,
  payload,
});

export const resetLogin = (): UserLoginResetAction => ({
  type: USER_LOGIN_RESET,
});

export const resetRegister = (): UserRegisterResetAction => ({
  type: USER_REGISTER_RESET,
});

export const clearLoginError = (): AuthClearLoginErrorAction => ({
  type: AUTH_CLEAR_LOGIN_ERROR,
});

export const clearRegisterError = (): AuthClearRegisterErrorAction => ({
  type: AUTH_CLEAR_REGISTER_ERROR,
});
