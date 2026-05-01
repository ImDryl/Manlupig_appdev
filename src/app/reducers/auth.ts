import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
  type AuthAction,
  type LoginPayload,
  type UserLoginAction,
  type UserLoginResetAction,
} from '../actions';

export type AuthState = {
  data: unknown;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
};

const INITIAL_STATE: AuthState = {
  data: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
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
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const userLogin = (payload: LoginPayload): UserLoginAction => ({
  type: USER_LOGIN,
  payload,
});

export const resetLogin = (): UserLoginResetAction => ({
  type: USER_LOGIN_RESET,
});
